"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { getSessionStaff } from "@/lib/auth/session";
import { buildInstallmentSchedule } from "@/lib/demandes";
import {
  parseEquipmentCategories,
  parseImportOrigin,
  parsePreparationFromForm,
} from "@/lib/admin-vehicle-fields";
import {
  buildGalleryItems,
  formExistingGalleryUrls,
  formFile,
  formFiles,
  uploadVehicleGalleryPhotos,
  uploadVehicleMainPhoto,
} from "@/lib/vehicle-photo-upload";
import type {
  VehicleFuel,
  VehicleStatus,
  VehicleTransmission,
} from "@/lib/supabase/database.types";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function formString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formNumber(formData: FormData, key: string) {
  return Number(formData.get(key) ?? 0);
}

export async function saveVehicleAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session) throw new Error("Non autorisé");

  const id = formString(formData, "id");
  const brand = formString(formData, "brand");
  const model = formString(formData, "model");
  const year = formNumber(formData, "year");
  let slug = formString(formData, "slug");
  if (!slug) slug = slugify(`${brand}-${model}-${year}`);

  const imageAlt =
    formString(formData, "image_alt") || `${brand} ${model}`;
  const equipmentCategories = parseEquipmentCategories(
    formString(formData, "equipment_categories")
  );
  const preparation = parsePreparationFromForm(formData);
  const importOrigin = parseImportOrigin(
    formString(formData, "import_country"),
    formString(formData, "import_note")
  );

  const supabase = await createClient();
  const storage = createServiceRoleClient();

  let image = formString(formData, "image");
  const imageFile = formFile(formData, "image_file");
  if (imageFile) {
    image = await uploadVehicleMainPhoto(storage, imageFile, slug);
  }
  if (!image) {
    throw new Error("Ajoutez une photo principale (fichier ou URL).");
  }

  const keptGallery = formExistingGalleryUrls(formData);
  const galleryFiles = formFiles(formData, "gallery_files");
  const uploadedGallery =
    galleryFiles.length > 0
      ? await uploadVehicleGalleryPhotos(storage, galleryFiles, slug)
      : [];
  const gallery = buildGalleryItems(
    [...keptGallery, ...uploadedGallery],
    imageAlt
  );

  const payload = {
    slug,
    brand,
    model,
    year,
    price: formNumber(formData, "price"),
    mileage: formNumber(formData, "mileage"),
    fuel: formString(formData, "fuel") as VehicleFuel,
    transmission: formString(formData, "transmission") as VehicleTransmission,
    power: formString(formData, "power"),
    color: formString(formData, "color"),
    doors: formNumber(formData, "doors") || 5,
    seats: formNumber(formData, "seats") || 5,
    status: formString(formData, "status") as VehicleStatus,
    highlight: formString(formData, "highlight"),
    description: formString(formData, "description"),
    editorial: formString(formData, "editorial") || null,
    warranty_note: formString(formData, "warranty_note") || null,
    image,
    image_alt: imageAlt,
    features: formString(formData, "features")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    gallery,
    equipment_categories: equipmentCategories,
    preparation,
    import_origin: importOrigin,
    source: formString(formData, "source") || "manual",
    facebook_post_id: formString(formData, "facebook_post_id") || null,
  };

  if (id) {
    const { error } = await supabase
      .from("vehicles")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("vehicles").insert({
      ...payload,
      created_by: session.user.id,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/stock");
  revalidatePath("/stock");
  revalidatePath(`/vehicules/${slug}`);
  redirect("/admin/stock");
}

export async function deleteVehicleAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session?.access.canDeleteVehicles) throw new Error("Non autorisé");

  const id = formString(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/stock");
  revalidatePath("/stock");
  redirect("/admin/stock");
}

export async function updateLeadAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session) throw new Error("Non autorisé");

  const id = formString(formData, "id");
  const status = formString(formData, "status");
  const notes = formString(formData, "notes");
  const assignedRaw = formString(formData, "assigned_to");

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      status: status as "nouveau" | "en_cours" | "traite" | "archive",
      notes: notes || null,
      assigned_to: assignedRaw || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

/** @deprecated use updateLeadAction */
export async function updateLeadStatusAction(formData: FormData) {
  return updateLeadAction(formData);
}

export async function saveBankAccountAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session?.access.canManageRib) throw new Error("Non autorisé");

  const id = formString(formData, "id");
  const isDefault = formData.get("is_default") === "on";
  const payload = {
    label: formString(formData, "label"),
    account_holder: formString(formData, "account_holder"),
    bank_name: formString(formData, "bank_name") || null,
    iban: formString(formData, "iban").replace(/\s+/g, "").toUpperCase(),
    bic: formString(formData, "bic") || null,
    instructions: formString(formData, "instructions") || null,
    is_default: isDefault,
    is_active: formData.get("is_active") !== "off",
  };

  const supabase = await createClient();

  if (isDefault) {
    await supabase
      .from("bank_accounts")
      .update({ is_default: false })
      .eq("is_default", true);
  }

  if (id) {
    const { error } = await supabase
      .from("bank_accounts")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("bank_accounts").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/rib");
  redirect("/admin/rib");
}

export async function deleteBankAccountAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session?.access.canManageRib) throw new Error("Non autorisé");
  const id = formString(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("bank_accounts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/rib");
  redirect("/admin/rib");
}

export async function createPurchaseOrderAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session) throw new Error("Non autorisé");

  const supabase = await createClient();
  const { data: numero, error: numError } = await supabase.rpc(
    "next_purchase_order_numero"
  );
  if (numError || !numero) throw new Error(numError?.message ?? "Numéro KO");

  const clientPayload = {
    nom: formString(formData, "nom"),
    prenom: formString(formData, "prenom"),
    email: formString(formData, "email") || null,
    telephone: formString(formData, "telephone") || null,
    adresse: formString(formData, "adresse") || null,
    code_postal: formString(formData, "code_postal") || null,
    ville: formString(formData, "ville") || null,
  };

  let clientId: string | null = null;
  if (clientPayload.email) {
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .eq("email", clientPayload.email)
      .maybeSingle();
    if (existing) {
      const { error: updErr } = await supabase
        .from("clients")
        .update(clientPayload)
        .eq("id", existing.id);
      if (updErr) throw new Error(updErr.message);
      clientId = existing.id;
    }
  }
  if (!clientId) {
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert(clientPayload)
      .select("id")
      .single();
    if (clientError || !client)
      throw new Error(clientError?.message ?? "Client KO");
    clientId = client.id;
  }

  const vehicleId = formString(formData, "vehicle_id") || null;
  let vehicleLabel = formString(formData, "vehicle_label");
  if (vehicleId && !vehicleLabel) {
    const { data: v } = await supabase
      .from("vehicles")
      .select("brand, model, year")
      .eq("id", vehicleId)
      .maybeSingle();
    if (v) vehicleLabel = `${v.brand} ${v.model} (${v.year})`;
  }

  const { data: order, error } = await supabase
    .from("purchase_orders")
    .insert({
      numero,
      client_id: clientId,
      vehicle_id: vehicleId,
      vehicle_label: vehicleLabel || null,
      amount: formNumber(formData, "amount"),
      deposit: formNumber(formData, "deposit"),
      bank_account_id: formString(formData, "bank_account_id") || null,
      payment_method: "virement",
      status: "brouillon",
      notes: formString(formData, "notes") || null,
      delivery_place: formString(formData, "delivery_place") || null,
      delivery_date: formString(formData, "delivery_date") || null,
      created_by: session.user.id,
      installment_count: (() => {
        const n = formNumber(formData, "installment_count");
        return n === 2 || n === 3 || n === 4 ? n : 1;
      })(),
      installment_schedule: (() => {
        const n = formNumber(formData, "installment_count");
        if (n !== 2 && n !== 3 && n !== 4) return null;
        return buildInstallmentSchedule(formNumber(formData, "amount"), n);
      })(),
    })
    .select("id")
    .single();

  if (error || !order) throw new Error(error?.message ?? "Commande KO");

  revalidatePath("/admin/commandes");
  revalidatePath("/admin/clients");
  redirect(`/admin/commandes/${order.id}`);
}

export async function updatePurchaseOrderAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session) throw new Error("Non autorisé");

  const id = formString(formData, "id");
  const vehicleId = formString(formData, "vehicle_id") || null;
  let vehicleLabel = formString(formData, "vehicle_label");
  const supabase = await createClient();

  if (vehicleId && !vehicleLabel) {
    const { data: v } = await supabase
      .from("vehicles")
      .select("brand, model, year")
      .eq("id", vehicleId)
      .maybeSingle();
    if (v) vehicleLabel = `${v.brand} ${v.model} (${v.year})`;
  }

  const installmentCount = (() => {
    const n = formNumber(formData, "installment_count");
    return n === 2 || n === 3 || n === 4 ? n : 1;
  })();
  const amount = formNumber(formData, "amount");

  const { error } = await supabase
    .from("purchase_orders")
    .update({
      vehicle_id: vehicleId,
      vehicle_label: vehicleLabel || null,
      amount,
      deposit: formNumber(formData, "deposit"),
      bank_account_id: formString(formData, "bank_account_id") || null,
      notes: formString(formData, "notes") || null,
      delivery_place: formString(formData, "delivery_place") || null,
      delivery_date: formString(formData, "delivery_date") || null,
      status: formString(formData, "status") as
        | "brouillon"
        | "envoye"
        | "paye"
        | "annule",
      installment_count: installmentCount,
      installment_schedule:
        installmentCount === 2 ||
        installmentCount === 3 ||
        installmentCount === 4
          ? buildInstallmentSchedule(amount, installmentCount)
          : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/commandes/${id}`);
  revalidatePath("/admin/commandes");
  redirect(`/admin/commandes/${id}`);
}

export async function updatePurchaseOrderStatusAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session) throw new Error("Non autorisé");
  const id = formString(formData, "id");
  const status = formString(formData, "status");
  const supabase = await createClient();
  const { error } = await supabase
    .from("purchase_orders")
    .update({
      status: status as "brouillon" | "envoye" | "paye" | "annule",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/commandes/${id}`);
  revalidatePath("/admin/commandes");
}

export async function updateClientAction(formData: FormData) {
  const session = await getSessionStaff();
  if (!session) throw new Error("Non autorisé");

  const id = formString(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({
      nom: formString(formData, "nom"),
      prenom: formString(formData, "prenom"),
      email: formString(formData, "email") || null,
      telephone: formString(formData, "telephone") || null,
      adresse: formString(formData, "adresse") || null,
      code_postal: formString(formData, "code_postal") || null,
      ville: formString(formData, "ville") || null,
      pays: formString(formData, "pays") || "France",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${id}`);
}
