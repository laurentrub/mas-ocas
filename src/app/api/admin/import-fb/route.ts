import { NextResponse } from "next/server";
import { getSessionStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseFacebookVehicles } from "@/lib/import-fb";

export async function POST(request: Request) {
  const session = await getSessionStaff();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = parseFacebookVehicles(body);
  if (!parsed.length) {
    return NextResponse.json(
      { error: "Aucun véhicule reconnu dans le fichier" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  let upserted = 0;

  for (const row of parsed) {
    const { error } = await supabase.from("vehicles").upsert(
      {
        ...row,
        created_by: session.user.id,
        source: "facebook",
      },
      { onConflict: "slug" }
    );
    if (!error) upserted += 1;
  }

  return NextResponse.json({ upserted, total: parsed.length });
}
