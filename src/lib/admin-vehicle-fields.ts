import type {
  EquipmentCategory,
  VehicleImportOrigin,
  VehiclePreparation,
} from "@/lib/vehicles";

const PREP_KEYS = [
  "inspected",
  "ctUpToDate",
  "maintenanceUpToDate",
  "preparedForDelivery",
  "documentsReady",
] as const satisfies readonly (keyof VehiclePreparation)[];

/** One URL per line → gallery items. */
export function parseGalleryUrls(
  text: string,
  altFallback: string
): { src: string; alt: string }[] | null {
  const urls = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!urls.length) return null;
  return urls.map((src, i) => ({
    src,
    alt: i === 0 ? altFallback : `${altFallback} — photo ${i + 1}`,
  }));
}

/**
 * One category per line: `Sécurité: ABS, ESP`
 * Lines without `:` become a single “Équipements” category item list.
 */
export function parseEquipmentCategories(
  text: string
): EquipmentCategory[] | null {
  const lines = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!lines.length) return null;

  const categories: EquipmentCategory[] = [];
  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon === -1) {
      const items = line
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length) {
        categories.push({ name: "Équipements", items });
      }
      continue;
    }
    const name = line.slice(0, colon).trim();
    const items = line
      .slice(colon + 1)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (name && items.length) {
      categories.push({ name, items });
    }
  }
  return categories.length ? categories : null;
}

export function formatEquipmentCategories(
  categories: EquipmentCategory[] | null | undefined
): string {
  if (!categories?.length) return "";
  return categories
    .map((c) => `${c.name}: ${c.items.join(", ")}`)
    .join("\n");
}

export function formatGalleryUrls(
  gallery: { src: string; alt: string }[] | null | undefined
): string {
  if (!gallery?.length) return "";
  return gallery.map((g) => g.src).join("\n");
}

export function parsePreparationFromForm(
  formData: FormData
): VehiclePreparation | null {
  const prep: VehiclePreparation = {};
  let any = false;
  for (const key of PREP_KEYS) {
    if (formData.get(`prep_${key}`) === "on") {
      prep[key] = true;
      any = true;
    }
  }
  return any ? prep : null;
}

export function parseImportOrigin(
  country: string,
  note: string
): VehicleImportOrigin | null {
  const c = country.trim();
  if (!c) return null;
  const n = note.trim();
  return n ? { country: c, note: n } : { country: c };
}

export const PREPARATION_FIELD_LABELS: {
  key: keyof VehiclePreparation;
  label: string;
}[] = [
  { key: "inspected", label: "Inspection réalisée avant mise en vente" },
  { key: "ctUpToDate", label: "Contrôle technique à jour" },
  { key: "maintenanceUpToDate", label: "Entretien à jour" },
  { key: "preparedForDelivery", label: "Préparé pour la livraison" },
  { key: "documentsReady", label: "Documents de vente prêts" },
];
