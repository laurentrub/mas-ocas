import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Car,
  FileText,
  Globe,
  Truck,
} from "lucide-react";
import { company } from "@/lib/company";
import { guideTopics } from "@/lib/guide-achat";

export const metadata: Metadata = {
  title: "Guide d’achat",
  description:
    "Acheter, importer, documents, livraison et financement : le guide d’achat MAS OCAS AUTO.",
};

const icons = {
  acheter: Car,
  importer: Globe,
  documents: FileText,
  livraison: Truck,
  frais: Calculator,
} as const;

export default function GuideAchatPage() {
  return (
    <div className="bg-[#f4f6f9]">
      <section className="border-b border-[#dce3ee] bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            {company.brand}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Guide d’achat
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5a6b80] sm:text-lg">
            Les étapes essentielles pour choisir, financer et recevoir votre
            véhicule d’occasion — avec un accompagnement clair jusqu’à la remise
            des clés.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/stock"
              className="inline-flex h-12 items-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
            >
              Voir les véhicules
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-lg border border-navy/20 bg-white px-6 text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1200px] space-y-10 px-4 sm:px-6 lg:px-8">
          {guideTopics.map((topic) => {
            const Icon = icons[topic.id];
            return (
              <article
                key={topic.id}
                id={topic.id}
                className="scroll-mt-28 border-t-[3px] border-orange bg-white px-6 py-8 sm:px-8 sm:py-10"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-navy text-orange">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                      {topic.title}
                    </h2>
                    <p className="mt-2 text-base font-medium text-[#5a6b80]">
                      {topic.summary}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {topic.body.map((paragraph) => (
                        <li
                          key={paragraph}
                          className="flex gap-3 text-[15px] leading-relaxed text-[#5a6b80]"
                        >
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-orange"
                            aria-hidden
                          />
                          <span>{paragraph}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#dce3ee] bg-navy py-14 text-white lg:py-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Une question sur votre projet ?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              Contactez {company.brand} au Mans : stock, importation, démarches
              ou livraison — un interlocuteur vous répond.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
          >
            Demande d&apos;info
          </Link>
        </div>
      </section>
    </div>
  );
}
