import type {
  EquipmentCategory,
  Vehicle,
  VehicleImportOrigin,
  VehiclePreparation,
} from "@/lib/vehicles";
import type { VehicleRow } from "@/lib/supabase/database.types";
import { vehicles as mockVehicles } from "@/lib/vehicles";
import { isSupabaseConfigured } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

function asCategories(value: unknown): EquipmentCategory[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as EquipmentCategory[];
}

function asGallery(
  value: unknown
): { src: string; alt: string }[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as { src: string; alt: string }[];
}

export function rowToVehicle(row: VehicleRow): Vehicle {
  return {
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    price: Number(row.price),
    mileage: row.mileage,
    fuel: row.fuel,
    transmission: row.transmission,
    power: row.power,
    color: row.color,
    doors: row.doors,
    seats: row.seats,
    status: row.status === "Vendu" ? "Réservé" : row.status,
    highlight: row.highlight,
    description: row.description,
    editorial: row.editorial ?? undefined,
    features: row.features ?? [],
    equipmentCategories: asCategories(row.equipment_categories),
    preparation: (row.preparation as VehiclePreparation | null) ?? undefined,
    importOrigin: (row.import_origin as VehicleImportOrigin | null) ?? undefined,
    warrantyNote: row.warranty_note ?? undefined,
    image: row.image,
    imageAlt: row.image_alt,
    gallery: asGallery(row.gallery),
  };
}

export function vehicleToRow(
  vehicle: Vehicle,
  extras?: { facebook_post_id?: string; source?: string }
): Omit<
  VehicleRow,
  "id" | "created_at" | "updated_at" | "created_by"
> {
  return {
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    power: vehicle.power,
    color: vehicle.color,
    doors: vehicle.doors,
    seats: vehicle.seats,
    status: vehicle.status,
    highlight: vehicle.highlight,
    description: vehicle.description,
    editorial: vehicle.editorial ?? null,
    features: vehicle.features,
    equipment_categories: vehicle.equipmentCategories ?? null,
    preparation: vehicle.preparation ?? null,
    import_origin: vehicle.importOrigin ?? null,
    warranty_note: vehicle.warrantyNote ?? null,
    image: vehicle.image,
    image_alt: vehicle.imageAlt,
    gallery: vehicle.gallery ?? null,
    facebook_post_id: extras?.facebook_post_id ?? null,
    source: extras?.source ?? "manual",
  };
}

export async function listVehiclesFromDb(opts?: {
  includeSold?: boolean;
}): Promise<{ vehicles: Vehicle[]; fromDb: boolean }> {
  if (!isSupabaseConfigured()) {
    return { vehicles: mockVehicles, fromDb: false };
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!opts?.includeSold) {
      query = query.neq("status", "Vendu");
    }

    const { data, error } = await query;
    if (error || !data?.length) {
      return { vehicles: mockVehicles, fromDb: false };
    }
    return {
      vehicles: data.map(rowToVehicle),
      fromDb: true,
    };
  } catch {
    return { vehicles: mockVehicles, fromDb: false };
  }
}

export async function getVehicleBySlugFromDb(
  slug: string
): Promise<{ vehicle: Vehicle | undefined; fromDb: boolean; id?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      vehicle: mockVehicles.find((v) => v.slug === slug),
      fromDb: false,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return {
        vehicle: mockVehicles.find((v) => v.slug === slug),
        fromDb: false,
      };
    }
    return { vehicle: rowToVehicle(data), fromDb: true, id: data.id };
  } catch {
    return {
      vehicle: mockVehicles.find((v) => v.slug === slug),
      fromDb: false,
    };
  }
}

export function filterVehicleList(
  list: Vehicle[],
  params: { q?: string; budget?: string; km?: string }
) {
  const q = params.q?.trim().toLowerCase();
  const budget = params.budget ? Number(params.budget) : undefined;
  const km = params.km ? Number(params.km) : undefined;

  return list.filter((v) => {
    if (q) {
      const hay = `${v.brand} ${v.model} ${v.highlight} ${v.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (budget && !Number.isNaN(budget) && v.price > budget) return false;
    if (km && !Number.isNaN(km) && v.mileage > km) return false;
    return true;
  });
}
