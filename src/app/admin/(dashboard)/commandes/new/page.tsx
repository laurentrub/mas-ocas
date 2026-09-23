import { createPurchaseOrderAction } from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import type { LeadDetails } from "@/lib/demandes";

type Props = {
  searchParams: Promise<{ lead?: string }>;
};

export default async function NewCommandePage({ searchParams }: Props) {
  const { lead: leadId } = await searchParams;
  const supabase = await createClient();
  const [{ data: vehicles }, { data: ribs }, leadRes] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, brand, model, year, price, status, slug")
      .neq("status", "Vendu")
      .order("brand"),
    supabase
      .from("bank_accounts")
      .select("id, label, iban, is_default")
      .eq("is_active", true)
      .order("is_default", { ascending: false }),
    leadId
      ? supabase.from("leads").select("*").eq("id", leadId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const lead = leadRes.data;
  const details = (lead?.details ?? null) as LeadDetails | null;
  const defaultRib = ribs?.find((r) => r.is_default)?.id ?? ribs?.[0]?.id ?? "";

  const nameParts = (lead?.name ?? "").trim().split(/\s+/);
  const prenomDefault = nameParts.length > 1 ? nameParts[0] : "";
  const nomDefault =
    nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0] ?? "";

  const matchedVehicle = lead?.vehicle_slug
    ? vehicles?.find((v) => v.slug === lead.vehicle_slug)
    : lead?.vehicle_id
      ? vehicles?.find((v) => v.id === lead.vehicle_id)
      : undefined;

  const amountDefault =
    details?.kind === "financement"
      ? details.vehicle_price
      : matchedVehicle
        ? Number(matchedVehicle.price)
        : 0;

  const installmentDefault =
    details?.kind === "financement"
      ? details.installments && [2, 3, 4].includes(details.installments)
        ? details.installments
        : 1
      : 1;

  const deliveryDefault =
    details?.kind === "livraison"
      ? `${details.address}, ${details.postal_code} ${details.city}`
      : "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-navy">
        Nouveau bon de commande
      </h1>
      {lead ? (
        <p className="rounded-lg bg-orange/10 px-4 py-3 text-sm text-navy">
          Prérempli depuis la demande <strong>{lead.type}</strong> de {lead.name}.
        </p>
      ) : null}

      <form
        action={createPurchaseOrderAction}
        className="space-y-6 border border-[#d0d9e6] bg-white p-5"
      >
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-bold text-navy">
            Client
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" name="prenom" defaultValue={prenomDefault} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" name="nom" required defaultValue={nomDefault} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={lead?.email ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                defaultValue={lead?.phone ?? ""}
              />
            </div>
            {details?.kind === "livraison" ? (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    defaultValue={details.address}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input
                    id="code_postal"
                    name="code_postal"
                    defaultValue={details.postal_code}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input id="ville" name="ville" defaultValue={details.city} />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" name="adresse" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input id="code_postal" name="code_postal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input id="ville" name="ville" />
                </div>
              </>
            )}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-bold text-navy">
            Véhicule & paiement
          </legend>
          <div className="space-y-2">
            <Label htmlFor="vehicle_id">Véhicule</Label>
            <select
              id="vehicle_id"
              name="vehicle_id"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              defaultValue={matchedVehicle?.id ?? ""}
            >
              <option value="">— Choisir —</option>
              {(vehicles ?? []).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) —{" "}
                  {Number(v.price).toLocaleString("fr-FR")} €
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle_label">Libellé véhicule (si hors stock)</Label>
            <Input
              id="vehicle_label"
              name="vehicle_label"
              defaultValue={lead?.interest ?? ""}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant TTC (€)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                defaultValue={amountDefault}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Acompte (€)</Label>
              <Input
                id="deposit"
                name="deposit"
                type="number"
                step="0.01"
                defaultValue={0}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="installment_count">Paiement</Label>
            <select
              id="installment_count"
              name="installment_count"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              defaultValue={String(installmentDefault)}
            >
              <option value="1">Comptant (1 virement)</option>
              <option value="2">En 2 fois</option>
              <option value="3">En 3 fois</option>
              <option value="4">En 4 fois</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_account_id">RIB de virement</Label>
            <select
              id="bank_account_id"
              name="bank_account_id"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              defaultValue={defaultRib}
              required
            >
              {(ribs ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} — {r.iban}
                </option>
              ))}
            </select>
            {!ribs?.length ? (
              <p className="text-sm text-red-600">
                Ajoutez d’abord un RIB dans /admin/rib.
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery_date">Date de livraison prévue</Label>
            <Input
              id="delivery_date"
              name="delivery_date"
              type="date"
              defaultValue={
                details?.kind === "livraison" && details.preferred_date
                  ? details.preferred_date
                  : ""
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery_place">Lieu de livraison / remise</Label>
            <Input
              id="delivery_place"
              name="delivery_place"
              defaultValue={deliveryDefault}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={lead?.message ?? ""}
            />
          </div>
        </fieldset>

        <Button type="submit" disabled={!ribs?.length}>
          Créer le bon de commande
        </Button>
      </form>
    </div>
  );
}
