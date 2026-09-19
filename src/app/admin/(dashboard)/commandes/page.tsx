import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/vehicles";

export default async function AdminCommandesPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("purchase_orders")
    .select("id, numero, vehicle_label, amount, status, created_at, clients(nom, prenom)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            Bons de commande
          </h1>
          <p className="mt-2 text-[#5a6b80]">Paiement par virement bancaire.</p>
        </div>
        <Link
          href="/admin/commandes/new"
          className="inline-flex h-8 items-center rounded-lg bg-orange px-3 text-sm font-medium text-white"
        >
          Nouveau BDC
        </Link>
      </div>

      <div className="overflow-x-auto border border-[#d0d9e6] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#d0d9e6] bg-mist text-xs uppercase tracking-wide text-[#5a6b80]">
            <tr>
              <th className="px-4 py-3 font-semibold">N°</th>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Véhicule</th>
              <th className="px-4 py-3 font-semibold">Montant</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => {
              const client = Array.isArray(o.clients) ? o.clients[0] : o.clients;
              return (
                <tr key={o.id} className="border-b border-[#eef2f7]">
                  <td className="px-4 py-3 font-mono text-xs">{o.numero}</td>
                  <td className="px-4 py-3">
                    {client
                      ? `${client.prenom} ${client.nom}`.trim()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{o.vehicle_label ?? "—"}</td>
                  <td className="px-4 py-3">
                    {formatPrice(Number(o.amount))}
                  </td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/commandes/${o.id}`}
                      className="font-semibold text-orange hover:underline"
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!orders?.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[#5a6b80]"
                >
                  Aucun bon de commande.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
