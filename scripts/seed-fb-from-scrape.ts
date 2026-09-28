/**
 * One-shot import of Facebook scrape JSON → Supabase vehicles.
 * Usage: npx tsx --env-file=.env.local scripts/seed-fb-from-scrape.ts [path/to/fb-scrape.json]
 *
 * Upserts by slug; sets source=facebook and facebook_post_id when present.
 * Mirrors remote photos (fbcdn) into the vehicle-photos Supabase bucket.
 * Does NOT create or call /api/admin/sync-fb.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { parseFacebookVehicles } from "../src/lib/import-fb";
import { mirrorVehicleImageFields } from "../src/lib/vehicle-photo-upload";

async function main() {
  const inputPath = resolve(
    process.cwd(),
    process.argv[2] || "scripts/fb-scrape.json"
  );
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(inputPath, "utf8"));
  } catch (e) {
    console.error(`Cannot read JSON at ${inputPath}:`, e);
    process.exit(1);
  }

  const posts = Array.isArray(raw)
    ? raw
    : ((raw as { posts?: unknown[] }).posts ?? []);
  const parsed = parseFacebookVehicles(raw);

  console.log(`Input posts: ${posts.length}`);
  console.log(`Parsed vehicles: ${parsed.length}`);
  console.log(
    `Ignored (too short / unparseable): ${Math.max(0, posts.length - parsed.length)}`
  );

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let upserted = 0;
  let mirrored = 0;
  const errors: string[] = [];

  for (const row of parsed) {
    const gallery = Array.isArray(row.gallery)
      ? (row.gallery as { src: string; alt: string }[])
      : null;

    const photos = await mirrorVehicleImageFields(
      supabase,
      row.slug,
      row.image ?? "",
      gallery
    );
    if (photos.image && photos.image !== row.image) mirrored += 1;

    const payload = {
      ...row,
      image: photos.image || row.image,
      gallery: photos.gallery,
      source: "facebook" as const,
    };
    const { error } = await supabase
      .from("vehicles")
      .upsert(payload, { onConflict: "slug" });
    if (error) {
      errors.push(`${row.slug}: ${error.message}`);
      console.error("FAIL", row.slug, error.message);
    } else {
      upserted += 1;
      const hosted = photos.image?.includes("vehicle-photos") ? "hosted✓" : "cdn?";
      console.log(
        "OK",
        row.slug,
        row.facebook_post_id ? `(fb:${row.facebook_post_id})` : "",
        `${row.price}€`,
        photos.image ? "img✓" : "img✗",
        hosted
      );
    }
  }

  console.log(`\nUpserted ${upserted}/${parsed.length}`);
  console.log(`Photos mirrored to Supabase: ${mirrored}`);
  if (errors.length) {
    console.error("Errors:", errors.join("\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
