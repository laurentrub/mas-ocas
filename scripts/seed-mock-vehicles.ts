/**
 * Seed mock vehicles into Supabase.
 * Usage: npx tsx --env-file=.env.local scripts/seed-mock-vehicles.ts
 */
import { createClient } from "@supabase/supabase-js";
import { vehicles } from "../src/lib/vehicles";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.error("Missing Supabase URL or service role key");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let n = 0;
  for (const v of vehicles) {
    const row = {
      slug: v.slug,
      brand: v.brand,
      model: v.model,
      year: v.year,
      price: v.price,
      mileage: v.mileage,
      fuel: v.fuel,
      transmission: v.transmission,
      power: v.power,
      color: v.color,
      doors: v.doors,
      seats: v.seats,
      status: v.status,
      highlight: v.highlight,
      description: v.description,
      editorial: v.editorial ?? null,
      features: v.features ?? [],
      equipment_categories: v.equipmentCategories ?? null,
      preparation: v.preparation ?? null,
      import_origin: v.importOrigin ?? null,
      warranty_note: v.warrantyNote ?? null,
      image: v.image,
      image_alt: v.imageAlt,
      gallery: v.gallery ?? null,
      source: "seed",
    };
    const { error } = await supabase
      .from("vehicles")
      .upsert(row, { onConflict: "slug" });
    if (error) console.error(v.slug, error.message);
    else {
      n += 1;
      console.log("OK", v.slug);
    }
  }
  console.log(`Seeded ${n}/${vehicles.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
