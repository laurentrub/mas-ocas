import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, nom, prenom, email, telephone, ville, created_at")
    .order("created_at", { ascending: false });

  const ids = (clients ?? []).map((c) => c.id);
  const orderCounts = new Map<string, number>();
  if (ids.length) {
    const { data: orders } = await supabase
      .from("purchase_orders")
      .select("client_id")
      .in("client_id", ids);
    for (const o of orders ?? []) {
      if (!o.client_id) continue;
      orderCounts.set(o.client_id, (orderCounts.get(o.client_id) ?? 0) + 1);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Clients
        </h1>
        <p className="mt-2 text-[#5a6b80]">
          Fiches créées via les bons de commande.
        </p>
      </header>

      <div className="overflow-x-auto border border-[#d0d9e6] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#d0d9e6] bg-mist text-xs uppercase tracking-wide text-[#5a6b80]">
            <tr>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Ville</th>
              <th className="px-4 py-3 font-semibold">BDC</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((c) => (
              <tr key={c.id} className="border-b border-[#eef2f7]">
                <td className="px-4 py-3 font-semibold text-navy">
                  {c.prenom} {c.nom}
                </td>
                <td className="px-4 py-3 text-[#5a6b80]">
                  <p>{c.email ?? "—"}</p>
                  <p className="text-xs">{c.telephone ?? ""}</p>
                </td>
                <td className="px-4 py-3 text-[#5a6b80]">{c.ville ?? "—"}</td>
                <td className="px-4 py-3">{orderCounts.get(c.id) ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="font-semibold text-orange hover:underline"
                  >
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
            {!clients?.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[#5a6b80]"
                >
                  Aucun client pour le moment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
