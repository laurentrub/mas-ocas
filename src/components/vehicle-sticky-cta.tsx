"use client";

import Link from "next/link";
import { Calculator, CalendarDays, Truck } from "lucide-react";

type Props = {
  vehicleSlug: string;
  vehicleLabel: string;
  priceLabel: string;
};

export function VehicleStickyCta({
  vehicleSlug,
  vehicleLabel,
  priceLabel,
}: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d0d9e6] bg-white/95 px-3 py-2.5 shadow-[0_-8px_30px_rgb(10_37_64/0.12)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-[#5a6b80]">
            {vehicleLabel}
          </p>
          <p className="font-display text-base font-extrabold text-navy">
            {priceLabel}
          </p>
        </div>
        <Link
          href={`/demande/visite/${vehicleSlug}`}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-orange px-4 text-sm font-bold text-white"
        >
          <CalendarDays className="size-4" aria-hidden />
          Rendez-vous
        </Link>
      </div>
      <div className="mx-auto mt-2 flex max-w-6xl gap-2 overflow-x-auto pb-0.5 text-[11px] font-semibold text-[#5a6b80]">
        <Link
          href={`/demande/livraison/${vehicleSlug}`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-mist px-2.5 py-1.5"
        >
          <Truck className="size-3.5 text-orange" aria-hidden />
          Livraison
        </Link>
        <Link
          href={`/demande/financement/${vehicleSlug}`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-mist px-2.5 py-1.5"
        >
          <Calculator className="size-3.5 text-orange" aria-hidden />
          Financement
        </Link>
      </div>
    </div>
  );
}
