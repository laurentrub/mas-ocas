import Link from "next/link";
import {
  deleteVehicleAction,
  saveVehicleAction,
} from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PREPARATION_FIELD_LABELS,
  formatEquipmentCategories,
  formatGalleryUrls,
} from "@/lib/admin-vehicle-fields";
import type { VehicleRow } from "@/lib/supabase/database.types";
import type {
  EquipmentCategory,
  VehicleImportOrigin,
  VehiclePreparation,
} from "@/lib/vehicles";
import { getSessionStaff } from "@/lib/auth/session";

const fuels = ["Essence", "Diesel", "Hybride", "Électrique"] as const;
const transmissions = ["Manuelle", "Automatique"] as const;
const statuses = [
  "Disponible",
  "Réservé",
  "Livraison sous 48h",
  "Vendu",
] as const;

function asGallery(
  value: VehicleRow["gallery"]
): { src: string; alt: string }[] | null {
  if (!Array.isArray(value)) return null;
  return value as { src: string; alt: string }[];
}

function asCategories(
  value: VehicleRow["equipment_categories"]
): EquipmentCategory[] | null {
  if (!Array.isArray(value)) return null;
  return value as EquipmentCategory[];
}

function asPrep(value: VehicleRow["preparation"]): VehiclePreparation | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as VehiclePreparation;
}

function asImport(
  value: VehicleRow["import_origin"]
): VehicleImportOrigin | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as VehicleImportOrigin;
}

export async function VehicleForm({
  vehicle,
}: {
  vehicle?: VehicleRow | null;
}) {
  const session = await getSessionStaff();
  const canDelete = session?.access.canDeleteVehicles;
  const prep = asPrep(vehicle?.preparation ?? null);
  const importOrigin = asImport(vehicle?.import_origin ?? null);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <form action={saveVehicleAction} className="space-y-8">
        {vehicle?.id ? (
          <input type="hidden" name="id" value={vehicle.id} />
        ) : null}

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-navy">
            Identification
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Marque"
              name="brand"
              defaultValue={vehicle?.brand}
              required
            />
            <Field
              label="Modèle"
              name="model"
              defaultValue={vehicle?.model}
              required
            />
            <Field
              label="Slug"
              name="slug"
              defaultValue={vehicle?.slug}
              placeholder="auto si vide"
            />
            <Field
              label="Année"
              name="year"
              type="number"
              defaultValue={vehicle?.year ?? new Date().getFullYear()}
              required
            />
            <Field
              label="Prix (€)"
              name="price"
              type="number"
              defaultValue={vehicle?.price ?? 0}
              required
            />
            <Field
              label="Kilométrage"
              name="mileage"
              type="number"
              defaultValue={vehicle?.mileage ?? 0}
              required
            />
            <div className="space-y-2">
              <Label htmlFor="fuel">Carburant</Label>
              <select
                id="fuel"
                name="fuel"
                defaultValue={vehicle?.fuel ?? "Essence"}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              >
                {fuels.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Boîte</Label>
              <select
                id="transmission"
                name="transmission"
                defaultValue={vehicle?.transmission ?? "Manuelle"}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              >
                {transmissions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Puissance" name="power" defaultValue={vehicle?.power} />
            <Field label="Couleur" name="color" defaultValue={vehicle?.color} />
            <Field
              label="Portes"
              name="doors"
              type="number"
              defaultValue={vehicle?.doors ?? 5}
            />
            <Field
              label="Places"
              name="seats"
              type="number"
              defaultValue={vehicle?.seats ?? 5}
            />
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                name="status"
                defaultValue={vehicle?.status ?? "Disponible"}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Garantie"
              name="warranty_note"
              defaultValue={vehicle?.warranty_note ?? ""}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-navy">Textes</h2>
          <Field
            label="Accroche"
            name="highlight"
            defaultValue={vehicle?.highlight}
          />
          <div className="space-y-2">
            <Label htmlFor="description">Description courte</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={vehicle?.description ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editorial">Texte éditorial</Label>
            <Textarea
              id="editorial"
              name="editorial"
              rows={5}
              defaultValue={vehicle?.editorial ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Équipements simples (un par ligne)</Label>
            <Textarea
              id="features"
              name="features"
              rows={3}
              defaultValue={(vehicle?.features ?? []).join("\n")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipment_categories">
              Équipements par catégorie
            </Label>
            <Textarea
              id="equipment_categories"
              name="equipment_categories"
              rows={4}
              placeholder={"Sécurité: ABS, ESP\nConfort: Clim auto, GPS"}
              defaultValue={formatEquipmentCategories(
                asCategories(vehicle?.equipment_categories ?? null)
              )}
            />
            <p className="text-xs text-[#5a6b80]">
              Une catégorie par ligne : Nom: item1, item2
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-navy">Photos</h2>
          <Field
            label="URL image principale"
            name="image"
            defaultValue={vehicle?.image}
          />
          <Field
            label="Alt image"
            name="image_alt"
            defaultValue={vehicle?.image_alt}
          />
          <div className="space-y-2">
            <Label htmlFor="gallery">Galerie (URLs, une par ligne)</Label>
            <Textarea
              id="gallery"
              name="gallery"
              rows={4}
              placeholder="https://…"
              defaultValue={formatGalleryUrls(
                asGallery(vehicle?.gallery ?? null)
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-navy">
            Préparation
          </h2>
          <ul className="space-y-2">
            {PREPARATION_FIELD_LABELS.map(({ key, label }) => (
              <li key={key} className="flex items-center gap-2">
                <input
                  id={`prep_${key}`}
                  name={`prep_${key}`}
                  type="checkbox"
                  defaultChecked={prep?.[key] === true}
                  className="size-4 rounded border-[#d0d9e6]"
                />
                <Label htmlFor={`prep_${key}`} className="font-normal">
                  {label}
                </Label>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-navy">
            Origine import
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Pays"
              name="import_country"
              defaultValue={importOrigin?.country ?? ""}
              placeholder="Belgique, Allemagne…"
            />
            <Field
              label="Note"
              name="import_note"
              defaultValue={importOrigin?.note ?? ""}
            />
          </div>
        </section>

        <input type="hidden" name="source" value={vehicle?.source ?? "manual"} />
        <input
          type="hidden"
          name="facebook_post_id"
          value={vehicle?.facebook_post_id ?? ""}
        />

        <div className="flex flex-wrap gap-3">
          <Button type="submit">{vehicle ? "Enregistrer" : "Créer"}</Button>
          <Link
            href="/admin/stock"
            className="inline-flex h-8 items-center rounded-lg border border-[#d0d9e6] px-3 text-sm font-medium"
          >
            Annuler
          </Link>
        </div>
      </form>

      {vehicle && canDelete ? (
        <form
          action={deleteVehicleAction}
          className="border-t border-[#d0d9e6] pt-6"
        >
          <input type="hidden" name="id" value={vehicle.id} />
          <Button type="submit" variant="destructive">
            Supprimer le véhicule
          </Button>
        </form>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
    </div>
  );
}
