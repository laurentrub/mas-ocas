import type { Metadata } from "next";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales de ${company.brand}, extraites de l'immatriculation RCS.`,
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
        Informations légales
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
        Mentions légales
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Informations issues de l&apos;extrait Kbis (immatriculation principale au
        RCS), à jour au 1<sup>er</sup> septembre 2026 — Greffe du Tribunal des
        Activités Économiques du Mans.
      </p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Éditeur du site
          </h2>
          <ul className="mt-3 space-y-1 text-foreground/90">
            <li>
              <strong>Nom commercial :</strong> {company.brand}
            </li>
            <li>
              <strong>Exploitant :</strong> {company.legalName} (
              {company.legalForm})
            </li>
            <li>
              <strong>Adresse de l&apos;établissement :</strong>{" "}
              {company.address.full}
            </li>
            <li>
              <strong>Immatriculation :</strong> {company.rcs.label}
            </li>
            <li>
              <strong>N° de gestion :</strong> {company.managementNumber}
            </li>
            <li>
              <strong>Date d&apos;immatriculation :</strong>{" "}
              {company.registrationDate}
            </li>
            <li>
              <strong>Début d&apos;activité :</strong>{" "}
              {company.activityStartDate}
            </li>
            <li>
              <strong>Nom de domaine déclaré :</strong> {company.domain}
            </li>
            <li>
              <strong>Contact :</strong>{" "}
              <a className="text-signal hover:underline" href={`mailto:${company.email}`}>
                {company.email}
              </a>{" "}
              · {company.phone}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Activité
          </h2>
          <p className="mt-3 text-foreground/90">{company.activity}.</p>
          <p className="mt-2 text-muted-foreground">
            Mode d&apos;exploitation : exploitation personnelle · Origine :
            création.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Hébergement
          </h2>
          <p className="mt-3 text-foreground/90">
            Site hébergé dans le cadre du déploiement choisi par l&apos;éditeur.
            Pour toute question technique relative à l&apos;hébergement,
            contactez {company.email}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Propriété intellectuelle
          </h2>
          <p className="mt-3 text-foreground/90">
            L&apos;ensemble des contenus de ce site (textes, visuels, structure)
            est protégé. Toute reproduction non autorisée est interdite.
            Les photographies de véhicules peuvent être illustratives.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Données personnelles
          </h2>
          <p className="mt-3 text-foreground/90">
            Le formulaire de contact de cette version vitrine n&apos;envoie pas
            les données à un serveur : elles restent dans votre navigateur. Pour
            toute demande relative à vos données, écrivez à {company.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
