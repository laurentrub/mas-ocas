import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function EditVehiclePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!vehicle) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-navy">
        Éditer · {vehicle.brand} {vehicle.model}
      </h1>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
