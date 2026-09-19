import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: vehicleCount },
    { count: leadCount },
    { count: newLeadCount },
    { count: orderCount },
  ] = await Promise.all([
    supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true })
      .neq("status", "Vendu"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "nouveau"),
    supabase.from("purchase_orders").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      label: "Véhicules en stock",
      value: vehicleCount ?? 0,
      href: "/admin/stock",
    },
    {
      label: "Demandes",
      value: leadCount ?? 0,
      href: "/admin/leads",
      hint: `${newLeadCount ?? 0} nouvelles`,
    },
    {
      label: "Bons de commande",
      value: orderCount ?? 0,
      href: "/admin/commandes",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Tableau de bord
        </h1>
        <p className="mt-2 text-[#5a6b80]">
          Vue d’ensemble du stock, des demandes et des commandes.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="block border border-[#d0d9e6] bg-white p-5 transition hover:border-orange"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
                {card.label}
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold text-navy">
                {card.value}
              </p>
              {"hint" in card && card.hint ? (
                <p className="mt-1 text-sm text-orange">{card.hint}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
