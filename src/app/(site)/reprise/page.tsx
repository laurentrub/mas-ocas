import type { Metadata } from "next";
import { RepriseForm } from "@/components/reprise-form";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Reprise de véhicule",
  description: `Estimez la reprise de votre véhicule auprès de ${company.brand} au Mans.`,
};

export default function ReprisePage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:py-20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
          Reprise
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Estimez la reprise de votre véhicule
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Indiquez les infos essentielles de votre voiture ou utilitaire.{" "}
          {company.brand} vous propose une estimation indicative, utile aussi
          dans le cadre d&apos;un achat dans notre stock.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-[#3d4f63]">
          <li className="border-l-[3px] border-orange pl-4">
            Réponse sous 24 h ouvrées
          </li>
          <li className="border-l-[3px] border-orange pl-4">
            Estimation sans engagement
          </li>
          <li className="border-l-[3px] border-orange pl-4">
            Reprise possible lors de l&apos;achat d&apos;un véhicule chez nous
          </li>
        </ul>
      </div>
      <div className="bg-card/70 p-6 sm:p-8">
        <RepriseForm />
      </div>
    </div>
  );
}
