import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: `Conditions générales de vente des véhicules d'occasion — ${company.brand}.`,
};

export default function CgvPage() {
  return (
    <LegalPage
      eyebrow="Conditions contractuelles"
      title="Conditions générales de vente"
      intro={
        <p>
          Les présentes conditions générales de vente (CGV) régissent les ventes
          de véhicules d&apos;occasion conclues entre {company.brand} (
          {company.legalName}, {company.legalForm}, {company.rcs.label}) et
          tout acheteur consommateur ou professionnel. Elles complètent le bon
          de commande ou le contrat de vente signé.
        </p>
      }
    >
      <LegalSection title="1. Objet et champ d’application">
        <p>
          {company.brand} propose à la vente des véhicules d&apos;occasion,
          éventuellement accompagnés d&apos;accessoires ou prestations
          associées (préparation, livraison). Toute commande implique
          l&apos;acceptation sans réserve des présentes CGV, sauf conditions
          particulières écrites.
        </p>
      </LegalSection>

      <LegalSection title="2. Offres et disponibilité">
        <p>
          Les annonces publiées sur le site sont susceptibles d&apos;évoluer
          (prix, disponibilité, équipements). Elles ne constituent une offre
          ferme qu&apos;après confirmation écrite de {company.brand} et
          signature d&apos;un bon de commande / contrat de vente.
        </p>
        <p>
          Les photographies et descriptifs sont fournis de bonne foi ; des
          différences mineures peuvent exister. L&apos;acheteur est invité à
          examiner le véhicule avant l&apos;achat définitif.
        </p>
      </LegalSection>

      <LegalSection title="3. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises sauf mention
          contraire. Ils peuvent être révisés jusqu&apos;à la conclusion du
          contrat. Les frais éventuels (carte grise, livraison, garantie
          complémentaire, financement) sont précisés séparément.
        </p>
      </LegalSection>

      <LegalSection title="4. Commande et conclusion du contrat">
        <p>
          Une demande via le site (visite, livraison, financement) n&apos;est
          pas une commande. Le contrat est formé lors de la signature du bon de
          commande ou du contrat de vente, après accord sur le véhicule, le
          prix et les modalités de paiement et de livraison / retrait.
        </p>
        <p>
          Un acompte peut être demandé pour réserver le véhicule ; ses
          conditions (montant, remboursement en cas d&apos;annulation) figurent
          sur le bon de commande.
        </p>
      </LegalSection>

      <LegalSection title="5. Paiement">
        <p>
          Le paiement s&apos;effectue selon les modalités convenues (virement,
          autres moyens acceptés par écrit). Le transfert de propriété
          intervient après encaissement intégral du prix, sauf clause
          contraire. En cas de financement par un organisme tiers, la vente
          peut être conditionnée à l&apos;obtention du crédit.
        </p>
      </LegalSection>

      <LegalSection title="6. Livraison et retrait">
        <p>
          Le véhicule peut être retiré à l&apos;adresse{" "}
          {company.address.full}, ou livré selon devis et créneau convenus. Les
          délais indiqués sont indicatifs. Les risques sont transférés à
          l&apos;acheteur à la remise des clés, sauf disposition légale
          impérative contraire.
        </p>
      </LegalSection>

      <LegalSection title="7. Garanties">
        <p>
          Les véhicules d&apos;occasion sont vendus avec les garanties légales
          applicables, notamment :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            garantie de conformité (consommateurs) — articles L.217-3 et
            suivants du Code de la consommation
          </li>
          <li>
            garantie des vices cachés — articles 1641 et suivants du Code civil
          </li>
        </ul>
        <p>
          Toute garantie commerciale éventuelle (extension, assurance panne) est
          décrite dans les documents remis à la vente. L&apos;acheteur
          professionnel peut se voir appliquer des conditions spécifiques
          écrites.
        </p>
      </LegalSection>

      <LegalSection title="8. Droit de rétractation">
        <p>
          Conformément à l&apos;article L.221-28 du Code de la consommation, le
          droit de rétractation ne s&apos;applique pas aux contrats de
          fourniture de véhicules automobiles conclus hors établissement lorsque
          la vente a été précédée d&apos;une visite et d&apos;un essai, ou dans
          les cas d&apos;exclusion prévus par la loi. Lorsque la vente est
          conclue à distance dans les conditions ouvrant droit à rétractation,
          le délai et les modalités seront indiqués sur le contrat.
        </p>
        <p>
          Les contrats de crédit à la consommation bénéficient, le cas échéant,
          du délai de rétractation légal propre au financement.
        </p>
      </LegalSection>

      <LegalSection title="9. Responsabilité">
        <p>
          {company.brand} ne saurait être tenu responsable des dommages
          indirects, ni des indisponibilités du site. La responsabilité liée au
          véhicule vendu est encadrée par le contrat de vente et la loi.
        </p>
      </LegalSection>

      <LegalSection title="10. Médiation et litiges">
        <p>
          En cas de litige, voir la page{" "}
          <a className="text-signal hover:underline" href="/mediation">
            Médiation et litiges
          </a>
          . Droit applicable : droit français.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          {company.brand} — {company.address.full} —{" "}
          <a
            className="text-signal hover:underline"
            href={`mailto:${company.email}`}
          >
            {company.email}
          </a>{" "}
          — {company.phone}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
