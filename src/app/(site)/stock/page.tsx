import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  formatMileage,
  formatPrice,
  vehiclePath,
} from "@/lib/vehicles";
import {
  filterVehicleList,
  listVehiclesFromDb,
} from "@/lib/vehicles-db";
import {
  categoryLabel,
  stockHref,
  subcategoryLabel,
} from "@/lib/vehicle-categories";

export const metadata: Metadata = {
  title: "Stock véhicules",
  description:
    "Parcourez le stock multi-marques de MAS OCAS AUTO : occasions contrôlées, prix affichés, livraison possible.",
};

type Props = {
  searchParams: Promise<{
    q?: string;
    budget?: string;
    km?: string;
    cat?: string;
    sub?: string;
  }>;
};

export default async function StockPage({ searchParams }: Props) {
  const params = await searchParams;
  const { vehicles: all } = await listVehiclesFromDb();
  const list = filterVehicleList(all, params);
  const catName = categoryLabel(params.cat);
  const subName = subcategoryLabel(params.sub);
  const hasFilters = Boolean(
    params.q || params.budget || params.km || params.cat || params.sub
  );

  const title = subName
    ? subName
    : catName
      ? catName
      : "Stock multi-marques";

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
          Inventaire{catName ? ` · ${catName}` : ""}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#5a6b80] sm:text-lg">
          {list.length} véhicule{list.length > 1 ? "s" : ""}{" "}
          {hasFilters
            ? "correspondant à votre recherche"
            : "actuellement présentés"}
          . Contactez-nous pour confirmer la disponibilité.
        </p>
      </header>

      <form
        method="get"
        action="/stock"
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        role="search"
      >
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Rechercher un véhicule</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9aa8ba]"
            aria-hidden
          />
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Marque, modèle, mot-clé…"
            autoComplete="off"
            className="h-12 w-full rounded-lg border border-[#d5dde8] bg-white py-2 pl-10 pr-3.5 text-[15px] text-navy outline-none placeholder:text-[#9aa8ba] focus:border-orange focus:ring-2 focus:ring-orange/25"
          />
        </label>
        {params.cat ? (
          <input type="hidden" name="cat" value={params.cat} />
        ) : null}
        {params.sub ? (
          <input type="hidden" name="sub" value={params.sub} />
        ) : null}
        {params.budget ? (
          <input type="hidden" name="budget" value={params.budget} />
        ) : null}
        {params.km ? <input type="hidden" name="km" value={params.km} /> : null}
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange px-6 text-[15px] font-bold text-white transition-colors hover:bg-[#e05f00]"
        >
          <Search className="size-4" aria-hidden />
          Rechercher
        </button>
      </form>

      {hasFilters ? (
        <p className="mt-3 text-sm text-[#5a6b80]">
          Filtres actifs
          {catName ? ` · ${catName}` : ""}
          {subName ? ` · ${subName}` : ""}
          {params.q ? ` · « ${params.q} »` : ""}
          {params.budget
            ? ` · budget ≤ ${Number(params.budget).toLocaleString("fr-FR")} €`
            : ""}
          {params.km
            ? ` · ≤ ${Number(params.km).toLocaleString("fr-FR")} km`
            : ""}
          {" — "}
          <Link
            href={stockHref()}
            className="font-semibold text-orange hover:underline"
          >
            Réinitialiser
          </Link>
        </p>
      ) : null}

      {list.length === 0 ? (
        <div className="mt-12 rounded-xl border border-[#d0d9e6] bg-white px-6 py-10 text-center">
          <p className="font-display text-xl font-bold text-navy">
            Aucun véhicule pour ces critères
          </p>
          <p className="mt-2 text-[#5a6b80]">
            Élargissez votre recherche ou consultez tout le stock.
          </p>
          <Link
            href={stockHref()}
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-orange px-5 text-sm font-bold text-white"
          >
            Voir tout le stock
          </Link>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((vehicle) => (
            <li key={vehicle.slug}>
              <Link
                href={vehiclePath(vehicle.slug)}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute left-3 top-3 rounded bg-navy/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {vehicle.status}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#7a8a9c]">
                    {vehicle.brand} · {vehicle.year}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-navy transition-colors group-hover:text-orange">
                    {vehicle.model}
                  </h2>
                  <p className="mt-2 text-sm text-[#5a6b80]">
                    {formatMileage(vehicle.mileage)} · {vehicle.fuel} ·{" "}
                    {vehicle.transmission}
                  </p>
                  <p className="mt-1 text-sm text-[#5a6b80]">{vehicle.highlight}</p>
                  <p className="mt-3 font-display text-lg font-extrabold text-navy">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
