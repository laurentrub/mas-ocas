import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales de ${company.brand}, extraites de l'immatriculation RCS.`,
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro={
        <p>
          Informations issues de l&apos;extrait Kbis (immatriculation principale au
          RCS), à jour au 1<sup>er</sup> septembre 2026 — Greffe du Tribunal des
          Activités Économiques du Mans.
        </p>
      }
    >
      <LegalSection title="Éditeur du site">
        <ul className="space-y-1">
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
            <strong>Début d&apos;activité :</strong> {company.activityStartDate}
          </li>
          <li>
            <strong>Nom de domaine déclaré :</strong> {company.domain}
          </li>
          <li>
            <strong>Contact :</strong>{" "}
            <a
              className="text-signal hover:underline"
              href={`mailto:${company.email}`}
            >
              {company.email}
            </a>{" "}
            · {company.phone}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Directeur de la publication">
        <p>
          {company.legalName}, en qualité d&apos;{company.legalForm.toLowerCase()}
          .
        </p>
      </LegalSection>

      <LegalSection title="Activité">
        <p>{company.activity}.</p>
        <p className="text-muted-foreground">
          Mode d&apos;exploitation : exploitation personnelle · Origine :
          création.
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <ul className="space-y-1">
          <li>
            <strong>Hébergeur :</strong> {company.hosting.name}
          </li>
          <li>
            <strong>Adresse :</strong> {company.hosting.address}
          </li>
          <li>
            <strong>Site :</strong>{" "}
            <a
              className="text-signal hover:underline"
              href={company.hosting.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              {company.hosting.website}
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des contenus de ce site (textes, photographies,
          logos, structure, éléments graphiques) est protégé par le droit de la
          propriété intellectuelle. Toute reproduction, représentation ou
          diffusion, totale ou partielle, sans autorisation écrite préalable de{" "}
          {company.brand} est interdite.
        </p>
        <p>
          Les photographies de véhicules peuvent être illustratives et ne
          constituent pas une offre contractuelle à elles seules.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement des données personnelles collectées via le site est
          décrit dans la{" "}
          <a className="text-signal hover:underline" href="/politique-de-confidentialite">
            politique de confidentialité
          </a>{" "}
          et la{" "}
          <a className="text-signal hover:underline" href="/cookies">
            politique cookies
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
