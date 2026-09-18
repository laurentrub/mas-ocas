import Link from "next/link";
import Image from "next/image";
import { ArrowLeftRight, Car, MapPin, ShieldCheck, Truck, Wrench } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { company } from "@/lib/company";
import { formatMileage, formatPrice, vehicles } from "@/lib/vehicles";

const heroCars = [
  {
    src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    alt: "Citadine d'occasion en stock",
  },
  {
    src: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    alt: "SUV multi-marques disponible",
  },
];

const trustItems = [
  { icon: Car, label: `${vehicles.length} véhicules multi-marques` },
  { icon: MapPin, label: `Point de vente au Mans` },
  { icon: ShieldCheck, label: "Dossier transparent & CT à jour" },
  { icon: ArrowLeftRight, label: "Reprise de votre ancien véhicule" },
  { icon: Wrench, label: "Livraison & accompagnement" },
];

export default function HomePage() {
  const featured = vehicles.filter((v) => v.status !== "Réservé").slice(0, 3);

  return (
    <>
      {/* Distinxion-style hero: light field + orange blobs + cars + headline */}
      <section className="relative overflow-hidden bg-[#f4f6f9] pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-orange/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-[360px] w-[480px] rounded-[40%] bg-orange/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[28%] top-1/3 h-40 w-72 rotate-12 rounded-[50%] bg-[#ffb070]/35 blur-2xl"
        />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8">
          <div className="relative mx-auto flex w-full max-w-xl justify-center lg:max-w-none">
            <div className="relative h-[240px] w-full sm:h-[300px] lg:h-[340px]">
              <div className="absolute left-0 top-6 z-10 w-[58%] overflow-hidden rounded-xl shadow-[0_20px_50px_rgb(12_35_64/0.22)] sm:top-8">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={heroCars[0].src}
                    alt={heroCars[0].alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 55vw, 320px"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 z-20 w-[62%] overflow-hidden rounded-xl shadow-[0_24px_55px_rgb(12_35_64/0.28)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={heroCars[1].src}
                    alt={heroCars[1].alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 60vw, 360px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-center lg:text-left">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-orange sm:text-xs">
              {company.brand}
            </p>
            <h1 className="mt-3 font-display text-[2rem] font-extrabold uppercase leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]">
              Trouvez la voiture qui vous ressemble
            </h1>
            <p className="mt-4 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-orange sm:text-base">
              Garage multi-marques · vente &amp; livraison
            </p>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#5a6b80] lg:mx-0">
              Occasions sélectionnées au Mans, dossier clair et remise des clés
              où vous en avez besoin.
            </p>
          </div>
        </div>

        {/* Floating search overlaps hero / trust bar */}
        <div className="relative z-20 mt-10 sm:mt-12 lg:-mb-10 lg:mt-14">
          <HeroSearch />
        </div>
      </section>

      {/* Trust / feature bar */}
      <section className="bg-navy pt-8 text-white lg:pt-16">
        <ul className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-4 lg:px-8 lg:py-10">
          {trustItems.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <item.icon className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
              <span className="text-sm font-medium leading-snug text-white/95">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="livraison"
        className="mx-auto max-w-[1200px] scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Notre métier
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Un garage clair, sans surprise.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6b80] sm:text-lg">
            {company.brand} accompagne particuliers et professionnels dans
            l&apos;achat de véhicules d&apos;occasion : contrôle, transparence du
            dossier et livraison possible sur Le Mans et en région.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="border-l-[3px] border-orange pl-6">
            <Truck className="size-6 text-orange" aria-hidden />
            <h3 className="mt-4 font-display text-xl font-bold text-navy">
              Livraison &amp; remise des clés
            </h3>
            <p className="mt-2 leading-relaxed text-[#5a6b80]">
              Vous venez au garage ou nous organisons la livraison. Chaque
              véhicule part avec ses documents et un point clair sur
              l&apos;entretien.
            </p>
          </div>
          <div className="border-l-[3px] border-navy/15 pl-6">
            <MapPin className="size-6 text-navy" aria-hidden />
            <h3 className="mt-4 font-display text-xl font-bold text-navy">
              Basés au Mans
            </h3>
            <p className="mt-2 leading-relaxed text-[#5a6b80]">
              {company.address.full}. Multi-marques selon le stock du moment.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce3ee] bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
                Sélection
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy">
                En stock en ce moment
              </h2>
            </div>
            <Link
              href="/stock"
              className="inline-flex h-10 items-center self-start rounded-md border border-[#c5d0de] px-4 text-sm font-semibold text-navy transition-colors hover:border-orange hover:text-orange sm:self-auto"
            >
              Tout le stock
            </Link>
          </div>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle) => (
              <li key={vehicle.slug}>
                <Link
                  href={`/stock/${vehicle.slug}`}
                  className="group block focus-visible:outline-none"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.imageAlt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7a8a9c]">
                      {vehicle.brand} · {vehicle.year}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold text-navy group-hover:text-orange">
                      {vehicle.model}
                    </h3>
                    <p className="mt-2 text-sm text-[#5a6b80]">
                      {formatMileage(vehicle.mileage)} · {vehicle.fuel} ·{" "}
                      {vehicle.transmission}
                    </p>
                    <p className="mt-3 font-display text-lg font-extrabold text-navy">
                      {formatPrice(vehicle.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Une question sur un véhicule ?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6b80] sm:text-lg">
            Décrivez votre besoin : budget, motorisation, délai de livraison. Nous
            revenons vers vous rapidement.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
          >
            Contacter {company.brand}
          </Link>
        </div>
      </section>
    </>
  );
}
