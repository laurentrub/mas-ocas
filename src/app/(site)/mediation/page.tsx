import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Médiation et litiges",
  description: `Recours amiable, médiation de la consommation et litiges — ${company.brand}.`,
};

export default function MediationPage() {
  return (
    <LegalPage
      eyebrow="Recours"
      title="Médiation et litiges"
      intro={
        <p>
          Conformément aux articles L.611-1 et suivants et R.612-1 et suivants
          du Code de la consommation, {company.brand} s&apos;engage à privilégier
          le règlement amiable de tout différend avec un consommateur.
        </p>
      }
    >
      <LegalSection title="1. Réclamation préalable">
        <p>
          Avant toute médiation ou action judiciaire, adressez une réclamation
          écrite détaillée à {company.brand} :
        </p>
        <ul className="space-y-1">
          <li>
            <strong>E-mail :</strong>{" "}
            <a
              className="text-signal hover:underline"
              href={`mailto:${company.email}`}
            >
              {company.email}
            </a>
          </li>
          <li>
            <strong>Courrier :</strong> {company.legalName} — {company.brand},{" "}
            {company.address.full}
          </li>
          <li>
            <strong>Téléphone :</strong> {company.phone} (suivi possible, la
            réclamation écrite reste nécessaire)
          </li>
        </ul>
        <p>
          Merci d&apos;indiquer vos coordonnées, la référence du véhicule ou de
          la commande, et l&apos;objet du litige. Nous nous efforçons de répondre
          sous un délai raisonnable (en principe sous 30 jours).
        </p>
      </LegalSection>

      <LegalSection title="2. Médiation de la consommation">
        <p>
          Si la réclamation n&apos;aboutit pas ou reste sans réponse satisfaisante
          dans le délai imparti, vous pouvez saisir gratuitement un médiateur de
          la consommation.
        </p>
        <ul className="space-y-1">
          <li>
            <strong>Médiateur :</strong> {company.mediation.name}
          </li>
          <li>
            <strong>Précision :</strong> {company.mediation.note}
          </li>
          <li>
            <strong>Informations générales :</strong>{" "}
            <a
              className="text-signal hover:underline"
              href={company.mediation.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              economie.gouv.fr — médiation de la consommation
            </a>
          </li>
        </ul>
        <p>
          La médiation est un processus confidentiel et gratuit pour le
          consommateur. Elle ne peut être engagée si le litige a déjà été examiné
          par un médiateur ou un tribunal, ou si la demande est manifestement
          infondée ou abusive.
        </p>
        <p className="text-muted-foreground">
          Les coordonnées précises du médiateur auquel {company.brand} a adhéré
          seront mises à jour sur cette page dès finalisation de l&apos;adhésion,
          et communiquées sur simple demande à {company.email}.
        </p>
      </LegalSection>

      <LegalSection title="3. Plateforme européenne de règlement en ligne">
        <p>
          Conformément au règlement (UE) n° 524/2013, vous pouvez également
          utiliser la plateforme de règlement en ligne des litiges (RLL) :
        </p>
        <p>
          <a
            className="text-signal hover:underline"
            href="https://ec.europa.eu/consumers/odr"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://ec.europa.eu/consumers/odr
          </a>
        </p>
      </LegalSection>

      <LegalSection title="4. Juridiction">
        <p>
          À défaut de résolution amiable ou par médiation, le litige pourra être
          porté devant les tribunaux français compétents, sous réserve des règles
          protectrices applicables aux consommateurs (notamment possibilité de
          saisir la juridiction du lieu de résidence du consommateur).
        </p>
        <p>Droit applicable : droit français.</p>
      </LegalSection>

      <LegalSection title="5. Documents utiles">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a className="text-signal hover:underline" href="/cgv">
              Conditions générales de vente
            </a>
          </li>
          <li>
            <a className="text-signal hover:underline" href="/cgu">
              Conditions générales d&apos;utilisation
            </a>
          </li>
          <li>
            <a
              className="text-signal hover:underline"
              href="/politique-de-confidentialite"
            >
              Politique de confidentialité
            </a>
          </li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
