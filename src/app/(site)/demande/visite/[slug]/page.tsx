import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VisitRequestForm } from "@/components/demande-visite-form";
import { getVehicleBySlugFromDb } from "@/lib/vehicles-db";
import {
  formatPrice,
  vehicleDisplayName,
  vehiclePath,
} from "@/lib/vehicles";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { vehicle } = await getVehicleBySlugFromDb(slug);
  if (!vehicle) return { title: "Rendez-vous" };
  return {
    title: `Rendez-vous — ${vehicleDisplayName(vehicle)}`,
    description: `Demandez un rendez-vous pour voir ${vehicleDisplayName(vehicle)} chez MAS OCAS AUTO.`,
  };
}

export default async function DemandeVisitePage({ params }: Props) {
  const { slug } = await params;
  const { vehicle } = await getVehicleBySlugFromDb(slug);
  if (!vehicle) notFound();

  const label = vehicleDisplayName(vehicle);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
        Visite / essai
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">
        Demande de rendez-vous
      </h1>
      <p className="mt-3 text-[#5a6b80]">
        Pour venir voir le véhicule au garage du Mans. Confirmation par un
        conseiller.
      </p>

      <div className="mt-8 flex gap-4 border border-[#d0d9e6] bg-white p-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-navy">
          <Image
            src={vehicle.image}
            alt={vehicle.imageAlt}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-navy">{label}</p>
          <p className="text-sm text-[#5a6b80]">
            {vehicle.year} · {formatPrice(vehicle.price)}
          </p>
          <Link
            href={vehiclePath(slug)}
            className="mt-1 inline-block text-sm font-semibold text-orange hover:underline"
          >
            Voir la fiche
          </Link>
        </div>
      </div>

      <div className="mt-8 border border-[#d0d9e6] bg-white p-5 sm:p-6">
        <VisitRequestForm vehicleSlug={slug} vehicleLabel={label} />
      </div>
    </div>
  );
}
