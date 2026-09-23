export const company = {
  brand: "MAS OCAS AUTO",
  domain: "mas-ocas-auto.com",
  /** Identité civile telle qu’au RCS (ordre prénom / nom pour affichage). */
  legalName: "Mathieu Alain SINGER",
  legalForm: "Entrepreneur individuel",
  /** Libellé d’activité — extrait Kbis du 01/09/2026. */
  activity:
    "L'achat, la vente, l'importation et l'exportation de véhicules d'occasion, machines et divers accessoires non réglementés",
  address: {
    street: "15 Rue du Spoutnik",
    postalCode: "72000",
    city: "Le Mans",
    full: "15 Rue du Spoutnik, 72000 Le Mans",
  },
  rcs: {
    number: "109 272 831",
    city: "Le Mans",
    label: "109 272 831 R.C.S. Le Mans",
  },
  /** Pour un EI, le SIREN = n° RCS (sans espaces). */
  siren: "109 272 831",
  /**
   * SIRET (14 chiffres) — absent de cet extrait Kbis.
   * À récupérer sur l’avis de situation SIRENE (insee.fr).
   */
  siret: "",
  /**
   * Code APE / NAF — absent de cet extrait Kbis.
   * À récupérer sur l’avis de situation SIRENE.
   */
  ape: {
    code: "",
    label: "",
  },
  /**
   * N° TVA intracommunautaire (si assujetti).
   * Laisser vide si franchise en base de TVA.
   */
  vatNumber: "",
  /**
   * ORIAS — uniquement si intermédiaire en opérations de banque / crédit.
   * Par défaut : non inscrit ; les financements passent par des partenaires.
   */
  orias: {
    registered: false,
    number: "",
    note: "Les simulations de financement affichées sur le site sont indicatives et réalisées dans le cadre d’une mise en relation avec des partenaires. MAS OCAS AUTO n’est pas inscrit à l’ORIAS en qualité d’intermédiaire en opérations de banque et en services de paiement.",
  },
  managementNumber: "2026A01085",
  registrationDate: "01/09/2026",
  activityStartDate: "28/08/2026",
  fundOrigin: "Création",
  exploitationMode: "Exploitation personnelle",
  /** Placeholder — à remplacer par la ligne du garage. */
  phone: "À compléter",
  email: "contact@mas-ocas-auto.com",
  hours: "Du mardi au samedi · 9h30 – 12h30 / 14h – 18h30",
  tagline: "Garage multi-marques · vente & livraison",
  hosting: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },
  /** À mettre à jour dès adhésion à un médiateur de la consommation. */
  mediation: {
    name: "Coordonnées communiquées sur demande",
    website: "https://www.economie.gouv.fr/mediation-conso",
    note: "En cours de désignation — réclamation écrite préalable obligatoire.",
  },
} as const;

/** `tel:` href when `company.phone` looks like a real FR number; otherwise null. */
export function companyTelHref(): string | null {
  const digits = company.phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `tel:${digits}`;
}
