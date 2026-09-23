import { createServiceRoleClient } from "@/lib/supabase/admin";

export type StaffMember = {
  userId: string;
  email: string;
};

/** Staff list for lead assignment — service role, server-only. */
export async function listStaffMembers(): Promise<StaffMember[]> {
  try {
    const admin = createServiceRoleClient();
    const { data: roles } = await admin
      .from("user_roles")
      .select("user_id, role");
    if (!roles?.length) return [];

    const { data: list } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    const byId = new Map(
      (list?.users ?? []).map((u) => [u.id, u.email ?? ""])
    );

    const seen = new Set<string>();
    const members: StaffMember[] = [];
    for (const row of roles) {
      if (seen.has(row.user_id)) continue;
      seen.add(row.user_id);
      const email = byId.get(row.user_id);
      if (email) members.push({ userId: row.user_id, email });
    }
    return members.sort((a, b) => a.email.localeCompare(b.email));
  } catch {
    return [];
  }
}
