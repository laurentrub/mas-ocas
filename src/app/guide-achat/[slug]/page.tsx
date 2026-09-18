import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { company } from "@/lib/company";
import {
  getGuideArticle,
  getRelatedArticles,
  guideArticles,
} from "@/lib/guide-achat";
import { guideIcons } from "@/lib/guide-icons";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guideArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) return { title: "Guide introuvable" };
  return {
    title: article.title,
    description: article.metaDescription,
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) notFound();

  const Icon = guideIcons[article.icon];
  const related = getRelatedArticles(article);

  return (
    <div className="bg-[#f4f6f9]">
      <article>
        <header className="border-b border-[#dce3ee] bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
            <Link
              href="/guide-achat"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5a6b80] transition-colors hover:text-orange"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Retour au guide d’achat
            </Link>
            <div className="mt-8 flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-navy text-orange">
                <Icon className="size-6" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
                  {company.brand}
                </p>
                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                  {article.h1}
                </h1>
              </div>
            </div>
            <p className="mt-6 text-base leading-relaxed text-[#5a6b80] sm:text-lg">
              {article.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/stock"
                className="inline-flex h-11 items-center rounded-lg bg-orange px-5 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
              >
                Voir le stock
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-lg border border-navy/20 bg-white px-5 text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[800px] space-y-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {article.sections.map((section) => (
            <section
              key={section.heading}
              className="border-t-[3px] border-orange bg-white px-6 py-8 sm:px-8"
            >
              <h2 className="font-display text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-relaxed text-[#5a6b80]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-[#dce3ee] bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy">
              Guides associés
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => {
                const RelatedIcon = guideIcons[item.icon];
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/guide-achat/${item.slug}`}
                      className="group block border-t-[3px] border-orange pt-4"
                    >
                      <RelatedIcon
                        className="size-5 text-orange"
                        aria-hidden
                      />
                      <h3 className="mt-3 font-display text-base font-bold text-navy group-hover:text-orange">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#5a6b80]">
                        {item.summary}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-8">
              <Link
                href="/guide-achat"
                className="text-sm font-bold text-orange hover:underline"
              >
                Voir tout le guide d’achat →
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="border-t border-[#dce3ee] bg-navy py-12 text-white lg:py-14">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
              Besoin d’un avis sur votre dossier ?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              {company.brand} · {company.address.full} — Mathieu SINGER vous
              répond.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/stock"
              className="inline-flex h-11 items-center rounded-lg border border-white/30 px-5 text-sm font-bold text-white transition-colors hover:border-orange hover:text-orange"
            >
              Voir le stock
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-lg bg-orange px-5 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
