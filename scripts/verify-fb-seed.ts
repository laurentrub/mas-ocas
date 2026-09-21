import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("url", !!url, "key", !!key);
  const sb = createClient(url!, key!, { auth: { persistSession: false } });
  const any = await sb.from("vehicles").select("slug,source,price,facebook_post_id").limit(2000);
  console.log("err", any.error?.message || null);
  console.log("rows", any.data?.length || 0);
  const freq: Record<string, number> = {};
  for (const r of any.data || []) {
    const s = String(r.source ?? "null");
    freq[s] = (freq[s] || 0) + 1;
  }
  console.log("sources", JSON.stringify(freq));
  const fb = (any.data || []).filter((r) => r.source === "facebook");
  console.log("facebook", fb.length);
  console.log("price0", fb.filter((r) => !r.price).length);
  console.log("samples", fb.slice(0, 5).map((r) => `${r.slug}|${r.price}`).join("; "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
