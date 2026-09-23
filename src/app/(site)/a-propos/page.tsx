import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ShieldCheck, Truck, Wrench } from "lucide-react";
import { company, companyTelHref } from "@/lib/company";

export const metadata: Metadata = {
  title: "Le garage",
  description: `${company.brand} au Mans — garage multi-marques, vente de véhicules d'occasion, livraison et accompagnement.`,
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "Sélection multi-marques",
    text: "Un stock de véhicules d’occasion choisi pour l’usage quotidien, avec un interlocuteur local.",
  },
  {
    icon: Wrench,
    title: "Préparation avant vente",
    text: "Contrôles, préparation et documents : on clarifie l’état du véhicule avant la remise des clés.",
  },
  {
    icon: Truck,
    title: "Livraison possible",
    text: "Retrait au garage ou livraison organisée selon devis — jusqu’à la remise des clés.",
  },
] as const;

export default function AProposPage() {
  return (
    <div>
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            {company.brand}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Un garage multi-marques au Mans
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {company.legalName} exploite {company.brand} : achat, vente et
            accompagnement autour de véhicules d&apos;occasion, avec une
            approche claire — du premier contact à la remise des clés.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-10 sm:grid-cols-3">
            {pillars.map((item) => (
              <li key={item.title}>
                <item.icon className="size-7 text-orange" aria-hidden />
                <h2 className="mt-4 font-display text-xl font-bold text-navy">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6b80]">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#dce3ee] bg-[#f4f6f9] py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Nous trouver
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy">
              Au Mans
            </h2>
            <address className="mt-6 space-y-2 text-base not-italic text-[#3d4f63]">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-5 shrink-0 text-orange" />
                <span>{company.address.full}</span>
              </p>
              <p>{company.hours}</p>
              <p>
                <a
                  className="font-semibold text-orange hover:underline"
                  href={`mailto:${company.email}`}
                >
                  {company.email}
                </a>
                {companyTelHref() ? (
                  <>
                    {" · "}
                    <a
                      className="font-semibold text-orange hover:underline"
                      href={companyTelHref()!}
                    >
                      {company.phone}
                    </a>
                  </>
                ) : null}
              </p>
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/stock"
                className="inline-flex h-11 items-center rounded-lg bg-orange px-5 text-sm font-bold text-white hover:bg-[#e05f00]"
              >
                Voir le stock
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-lg border border-[#d0d9e6] bg-white px-5 text-sm font-bold text-navy"
              >
                Nous contacter
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#d0d9e6] bg-white">
            <iframe
              title={`Carte — ${company.address.full}`}
              className="h-[280px] w-full sm:h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(company.address.full)}&z=15&output=embed`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
