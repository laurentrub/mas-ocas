import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: `Conditions générales d'utilisation du site ${company.brand}.`,
};

export default function CguPage() {
  return (
    <LegalPage
      eyebrow="Conditions contractuelles"
      title="Conditions générales d’utilisation"
      intro={
        <p>
          Les présentes conditions générales d&apos;utilisation (CGU) encadrent
          l&apos;accès et l&apos;usage du site {company.domain}, édité par{" "}
          {company.brand} ({company.legalName}). En naviguant sur le site, vous
          acceptez ces CGU.
        </p>
      }
    >
      <LegalSection title="1. Objet du site">
        <p>
          Le site présente le stock de véhicules d&apos;occasion de{" "}
          {company.brand}, des informations sur le financement et la livraison,
          ainsi que des formulaires de contact et de demande (visite, livraison,
          simulation de financement).
        </p>
      </LegalSection>

      <LegalSection title="2. Accès au site">
        <p>
          L&apos;accès est libre pour les pages publiques. L&apos;espace
          d&apos;administration est réservé aux personnes autorisées.{" "}
          {company.brand} s&apos;efforce d&apos;assurer une disponibilité
          continue, sans garantie d&apos;absence d&apos;interruption ou
          d&apos;erreur.
        </p>
      </LegalSection>

      <LegalSection title="3. Contenu et exactitude">
        <p>
          Les informations (prix, kilométrage, équipements, disponibilité) sont
          mises à jour de bonne foi mais peuvent contenir des erreurs ou être
          obsolètes. Elles ne valent pas offre contractuelle tant qu&apos;un
          contrat de vente n&apos;est pas signé. En cas de doute, contactez-nous
          avant tout déplacement.
        </p>
      </LegalSection>

      <LegalSection title="4. Comportement de l’utilisateur">
        <p>Vous vous engagez à :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            fournir des informations exactes dans les formulaires ;
          </li>
          <li>
            ne pas porter atteinte au site (intrusion, surcharge, extraction
            massive non autorisée) ;
          </li>
          <li>
            ne pas utiliser le site à des fins illicites ou contraires à
            l&apos;ordre public.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Propriété intellectuelle">
        <p>
          Les contenus du site restent la propriété de {company.brand} ou de
          leurs ayants droit. Toute reproduction non autorisée est interdite.
          Voir également les{" "}
          <a className="text-signal hover:underline" href="/mentions-legales">
            mentions légales
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Liens hypertextes">
        <p>
          Le site peut contenir des liens vers des sites tiers.{" "}
          {company.brand} n&apos;exerce aucun contrôle sur ces sites et décline
          toute responsabilité quant à leur contenu ou leurs pratiques.
        </p>
      </LegalSection>

      <LegalSection title="7. Données personnelles">
        <p>
          Le traitement des données est décrit dans la{" "}
          <a
            className="text-signal hover:underline"
            href="/politique-de-confidentialite"
          >
            politique de confidentialité
          </a>{" "}
          et la{" "}
          <a className="text-signal hover:underline" href="/cookies">
            politique cookies
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Responsabilité">
        <p>
          Dans les limites autorisées par la loi, {company.brand} ne répond pas
          des dommages indirects résultant de l&apos;usage du site, ni des
          décisions prises sur la seule base des informations publiées en ligne.
        </p>
      </LegalSection>

      <LegalSection title="9. Modification des CGU">
        <p>
          {company.brand} peut modifier les présentes CGU à tout moment. La
          version applicable est celle publiée sur cette page à la date de votre
          navigation.
        </p>
      </LegalSection>

      <LegalSection title="10. Droit applicable">
        <p>
          Les présentes CGU sont soumises au droit français. Pour les litiges,
          voir{" "}
          <a className="text-signal hover:underline" href="/mediation">
            Médiation et litiges
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
