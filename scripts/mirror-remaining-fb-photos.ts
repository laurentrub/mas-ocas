/**
 * Mirror photos for vehicles still on expired fbcdn URLs.
 * Usage: npx tsx --env-file=.env.local scripts/mirror-remaining-fb-photos.ts
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { mirrorVehicleImageFields } from "../src/lib/vehicle-photo-upload";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const scrape = JSON.parse(
    readFileSync("scripts/fb-scrape.json", "utf8")
  ) as { id: string; images?: string[]; text?: string }[];

  const { data: rows } = await sb
    .from("vehicles")
    .select("id, slug, brand, model, image, image_alt, facebook_post_id")
    .eq("source", "facebook")
    .ilike("image", "%fbcdn%");

  console.log("Remaining fbcdn:", rows?.length ?? 0);

  for (const row of rows ?? []) {
    const post = scrape.find((p) => p.id === row.facebook_post_id);
    const images = post?.images?.filter(Boolean) ?? [];
    if (!images.length) {
      console.log("SKIP no scrape images", row.slug, row.facebook_post_id);
      continue;
    }
    const gallery = images.slice(1).map((src, i) => ({
      src,
      alt: `${row.brand} ${row.model} — photo ${i + 2}`,
    }));
    const photos = await mirrorVehicleImageFields(
      sb,
      row.slug,
      images[0]!,
      gallery
    );
    const { error } = await sb
      .from("vehicles")
      .update({
        image: photos.image,
        gallery: photos.gallery,
        image_alt: row.image_alt || `${row.brand} ${row.model}`,
      })
      .eq("id", row.id);
    console.log(
      error ? `FAIL ${row.slug} ${error.message}` : `OK ${row.slug}`,
      photos.image.includes("vehicle-photos") ? "hosted✓" : "cdn?"
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
