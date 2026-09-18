"use client";

import Link from "next/link";
import { Calculator, Info, Phone, Truck } from "lucide-react";
import { company } from "@/lib/company";

type Props = {
  vehicleLabel: string;
  priceLabel: string;
};

export function VehicleStickyCta({ vehicleLabel, priceLabel }: Props) {
  const encoded = encodeURIComponent(vehicleLabel);
  const tel = company.phone.replace(/\s/g, "");

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
        <a
          href={`tel:${tel}`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-navy/15 text-navy"
          aria-label="Être rappelé — appeler"
        >
          <Phone className="size-5" aria-hidden />
        </a>
        <Link
          href={`/contact?vehicule=${encoded}`}
          className="inline-flex h-11 shrink-0 items-center rounded-lg bg-orange px-4 text-sm font-bold text-white"
        >
          Infos
        </Link>
      </div>
      <p className="sr-only">
        Actions rapides : informations, appel, financement et devis livraison
        disponibles aussi sur la page.
      </p>
      <div className="mx-auto mt-2 flex max-w-6xl gap-2 overflow-x-auto pb-0.5 text-[11px] font-semibold text-[#5a6b80]">
        <Link
          href={`/contact?vehicule=${encoded}&sujet=Financement`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-mist px-2.5 py-1.5"
        >
          <Calculator className="size-3.5 text-orange" aria-hidden />
          Financement
        </Link>
        <Link
          href={`/contact?vehicule=${encoded}&sujet=Livraison`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-mist px-2.5 py-1.5"
        >
          <Truck className="size-3.5 text-orange" aria-hidden />
          Livraison
        </Link>
        <Link
          href={`/contact?vehicule=${encoded}`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-mist px-2.5 py-1.5"
        >
          <Info className="size-3.5 text-orange" aria-hidden />
          Demande d&apos;info
        </Link>
      </div>
    </div>
  );
}
