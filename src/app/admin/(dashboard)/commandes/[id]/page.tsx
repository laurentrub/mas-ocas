import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePurchaseOrderStatusAction } from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/vehicles";
import { company } from "@/lib/company";

type Props = { params: Promise<{ id: string }> };

export default async function CommandeDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("purchase_orders")
    .select(
      "*, clients(*), bank_accounts(*), vehicles(slug, brand, model, year)"
    )
    .eq("id", id)
    .maybeSingle();

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
            </>
          ) : (
            <p className="mt-2 text-sm text-[#5a6b80]">—</p>
          )}
        </section>
      </div>

      <section className="border border-[#d0d9e6] bg-white p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
          Véhicule & montant
        </h2>
        <p className="mt-2 font-semibold">{order.vehicle_label}</p>
        <p className="mt-2 text-2xl font-extrabold text-navy">
          {formatPrice(Number(order.amount))}
        </p>
        <p className="text-sm text-[#5a6b80]">
          Acompte {formatPrice(Number(order.deposit))} · Solde{" "}
          {formatPrice(Number(order.balance))}
        </p>
        <p className="mt-2 text-sm">Mode de paiement : virement bancaire</p>
      </section>

      {bank ? (
        <section className="border border-orange/30 bg-orange/5 p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-orange">
            Coordonnées de virement
          </h2>
          <p className="mt-2 font-semibold">{bank.label}</p>
          <p className="text-sm">{bank.account_holder}</p>
          <p className="mt-1 font-mono text-sm">{bank.iban}</p>
          {bank.bic ? (
            <p className="font-mono text-xs">BIC {bank.bic}</p>
          ) : null}
          {bank.instructions ? (
            <p className="mt-2 text-sm text-[#5a6b80]">{bank.instructions}</p>
          ) : null}
        </section>
      ) : null}

      <form
        action={updatePurchaseOrderStatusAction}
        className="flex flex-wrap items-center gap-2"
      >
        <input type="hidden" name="id" value={order.id} />
        <select
          name="status"
          defaultValue={order.status}
          className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
        >
          <option value="brouillon">Brouillon</option>
          <option value="envoye">Envoyé</option>
          <option value="paye">Payé</option>
          <option value="annule">Annulé</option>
        </select>
        <Button type="submit" size="sm" variant="outline">
          Mettre à jour le statut
        </Button>
      </form>
    </div>
  );
}
