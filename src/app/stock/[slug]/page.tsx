import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import {
  formatMileage,
  formatPrice,
  getVehicle,
  vehicles,
} from "@/lib/vehicles";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Véhicule introuvable" };
  return {
    title: `${vehicle.brand} ${vehicle.model}`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const specs = [
    { label: "Année", value: String(vehicle.year) },
    { label: "Kilométrage", value: formatMileage(vehicle.mileage) },
    { label: "Énergie", value: vehicle.fuel },
    { label: "Boîte", value: vehicle.transmission },
    { label: "Puissance", value: vehicle.power },
    { label: "Couleur", value: vehicle.color },
    { label: "Portes", value: String(vehicle.doors) },
    { label: "Places", value: String(vehicle.seats) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/stock"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Retour au stock
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden bg-asphalt">
            <Image
              src={vehicle.image}
              alt={vehicle.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {vehicle.description}
          </p>
          <h2 className="mt-10 font-display text-xl font-semibold text-ink">
            Équipements
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {vehicle.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-signal" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {vehicle.brand} · {vehicle.status}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {vehicle.model}
          </h1>
          <p className="mt-2 text-muted-foreground">{vehicle.highlight}</p>
          <p className="mt-6 font-display text-3xl font-extrabold text-ink">
            {formatPrice(vehicle.price)}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-6">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-ink">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href={`/contact?vehicule=${encodeURIComponent(`${vehicle.brand} ${vehicle.model}`)}`}
            className="mt-8 inline-flex h-11 w-full items-center justify-center bg-orange text-sm font-semibold text-white transition-colors hover:bg-orange/90"
          >
            Demander des informations
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Réponse sous 24 h ouvrées · essai sur rendez-vous
          </p>
        </aside>
      </div>
    </div>
  );
}
