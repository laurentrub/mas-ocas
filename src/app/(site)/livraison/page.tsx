import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, PackageCheck, Truck } from "lucide-react";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Livraison",
  description:
    "Livraison de véhicule d'occasion : remise au Mans ou à domicile — MAS OCAS AUTO.",
};

export default function LivraisonPage() {
  return (
    <div className="bg-[#f4f6f9]">
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Remise des clés · {company.brand}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Nous livrons votre véhicule où vous le souhaitez.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#5a6b80] sm:text-lg">
              Remise au garage du Mans, livraison à domicile ou sur votre lieu de
              travail — selon vos contraintes.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex gap-3 text-[15px] text-[#5a6b80]">
                <MapPin className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
                <span>
                  <strong className="font-semibold text-navy">Zones :</strong> Le
                  Mans, Sarthe, Pays de la Loire — et au-delà sur étude.
                </span>
              </li>
              <li className="flex gap-3 text-[15px] text-[#5a6b80]">
                <Truck className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
                <span>
                  <strong className="font-semibold text-navy">Modalités :</strong>{" "}
                  prise de rendez-vous, contrôle final, remise des papiers.
                </span>
              </li>
              <li className="flex gap-3 text-[15px] text-[#5a6b80]">
                <PackageCheck className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
                <span>
                  <strong className="font-semibold text-navy">Tarifs :</strong> sur
                  devis, communiqués avant validation de la livraison.
                </span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact?sujet=Livraison"
                className="inline-flex h-12 items-center rounded-lg border border-navy/20 bg-white px-6 text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
              >
                Demander un devis livraison
              </Link>
              <Link
                href="/guide-achat/livraison-vehicule"
                className="inline-flex h-12 items-center rounded-lg bg-navy px-6 text-sm font-bold text-white transition-colors hover:bg-[#0d3052]"
              >
                Lire le guide livraison
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy shadow-[0_20px_50px_rgb(12_35_64/0.18)]">
            <Image
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80"
              alt="Route — livraison véhicule"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
