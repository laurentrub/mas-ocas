/**
 * Create the first super_admin user.
 * Usage:
 *   BOOTSTRAP_EMAIL=you@example.com BOOTSTRAP_PASSWORD='...' \
 *   npx tsx --env-file=.env.local scripts/bootstrap-admin.ts
 */
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const email =
    process.env.BOOTSTRAP_EMAIL ||
    process.env.SUPER_ADMIN_EMAIL ||
    "thierry@mas-ocas-auto.com";
  const password = process.env.BOOTSTRAP_PASSWORD;

  if (!url || !key) {
    console.error("Missing Supabase URL or service role key");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("Set BOOTSTRAP_PASSWORD (min 8 chars)");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existing } = await supabase.auth.admin.listUsers({
    perPage: 200,
  });
  const found = existing?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );

  let userId = found?.id;
  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      console.error(error?.message ?? "createUser failed");
      process.exit(1);
    }
    userId = data.user.id;
    console.log("Created user", email);
  } else {
    console.log("User already exists", email);
    await supabase.auth.admin.updateUserById(userId, { password });
  }

  await supabase.from("user_roles").delete().eq("user_id", userId);
  const { error: roleError } = await supabase.from("user_roles").insert({
    user_id: userId,
    role: "super_admin",
  });
  if (roleError) {
    console.error(roleError.message);
    process.exit(1);
  }

  console.log("super_admin role assigned to", email);
  console.log("Set SUPER_ADMIN_EMAIL=" + email + " in .env.local");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
