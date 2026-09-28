import { NextResponse } from "next/server";
import { getSessionStaff } from "@/lib/auth/session";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseFacebookVehicles } from "@/lib/import-fb";
import { mirrorVehicleImageFields } from "@/lib/vehicle-photo-upload";

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
  const storage = createServiceRoleClient();
  let upserted = 0;
  let mirrored = 0;

  for (const row of parsed) {
    const gallery = Array.isArray(row.gallery)
      ? (row.gallery as { src: string; alt: string }[])
      : null;

    const photos = await mirrorVehicleImageFields(
      storage,
      row.slug,
      row.image ?? "",
      gallery
    );
    if (photos.image && photos.image !== row.image) mirrored += 1;

    const { error } = await supabase.from("vehicles").upsert(
      {
        ...row,
        image: photos.image || row.image,
        gallery: photos.gallery,
        created_by: session.user.id,
        source: "facebook",
      },
      { onConflict: "slug" }
    );
    if (!error) upserted += 1;
  }

  return NextResponse.json({
    upserted,
    total: parsed.length,
    mirrored,
  });
}
