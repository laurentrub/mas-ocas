import { createClient } from "@/lib/supabase/server";
import { deriveAccess, type StaffAccess } from "@/lib/auth/roles";
import type { AppRole } from "@/lib/supabase/database.types";
import type { User } from "@supabase/supabase-js";

export type SessionStaff = {
  user: User;
  access: StaffAccess;
};

export async function getSessionStaff(): Promise<SessionStaff | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  const roles = (roleRows ?? []).map((r) => r.role as AppRole);
  const access = deriveAccess(roles, user.email);
  if (!access.isStaff) return null;

  return { user, access };
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
