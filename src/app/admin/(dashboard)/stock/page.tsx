import Link from "next/link";
import { StockVehiclesTable } from "@/components/admin/stock-vehicles-table";
import { getSessionStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function AdminStockPage() {
  const [supabase, session] = await Promise.all([
    createClient(),
    getSessionStaff(),
  ]);
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select(
      "id, slug, brand, model, year, price, mileage, status, source, image, image_alt"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            Stock
          </h1>
          <p className="mt-2 text-[#5a6b80]">
            {vehicles?.length ?? 0} véhicule
            {(vehicles?.length ?? 0) > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/stock/new"
          className="inline-flex h-8 items-center rounded-lg bg-orange px-3 text-sm font-medium text-white"
        >
          Ajouter
        </Link>
      </div>

      <StockVehiclesTable
        vehicles={vehicles ?? []}
        canDelete={Boolean(session?.access.canDeleteVehicles)}
      />
    </div>
  );
}
