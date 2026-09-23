import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité et protection des données personnelles — ${company.brand}.`,
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro={
        <p>
          La présente politique décrit comment {company.brand} (
          {company.legalName}) collecte, utilise et protège vos données
          personnelles lorsque vous utilisez le site {company.domain} ou nos
          formulaires (contact, visite, livraison, financement).
        </p>
      }
    >
      <LegalSection title="Responsable du traitement">
        <ul className="space-y-1">
          <li>
            <strong>Responsable :</strong> {company.legalName} — {company.brand}
          </li>
          <li>
            <strong>Adresse :</strong> {company.address.full}
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

      <LegalSection title="Données collectées">
        <p>Selon les formulaires utilisés, nous pouvons collecter :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Identité : nom, prénom</li>
          <li>Coordonnées : e-mail, téléphone, adresse de livraison éventuelle</li>
          <li>
            Contenu de votre demande (véhicule concerné, créneau de visite,
            options de financement simulées, message libre)
          </li>
          <li>
            Données techniques de navigation (adresse IP, type de navigateur,
            pages consultées) via cookies ou journaux serveur — voir la{" "}
            <a className="text-signal hover:underline" href="/cookies">
              politique cookies
            </a>
          </li>
        </ul>
        <p>
          Les champs obligatoires sont indiqués dans chaque formulaire. Sans
          ces informations, nous ne pouvons pas traiter votre demande.
        </p>
      </LegalSection>

      <LegalSection title="Finalités et bases légales">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Répondre à vos demandes</strong> (contact, essai, livraison,
            simulation de financement) — intérêt légitime / mesures
            précontractuelles (art. 6.1.b et 6.1.f du RGPD).
          </li>
          <li>
            <strong>Suivi commercial et relation client</strong> liés à une
            demande en cours — intérêt légitime.
          </li>
          <li>
            <strong>Obligations légales</strong> (comptabilité, litiges,
            médiation) — obligation légale (art. 6.1.c).
          </li>
          <li>
            <strong>Amélioration du site</strong> (statistiques anonymisées
            éventuelles) — intérêt légitime, ou consentement si cookies non
            essentiels.
          </li>
        </ul>
        <p>
          Les simulations de financement affichées sur le site sont indicatives
          et ne constituent pas une offre de crédit. Aucune décision automatisée
          produisant des effets juridiques n&apos;est prise uniquement à partir
          de vos données sur ce site.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>Vos données sont destinées à :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            {company.brand} et les personnes habilitées à traiter les demandes
          </li>
          <li>
            Prestataires techniques (hébergement {company.hosting.name}, base de
            données) agissant en tant que sous-traitants
          </li>
          <li>
            Organismes de financement ou partenaires, uniquement si vous le
            demandez et dans le cadre d&apos;une mise en relation
          </li>
          <li>
            Autorités compétentes, si la loi l&apos;exige
          </li>
        </ul>
        <p>Nous ne vendons pas vos données personnelles.</p>
      </LegalSection>

      <LegalSection title="Durées de conservation">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Demandes sans suite commerciale : jusqu&apos;à 12 mois après le
            dernier contact
          </li>
          <li>
            Dossier client / commande : durée légale de conservation
            (notamment pièces comptables : 10 ans)
          </li>
          <li>
            Cookies techniques : durée limitée indiquée dans la politique
            cookies
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément au RGPD et à la loi Informatique et Libertés, vous
          disposez des droits d&apos;accès, de rectification, d&apos;effacement,
          de limitation, d&apos;opposition, de portabilité (lorsque applicable)
          et du droit de définir des directives relatives au sort de vos données
          après votre décès.
        </p>
        <p>
          Pour les exercer :{" "}
          <a
            className="text-signal hover:underline"
            href={`mailto:${company.email}`}
          >
            {company.email}
          </a>{" "}
          ou courrier à {company.address.full}, en précisant votre demande et
          une preuve d&apos;identité si nécessaire.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL (
          <a
            className="text-signal hover:underline"
            href="https://www.cnil.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          adaptées (accès restreint à l&apos;espace d&apos;administration,
          connexions sécurisées HTTPS, hébergement professionnel) afin de
          protéger vos données contre l&apos;accès non autorisé, la perte ou
          l&apos;altération.
        </p>
      </LegalSection>

      <LegalSection title="Transferts hors UE">
        <p>
          L&apos;hébergement du site peut impliquer des traitements hors Union
          européenne (notamment via {company.hosting.name}). Dans ce cas, des
          garanties appropriées sont recherchées (clauses contractuelles types
          ou mécanismes équivalents prévus par le RGPD).
        </p>
      </LegalSection>
    </LegalPage>
  );
}
