/**
 * One-shot: strip BMS/Facebook footer chrome from existing facebook vehicles.
 * Usage: npx tsx --env-file=.env.local scripts/clean-fb-descriptions.ts
 */
import { createClient } from "@supabase/supabase-js";
import { cleanFacebookPostText } from "../src/lib/import-fb";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("vehicles")
    .select("id,slug,description,editorial,highlight")
    .eq("source", "facebook");

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const row of data || []) {
    const editorialSrc = String(row.editorial || row.description || "");
    const cleaned = cleanFacebookPostText(editorialSrc);
    const nextDescription = cleaned.slice(0, 500);
    const nextHighlight = cleanFacebookPostText(
      String(row.highlight || "")
    ).split("\n")[0]?.slice(0, 120) || row.highlight;

    if (
      cleaned === editorialSrc.trim() &&
      nextDescription === row.description &&
      nextHighlight === row.highlight
    ) {
      skipped += 1;
      continue;
    }

    const { error: upErr } = await supabase
      .from("vehicles")
      .update({
        editorial: cleaned,
        description: nextDescription,
        highlight: nextHighlight,
      })
      .eq("id", row.id);

    if (upErr) {
      console.error("FAIL", row.slug, upErr.message);
      process.exit(1);
    }

    updated += 1;
    console.log("OK", row.slug, `${editorialSrc.length}→${cleaned.length}`);
  }

  console.log(`\nUpdated ${updated}, unchanged ${skipped}, total ${data?.length ?? 0}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
