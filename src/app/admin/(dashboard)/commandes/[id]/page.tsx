import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePurchaseOrderAction } from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/vehicles";
import { company } from "@/lib/company";

type Props = { params: Promise<{ id: string }> };

export default async function CommandeDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: order }, { data: vehicles }, { data: ribs }] =
    await Promise.all([
      supabase
        .from("purchase_orders")
        .select(
          "*, clients(*), bank_accounts(*), vehicles(slug, brand, model, year)"
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("vehicles")
        .select("id, brand, model, year, price, status")
        .order("brand"),
      supabase
        .from("bank_accounts")
        .select("id, label, iban, is_default, is_active")
        .eq("is_active", true)
        .order("is_default", { ascending: false }),
    ]);

  if (!order) notFound();

  const client = Array.isArray(order.clients) ? order.clients[0] : order.clients;
  const bank = Array.isArray(order.bank_accounts)
    ? order.bank_accounts[0]
    : order.bank_accounts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange">
            {order.status}
          </p>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            {order.numero}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/commandes/${order.id}/print`}
            target="_blank"
            className="inline-flex h-8 items-center rounded-lg bg-orange px-3 text-sm font-medium text-white"
          >
            Imprimer / PDF
          </Link>
          <Link
            href="/admin/commandes"
            className="inline-flex h-8 items-center rounded-lg border border-[#d0d9e6] px-3 text-sm font-medium"
          >
            Retour
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="border border-[#d0d9e6] bg-white p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
            Vendeur
          </h2>
          <p className="mt-2 font-semibold">{company.brand}</p>
          <p className="text-sm text-[#5a6b80]">{company.legalName}</p>
          <p className="text-sm text-[#5a6b80]">{company.address.full}</p>
        </section>
        <section className="border border-[#d0d9e6] bg-white p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
            Acheteur
          </h2>
          {client ? (
            <>
              <p className="mt-2 font-semibold">
                {client.prenom} {client.nom}
              </p>
              <p className="text-sm text-[#5a6b80]">{client.email}</p>
              <p className="text-sm text-[#5a6b80]">{client.telephone}</p>
              <p className="text-sm text-[#5a6b80]">
                {[client.adresse, client.code_postal, client.ville]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {client.id ? (
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="mt-2 inline-block text-sm font-semibold text-orange hover:underline"
                >
                  Fiche client
                </Link>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-[#5a6b80]">—</p>
          )}
        </section>
      </div>

      <section className="border border-[#d0d9e6] bg-white p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
          Résumé
        </h2>
        <p className="mt-2 font-semibold">{order.vehicle_label}</p>
        <p className="mt-2 text-2xl font-extrabold text-navy">
          {formatPrice(Number(order.amount))}
        </p>
        <p className="text-sm text-[#5a6b80]">
          Acompte {formatPrice(Number(order.deposit))} · Solde{" "}
          {formatPrice(Number(order.balance))}
        </p>
        {bank ? (
          <p className="mt-2 text-sm text-[#5a6b80]">
            RIB : {bank.label} — {bank.iban}
          </p>
        ) : null}
      </section>

      <form
        action={updatePurchaseOrderAction}
        className="space-y-4 border border-[#d0d9e6] bg-white p-5"
      >
        <h2 className="font-display text-lg font-bold text-navy">
          Modifier le bon de commande
        </h2>
        <input type="hidden" name="id" value={order.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vehicle_id">Véhicule</Label>
            <select
              id="vehicle_id"
              name="vehicle_id"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              defaultValue={order.vehicle_id ?? ""}
            >
              <option value="">— Choisir —</option>
              {(vehicles ?? []).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) —{" "}
                  {Number(v.price).toLocaleString("fr-FR")} €
                  {v.status === "Vendu" ? " [vendu]" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vehicle_label">Libellé véhicule</Label>
            <Input
              id="vehicle_label"
              name="vehicle_label"
              defaultValue={order.vehicle_label ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant TTC (€)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              required
              defaultValue={Number(order.amount)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deposit">Acompte (€)</Label>
            <Input
              id="deposit"
              name="deposit"
              type="number"
              step="0.01"
              defaultValue={Number(order.deposit)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="installment_count">Paiement</Label>
            <select
              id="installment_count"
              name="installment_count"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              defaultValue={String(order.installment_count ?? 1)}
            >
              <option value="1">Comptant (1 virement)</option>
              <option value="2">En 2 fois</option>
              <option value="3">En 3 fois</option>
              <option value="4">En 4 fois</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_account_id">RIB</Label>
            <select
              id="bank_account_id"
              name="bank_account_id"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              defaultValue={order.bank_account_id ?? ""}
            >
              <option value="">—</option>
              {(ribs ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} — {r.iban}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery_date">Date de livraison prévue</Label>
            <Input
              id="delivery_date"
              name="delivery_date"
              type="date"
              defaultValue={order.delivery_date ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="delivery_place">Lieu de livraison / remise</Label>
            <Input
              id="delivery_place"
              name="delivery_place"
              defaultValue={order.delivery_place ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={order.notes ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              name="status"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              defaultValue={order.status}
            >
              <option value="brouillon">Brouillon</option>
              <option value="envoye">Envoyé</option>
              <option value="paye">Payé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
        </div>

        <Button type="submit">Enregistrer les modifications</Button>
      </form>
    </div>
  );
}
