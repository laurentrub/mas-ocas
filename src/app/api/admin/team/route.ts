import { NextResponse } from "next/server";
import { getSessionStaff } from "@/lib/auth/session";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { AppRole } from "@/lib/supabase/database.types";

async function requireSuperAdmin() {
  const session = await getSessionStaff();
  if (!session?.access.canManageTeam) return null;
  return session;
}

export async function GET() {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const admin = createServiceRoleClient();
  const { data: list, error } = await admin.auth.admin.listUsers({
    perPage: 200,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: roles } = await admin.from("user_roles").select("user_id, role");
  const byUser = new Map<string, AppRole[]>();
  for (const r of roles ?? []) {
    const arr = byUser.get(r.user_id) ?? [];
    arr.push(r.role);
    byUser.set(r.user_id, arr);
  }

  const members = (list.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? null,
    created_at: u.created_at,
    roles: byUser.get(u.id) ?? [],
  }));

  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    role?: AppRole;
  };

  if (!body.email || !body.password || !body.role) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const admin = createServiceRoleClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: body.email.trim(),
    password: body.password,
    email_confirm: true,
  });
  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Création impossible" },
      { status: 400 }
    );
  }

  const { error: roleError } = await admin.from("user_roles").insert({
    user_id: data.user.id,
    role: body.role,
  });
  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.user.id });
}

export async function PATCH(request: Request) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = (await request.json()) as {
    userId?: string;
    role?: AppRole;
  };
  if (!body.userId || !body.role) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const admin = createServiceRoleClient();
  await admin.from("user_roles").delete().eq("user_id", body.userId);
  const { error } = await admin.from("user_roles").insert({
    user_id: body.userId,
    role: body.role,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
