import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/lib/company";
import { guideArticles } from "@/lib/guide-achat";
import { guideIcons } from "@/lib/guide-icons";

export const metadata: Metadata = {
  title: "Guide d’achat",
  description:
    "Guide d’achat MAS OCAS AUTO : acheter, importer, exporter, démarches, documents, homologation, immatriculation, livraison et financement.",
};

export default function GuideAchatHubPage() {
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
            Achat d’occasion, import, export, démarches et livraison : les
            repères pour avancer sereinement, avec l’accompagnement de Mathieu
            SINGER au Mans.
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
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guideArticles.map((article) => {
              const Icon = guideIcons[article.icon];
              return (
                <li key={article.slug}>
                  <Link
                    href={`/guide-achat/${article.slug}`}
                    className="group flex h-full flex-col border-t-[3px] border-orange bg-white px-6 py-7 transition-shadow hover:shadow-[0_8px_24px_rgba(10,37,64,0.08)]"
                  >
                    <div className="flex size-11 items-center justify-center rounded-lg bg-navy text-orange">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <h2 className="mt-5 font-display text-xl font-extrabold tracking-tight text-navy group-hover:text-orange">
                      {article.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5a6b80]">
                      {article.summary}
                    </p>
                    <span className="mt-5 text-sm font-bold text-orange">
                      Lire le guide →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#dce3ee] bg-navy py-14 text-white lg:py-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Une question sur votre projet ?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              Contactez {company.brand} au Mans : stock, importation,
              exportation, démarches ou livraison — un interlocuteur vous
              répond.
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
