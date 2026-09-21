/**
 * One-shot import of Facebook scrape JSON → Supabase vehicles.
 * Usage: npx tsx --env-file=.env.local scripts/seed-fb-from-scrape.ts [path/to/fb-scrape.json]
 *
 * Upserts by slug; sets source=facebook and facebook_post_id when present.
 * Does NOT create or call /api/admin/sync-fb.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { parseFacebookVehicles } from "../src/lib/import-fb";

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
  const errors: string[] = [];

  for (const row of parsed) {
    const payload = { ...row, source: "facebook" as const };
    const { error } = await supabase
      .from("vehicles")
      .upsert(payload, { onConflict: "slug" });
    if (error) {
      errors.push(`${row.slug}: ${error.message}`);
      console.error("FAIL", row.slug, error.message);
    } else {
      upserted += 1;
      console.log(
        "OK",
        row.slug,
        row.facebook_post_id ? `(fb:${row.facebook_post_id})` : "",
        `${row.price}€`,
        row.image ? "img✓" : "img✗"
      );
    }
  }

  console.log(`\nUpserted ${upserted}/${parsed.length}`);
  if (errors.length) {
    console.error("Errors:", errors.join("\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
