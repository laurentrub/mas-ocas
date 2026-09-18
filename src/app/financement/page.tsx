import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Calculator, FileText } from "lucide-react";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Financement",
  description:
    "Financement, crédit ou simulation pour votre véhicule d'occasion — MAS OCAS AUTO au Mans.",
};

const financePoints = [
  {
    icon: BadgeCheck,
    title: "Financement",
    text: "Solutions adaptées à l’usage quotidien, avec un interlocuteur local.",
  },
  {
    icon: FileText,
    title: "Crédit",
    text: "Montage de dossier avec nos partenaires, sans jargon inutile.",
  },
  {
    icon: Calculator,
    title: "Simulation",
    text: "Estimez une mensualité indicative avant de vous engager.",
  },
] as const;

export default function FinancementPage() {
  return (
    <div className="bg-navy text-white">
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
            Budget · {company.brand}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Votre véhicule, avec une solution de financement adaptée.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Financement, crédit ou simple simulation : on clarifie les options
            avant que vous ne vous engagiez.
          </p>

          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {financePoints.map((item) => (
              <li key={item.title} className="border-l-[3px] border-orange pl-5">
                <item.icon className="size-6 text-orange" aria-hidden />
                <h2 className="mt-4 font-display text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/contact?sujet=Financement"
              className="inline-flex h-12 items-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
            >
              Faire une simulation
            </Link>
            <Link
              href="/guide-achat/financer-vehicule"
              className="inline-flex h-12 items-center rounded-lg border border-white/25 bg-transparent px-6 text-sm font-bold text-white transition-colors hover:border-orange hover:text-orange"
            >
              Lire le guide financement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
