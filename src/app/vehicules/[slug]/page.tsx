import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calculator,
  Check,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { VehicleFaq } from "@/components/vehicle-faq";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { VehicleStickyCta } from "@/components/vehicle-sticky-cta";
import { company } from "@/lib/company";
import {
  buildVehicleJsonLd,
  contactVehicleHref,
  vehicleFaqItems,
  vehicleSpecs,
} from "@/lib/vehicle-detail";
import {
  formatMileage,
  formatPrice,
  getSimilarVehicles,
  getVehicle,
  preparationFlags,
  vehicleDisplayName,
  vehicleEditorial,
  vehiclePath,
  vehicleSeoDescription,
  vehicleSeoTitle,
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

  const title = vehicleSeoTitle(vehicle);
  const description = vehicleSeoDescription(vehicle);
  const url = vehiclePath(vehicle.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: vehicle.image, alt: vehicle.imageAlt }],
    },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const name = vehicleDisplayName(vehicle);
  const editorial = vehicleEditorial(vehicle);
  const specs = vehicleSpecs(vehicle);
  const prep = preparationFlags(vehicle.preparation);
  const similar = getSimilarVehicles(vehicle, 4);
  const jsonLd = buildVehicleJsonLd(vehicle);
  const faqItems = vehicleFaqItems(vehicle);
  const tel = company.phone.replace(/\s/g, "");

  const galleryImages = [
    { src: vehicle.image, alt: vehicle.imageAlt },
    ...(vehicle.gallery ?? []),
  ];

  const ctaInfos = contactVehicleHref(vehicle);
  const ctaRappel = contactVehicleHref(vehicle, "Rappel");
  const ctaFinance = contactVehicleHref(vehicle, "Financement");
  const ctaLivraison = contactVehicleHref(vehicle, "Livraison");

  return (
    <div className="bg-[#f4f6f9] pb-28 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-[#dce3ee] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="Fil d’Ariane" className="text-sm text-[#5a6b80]">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-orange">
                  Accueil
                </Link>
              </li>
              <li aria-hidden className="text-[#a0adbc]">
                /
              </li>
              <li>
                <Link href="/stock" className="hover:text-orange">
                  Véhicules
                </Link>
              </li>
              <li aria-hidden className="text-[#a0adbc]">
                /
              </li>
              <li>
                <Link
                  href={`/stock?q=${encodeURIComponent(vehicle.brand)}`}
                  className="hover:text-orange"
                >
                  {vehicle.brand}
                </Link>
              </li>
              <li aria-hidden className="text-[#a0adbc]">
                /
              </li>
              <li className="font-medium text-navy" aria-current="page">
                {vehicle.model}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Galerie + Infos + CTA */}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <VehicleGallery
            images={galleryImages}
            brand={vehicle.brand}
            model={vehicle.model}
          />

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a8a9c]">
              {vehicle.brand} · {vehicle.status}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              {vehicle.brand} {vehicle.model}{" "}
              <span className="text-orange">{vehicle.year}</span>
            </h1>
            <p className="mt-2 text-[#5a6b80]">{vehicle.highlight}</p>
            <p className="mt-5 font-display text-3xl font-extrabold text-navy">
              {formatPrice(vehicle.price)}
            </p>
            <p className="mt-2 text-sm text-[#5a6b80]">
              {formatMileage(vehicle.mileage)} · {vehicle.fuel} ·{" "}
              {vehicle.transmission} · {vehicle.power}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href={ctaInfos}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-orange text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
              >
                Demander des infos
              </Link>
              <Link
                href={ctaRappel}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
              >
                <Phone className="size-4" aria-hidden />
                Être rappelé
              </Link>
              <Link
                href={ctaFinance}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
              >
                <Calculator className="size-4" aria-hidden />
                Financement
              </Link>
              <Link
                href={ctaLivraison}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
              >
                <Truck className="size-4" aria-hidden />
                Devis livraison
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-[#5a6b80] sm:text-left">
              Réponse sous 24 h ouvrées · essai sur rendez-vous ·{" "}
              <a href={`tel:${tel}`} className="font-semibold text-navy hover:text-orange">
                {company.phone}
              </a>
            </p>
          </aside>
        </div>

        {/* Description éditoriale */}
        <section className="mt-14 border-t border-[#dce3ee] pt-10" aria-labelledby="desc-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Présentation
          </p>
          <h2
            id="desc-heading"
            className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
          >
            Ce véhicule en détail
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#5a6b80] sm:text-lg">
            {editorial}
          </p>
        </section>

        {/* Équipements */}
        <section className="mt-14" aria-labelledby="equip-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Dotation
          </p>
          <h2
            id="equip-heading"
            className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
          >
            Équipements
          </h2>
          {vehicle.equipmentCategories && vehicle.equipmentCategories.length > 0 ? (
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {vehicle.equipmentCategories.map((cat) => (
                <div key={cat.name}>
                  <h3 className="font-display text-lg font-bold text-navy">
                    {cat.name}
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {cat.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-[#0a2540]"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {vehicle.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-[#0a2540]"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Caractéristiques */}
        <section className="mt-14" aria-labelledby="specs-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Technique
          </p>
          <h2
            id="specs-heading"
            className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
          >
            Caractéristiques
          </h2>
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-[#d0d9e6] bg-white p-6 sm:grid-cols-3 lg:grid-cols-5">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-[#7a8a9c]">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-navy">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Préparation — flags réels seulement */}
        {prep.length > 0 ? (
          <section className="mt-14" aria-labelledby="prep-heading">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Avant remise
            </p>
            <h2
              id="prep-heading"
              className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
            >
              Préparation
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {prep.map((item) => (
                <li
                  key={item.key}
                  className="flex items-start gap-3 rounded-lg border border-[#d0d9e6] bg-white px-4 py-3 text-sm text-navy"
                >
                  <Wrench className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Import / Origine — conditionnel */}
        {vehicle.importOrigin ? (
          <section className="mt-14" aria-labelledby="import-heading">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Provenance
            </p>
            <h2
              id="import-heading"
              className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
            >
              Import / Origine
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#5a6b80]">
              Origine : <strong className="text-navy">{vehicle.importOrigin.country}</strong>
              {vehicle.importOrigin.note ? ` — ${vehicle.importOrigin.note}` : null}
            </p>
            <p className="mt-4 text-sm text-[#5a6b80]">
              En savoir plus :{" "}
              <Link
                href="/guide-achat/importer-voiture"
                className="font-semibold text-orange hover:underline"
              >
                guide import
              </Link>
              {" · "}
              <Link
                href="/guide-achat/exporter-voiture"
                className="font-semibold text-orange hover:underline"
              >
                guide export
              </Link>
            </p>
          </section>
        ) : null}

        {/* Financement — sans taux inventés */}
        <section
          id="financement"
          className="mt-14 scroll-mt-28 rounded-xl bg-navy px-6 py-10 text-white sm:px-8"
          aria-labelledby="finance-heading"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Budget
          </p>
          <h2
            id="finance-heading"
            className="mt-2 font-display text-2xl font-extrabold sm:text-3xl"
          >
            Financement
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
            Une simulation est possible pour ce {name} avec nos partenaires de
            crédit auto. Aucun taux ni mensualité n’est affiché sans étude de
            dossier — nous clarifions les options avant engagement.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={ctaFinance}
              className="inline-flex h-11 items-center rounded-lg bg-orange px-5 text-sm font-bold text-white hover:bg-[#e05f00]"
            >
              Demander une simulation
            </Link>
            <Link
              href="/guide-achat/financer-vehicule"
              className="inline-flex h-11 items-center rounded-lg border border-white/25 px-5 text-sm font-bold text-white hover:border-orange hover:text-orange"
            >
              Guide financement
            </Link>
          </div>
        </section>

        {/* Livraison */}
        <section
          id="livraison"
          className="mt-14 scroll-mt-28"
          aria-labelledby="delivery-heading"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Remise des clés
          </p>
          <h2
            id="delivery-heading"
            className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
          >
            Livraison
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5a6b80]">
            Remise au garage ({company.address.full}) ou livraison à domicile /
            sur site selon votre secteur. Tarifs sur devis, communiqués avant
            validation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={ctaLivraison}
              className="inline-flex h-11 items-center rounded-lg bg-navy px-5 text-sm font-bold text-white hover:bg-orange"
            >
              Demander un devis livraison
            </Link>
            <Link
              href="/guide-achat/livraison-vehicule"
              className="inline-flex h-11 items-center rounded-lg border border-navy/20 bg-white px-5 text-sm font-bold text-navy hover:border-orange hover:text-orange"
            >
              Guide livraison
            </Link>
          </div>
        </section>

        {/* Garantie — sans durée inventée */}
        <section className="mt-14" aria-labelledby="warranty-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Sérénité
          </p>
          <h2
            id="warranty-heading"
            className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
          >
            Garantie
          </h2>
          <div className="mt-5 flex gap-3 rounded-xl border border-[#d0d9e6] bg-white p-5">
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-orange" aria-hidden />
            <p className="text-[15px] leading-relaxed text-[#5a6b80]">
              {vehicle.warrantyNote ? (
                vehicle.warrantyNote
              ) : (
                <>
                  Une garantie adaptée au véhicule est proposée et expliquée
                  clairement avant signature. La durée et le périmètre exacts
                  sont confirmés au moment de la vente — aucune durée n’est
                  inventée sur cette fiche.
                </>
              )}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14" aria-labelledby="faq-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Questions
          </p>
          <h2
            id="faq-heading"
            className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
          >
            FAQ
          </h2>
          <div className="mt-6">
            <VehicleFaq items={faqItems} />
          </div>
        </section>

        {/* Véhicules similaires */}
        {similar.length > 0 ? (
          <section className="mt-14" aria-labelledby="similar-heading">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
                  Continuer
                </p>
                <h2
                  id="similar-heading"
                  className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl"
                >
                  Véhicules similaires
                </h2>
              </div>
              <Link
                href="/stock"
                className="text-sm font-semibold text-orange hover:underline"
              >
                Voir tout le stock
              </Link>
            </div>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={vehiclePath(v.slug)}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy">
                      <Image
                        src={v.image}
                        alt={v.imageAlt}
                        fill
                        loading="lazy"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#7a8a9c]">
                      {v.brand} · {v.year}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-navy group-hover:text-orange">
                      {v.model}
                    </h3>
                    <p className="mt-1 text-sm text-[#5a6b80]">
                      {formatMileage(v.mileage)} · {v.fuel}
                    </p>
                    <p className="mt-2 font-display text-base font-extrabold text-navy">
                      {formatPrice(v.price)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Maillage + CTA final */}
        <section className="mt-16 rounded-xl border border-[#d0d9e6] bg-white px-6 py-10 text-center sm:px-10">
          <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            Intéressé par ce {vehicle.brand} {vehicle.model} ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#5a6b80]">
            {company.brand} au Mans — infos, essai, financement ou livraison.
            Un interlocuteur vous répond sous 24 h ouvrées.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ctaInfos}
              className="inline-flex h-12 items-center rounded-lg bg-orange px-6 text-sm font-bold text-white hover:bg-[#e05f00]"
            >
              Demander des informations
            </Link>
            <Link
              href={ctaFinance}
              className="inline-flex h-12 items-center rounded-lg border border-navy/20 px-6 text-sm font-bold text-navy hover:border-orange hover:text-orange"
            >
              Simulation financement
            </Link>
            <Link
              href={ctaLivraison}
              className="inline-flex h-12 items-center rounded-lg border border-navy/20 px-6 text-sm font-bold text-navy hover:border-orange hover:text-orange"
            >
              Devis livraison
            </Link>
          </div>
          <p className="mt-8 text-sm text-[#5a6b80]">
            Ressources :{" "}
            <Link href="/guide-achat" className="font-semibold text-orange hover:underline">
              Guide d’achat
            </Link>
            {" · "}
            <Link
              href="/guide-achat/importer-voiture"
              className="font-semibold text-orange hover:underline"
            >
              Import
            </Link>
            {" · "}
            <Link
              href="/guide-achat/exporter-voiture"
              className="font-semibold text-orange hover:underline"
            >
              Export
            </Link>
            {" · "}
            <Link
              href="/guide-achat/financer-vehicule"
              className="font-semibold text-orange hover:underline"
            >
              Financement
            </Link>
            {" · "}
            <Link
              href="/guide-achat/livraison-vehicule"
              className="font-semibold text-orange hover:underline"
            >
              Livraison
            </Link>
            {" · "}
            <Link href="/contact" className="font-semibold text-orange hover:underline">
              Contact
            </Link>
          </p>
        </section>
      </div>

      <VehicleStickyCta
        vehicleLabel={name}
        priceLabel={formatPrice(vehicle.price)}
      />
    </div>
  );
}
