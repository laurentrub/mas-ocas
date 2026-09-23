import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politique cookies",
  description: `Informations sur les cookies utilisés par le site ${company.brand}.`,
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politique cookies"
      intro={
        <p>
          Cette page explique ce que sont les cookies, lesquels sont utilisés
          sur {company.domain}, et comment les gérer.
        </p>
      }
    >
      <LegalSection title="Qu’est-ce qu’un cookie ?">
        <p>
          Un cookie est un petit fichier déposé sur votre terminal (ordinateur,
          smartphone, tablette) lors de la consultation d&apos;un site. Il
          permet de mémoriser des informations relatives à votre navigation ou
          à votre session.
        </p>
      </LegalSection>

      <LegalSection title="Cookies utilisés sur ce site">
        <p>
          <strong>Cookies strictement nécessaires</strong> — indispensables au
          fonctionnement du site et de l&apos;espace d&apos;administration
          (authentification, sécurité de session). Ils ne requièrent pas votre
          consentement.
        </p>
        <p>
          <strong>Cookies de préférences / mesure d&apos;audience</strong> — le
          cas échéant, uniquement après votre consentement, pour comprendre
          l&apos;usage du site de manière agrégée ou mémoriser un choix
          d&apos;affichage.
        </p>
        <p>
          À ce jour, le site public s&apos;appuie principalement sur des cookies
          techniques liés à la session et à la sécurité. Aucun réseau
          publicitaire tiers n&apos;est intégré de façon systématique.
        </p>
      </LegalSection>

      <LegalSection title="Durée">
        <p>
          Les cookies de session expirent à la fermeture du navigateur. Les
          cookies d&apos;authentification de l&apos;espace admin ont une durée
          limitée, conforme aux besoins de sécurité.
        </p>
      </LegalSection>

      <LegalSection title="Gérer les cookies">
        <p>
          Vous pouvez configurer votre navigateur pour refuser ou supprimer les
          cookies. Le refus des cookies strictement nécessaires peut empêcher
          l&apos;accès à certaines fonctionnalités (notamment la connexion
          administrateur).
        </p>
        <p>
          Pour plus d&apos;informations :{" "}
          <a
            className="text-signal hover:underline"
            href="https://www.cnil.fr/fr/cookies-et-autres-traceurs"
            rel="noopener noreferrer"
            target="_blank"
          >
            CNIL — cookies et traceurs
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Toute question relative aux cookies :{" "}
          <a
            className="text-signal hover:underline"
            href={`mailto:${company.email}`}
          >
            {company.email}
          </a>
          . Voir aussi la{" "}
          <a
            className="text-signal hover:underline"
            href="/politique-de-confidentialite"
          >
            politique de confidentialité
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
