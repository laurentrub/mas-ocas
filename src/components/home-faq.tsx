"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Les véhicules sont-ils contrôlés avant la vente ?",
    a: "Oui. Chaque véhicule est inspecté (mécanique, freinage, pneumatiques, électronique) et le contrôle technique est à jour ou en cours de renouvellement avant livraison.",
  },
  {
    q: "Puis-je venir essayer un véhicule au Mans ?",
    a: "Bien sûr. Prenez rendez-vous par téléphone ou via le formulaire de contact : nous préparons le véhicule et organisons l’essai autour de notre point de vente.",
  },
  {
    q: "Proposez-vous du financement ?",
    a: "Oui. Nous travaillons avec des partenaires de crédit auto pour une solution adaptée à votre budget. Une simulation est possible avant engagement.",
  },
  {
    q: "Livrez-vous hors du Mans ?",
    a: "Oui, sur Le Mans, la Sarthe et plus loin selon le dossier. Les modalités et tarifs sont établis sur devis, clairement avant validation.",
  },
  {
    q: "Quels documents dois-je prévoir pour l’achat ?",
    a: "Pièce d’identité, justificatif de domicile, et selon le financement les pièces demandées par l’organisme. Nous vous guidons étape par étape.",
  },
  {
    q: "La reprise de mon ancien véhicule est-elle possible ?",
    a: "Oui. Envoyez-nous les infos (marque, modèle, année, km, état) via le formulaire reprise : nous vous proposons une estimation pour finaliser l’achat.",
  },
] as const;

export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-[#d0d9e6] border-y border-[#d0d9e6]">
      {faqs.map((item, index) => {
        const isOpen = open === index;
        return (
          <li key={item.q}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="font-display text-base font-bold text-navy sm:text-lg">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "mt-1 size-5 shrink-0 text-orange transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-10 text-[15px] leading-relaxed text-[#5a6b80]">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
