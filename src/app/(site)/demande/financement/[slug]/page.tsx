import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinanceRequestForm } from "@/components/demande-financement-form";
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
  if (!vehicle) return { title: "Financement sur mesure" };
  return {
    title: `Financement sur mesure — ${vehicleDisplayName(vehicle)}`,
    description: `Étude gratuite multi-financeurs (France & Europe) pour ${vehicleDisplayName(vehicle)}. Particuliers et professionnels, IBAN européens acceptés.`,
  };
}

export default async function DemandeFinancementPage({ params }: Props) {
  const { slug } = await params;
  const { vehicle } = await getVehicleBySlugFromDb(slug);
  if (!vehicle) notFound();

  const label = vehicleDisplayName(vehicle);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
        Crédit · LOA · LLD
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">
        Obtenez la meilleure offre pour votre véhicule
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[#5a6b80]">
        Étude <strong className="font-semibold text-navy">gratuite et sans engagement</strong> :
        nous interrogeons plusieurs organismes financiers partenaires — banques
        et captives, en France et en Europe — pour comparer taux et loyers et
        vous proposer la solution la plus adaptée. Réponse de principe{" "}
        <strong className="font-semibold text-navy">ultra-rapide</strong>, y
        compris pour les dossiers européens et frontaliers.
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
        <FinanceRequestForm
          vehicleSlug={slug}
          vehicleLabel={label}
          vehiclePrice={vehicle.price}
        />
      </div>
    </div>
  );
}
