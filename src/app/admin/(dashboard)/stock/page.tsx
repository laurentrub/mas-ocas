import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatMileage } from "@/lib/vehicles";
import { FbImportButton } from "@/components/admin/fb-import-button";

export default async function AdminStockPage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, slug, brand, model, year, price, mileage, status, source")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            Stock
          </h1>
          <p className="mt-2 text-[#5a6b80]">
            {vehicles?.length ?? 0} véhicule{(vehicles?.length ?? 0) > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FbImportButton />
          <Link
            href="/admin/stock/new"
            className="inline-flex h-8 items-center rounded-lg bg-orange px-3 text-sm font-medium text-white"
          >
            Ajouter
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#d0d9e6] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#d0d9e6] bg-mist text-xs uppercase tracking-wide text-[#5a6b80]">
            <tr>
              <th className="px-4 py-3 font-semibold">Véhicule</th>
              <th className="px-4 py-3 font-semibold">Prix</th>
              <th className="px-4 py-3 font-semibold">Km</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {(vehicles ?? []).map((v) => (
              <tr key={v.id} className="border-b border-[#eef2f7]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-navy">
                    {v.brand} {v.model}
                  </p>
                  <p className="text-xs text-[#5a6b80]">{v.year}</p>
                </td>
                <td className="px-4 py-3">{formatPrice(Number(v.price))}</td>
                <td className="px-4 py-3">{formatMileage(v.mileage)}</td>
                <td className="px-4 py-3">{v.status}</td>
                <td className="px-4 py-3 text-[#5a6b80]">{v.source}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/stock/${v.id}`}
                    className="font-semibold text-orange hover:underline"
                  >
                    Éditer
                  </Link>
                </td>
              </tr>
            ))}
            {!vehicles?.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#5a6b80]">
                  Aucun véhicule. Ajoutez-en un ou importez depuis Facebook.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
