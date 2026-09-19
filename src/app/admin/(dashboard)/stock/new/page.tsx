import { VehicleForm } from "@/components/admin/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-navy">
        Nouveau véhicule
      </h1>
      <VehicleForm />
    </div>
  );
}
