export type GuideSection = {
  heading: string;
  paragraphs: string[];
};

export type GuideArticle = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  summary: string;
  icon: GuideIconId;
  sections: GuideSection[];
  relatedSlugs: string[];
  homepageFeatured?: boolean;
};

export type GuideIconId =
  | "acheter"
  | "importer"
  | "exporter"
  | "europe"
  | "demarches"
  | "documents"
  | "homologation"
  | "immatriculation"
  | "livraison"
  | "financer";

export const guideArticles: GuideArticle[] = [
  {
    slug: "acheter-voiture-occasion",
    title: "Acheter une voiture d'occasion",
    metaDescription:
      "Comment acheter une voiture d'occasion en confiance avec MAS OCAS AUTO au Mans : choix, contrôle, dossier et remise des clés.",
    h1: "Acheter une voiture d'occasion",
    intro:
      "Chez MAS OCAS AUTO, acheter une voiture d'occasion commence par un besoin clair et un stock multi-marques sélectionné au Mans. Mathieu SINGER vous accompagne du premier contact jusqu'à la remise des clés.",
    summary:
      "Choisir, contrôler et finaliser l'achat de votre véhicule d'occasion en toute clarté.",
    icon: "acheter",
    homepageFeatured: true,
    relatedSlugs: [
      "financer-vehicule",
      "documents-necessaires",
      "livraison-vehicule",
      "immatriculation",
    ],
    sections: [
      {
        heading: "Définir votre besoin avant de parcourir le stock",
        paragraphs: [
          "Budget, usage quotidien, motorisation, boîte et délai de disponibilité : ces critères évitent les essais inutiles. Indiquez-les dès le premier contact pour que MAS OCAS AUTO cible les véhicules pertinents.",
          "Le stock multi-marques du garage au Mans regroupe des véhicules du quotidien (citadines, compactes, breaks, SUV accessibles). Chaque annonce précise année, kilométrage, énergie et prix affiché.",
        ],
      },
      {
        heading: "Contrôle, historique et essai",
        paragraphs: [
          "Avant mise en vente, le véhicule est inspecté (mécanique, freinage, carrosserie, dossier). Vous recevez une présentation claire de l'état et des points à connaître.",
          "Un essai peut être organisé sur rendez-vous. C'est le moment de poser vos questions sur l'entretien passé, les éventuels frais à prévoir et les garanties applicables.",
        ],
      },
      {
        heading: "Finaliser l'achat et récupérer votre véhicule",
        paragraphs: [
          "Une fois le choix validé, le dossier d'achat est monté avec vous : identité, justificatifs, financement éventuel et modalités de paiement.",
          "La remise des clés se fait au garage (15 Rue du Spoutnik, Le Mans) ou via une livraison organisée. Les documents utiles à l'immatriculation vous sont remis ou listés selon votre situation.",
        ],
      },
    ],
  },
  {
    slug: "importer-voiture",
    title: "Importer une voiture",
    metaDescription:
      "Importer une voiture en France avec MAS OCAS AUTO : faisabilité, coûts, délais et accompagnement depuis Le Mans.",
    h1: "Importer une voiture",
    intro:
      "Vous avez repéré un véhicule hors de France ? MAS OCAS AUTO étudie la faisabilité de l'importation : conformité, coûts réalistes et délais, avec un interlocuteur local au Mans.",
    summary:
      "Étudier et sécuriser un projet d'importation de véhicule vers la France.",
    icon: "importer",
    homepageFeatured: true,
    relatedSlugs: [
      "demarches-importation",
      "homologation-conformite",
      "documents-necessaires",
      "acheter-voiture-europe",
    ],
    sections: [
      {
        heading: "Quand l'importation a du sens",
        paragraphs: [
          "Un modèle rare en France, un meilleur prix constaté à l'étranger ou un véhicule déjà identifié : l'importation peut être pertinente — à condition d'anticiper conformité et frais annexes.",
          "MAS OCAS AUTO vous aide à distinguer une bonne opportunité d'un projet trop risqué ou trop coûteux une fois les démarches prises en compte.",
        ],
      },
      {
        heading: "Ce que nous vérifions en amont",
        paragraphs: [
          "Origine du véhicule, documents du vendeur, cohérence du kilométrage, historique et état général : ces points conditionnent la suite.",
          "Nous estimons aussi les postes de coût : transport, contrôles, éventuelle mise en conformité, immatriculation et livraison jusqu'à vous.",
        ],
      },
      {
        heading: "Un accompagnement jusqu'à la mise à la route",
        paragraphs: [
          "De l'étude de faisabilité à la réception en France, Mathieu SINGER reste votre contact pour le suivi et les prochaines étapes administratives.",
          "Pour le détail des formalités, consultez aussi nos pages sur les démarches d'importation, l'homologation et les documents nécessaires.",
        ],
      },
    ],
  },
  {
    slug: "exporter-voiture",
    title: "Exporter une voiture",
    metaDescription:
      "Exporter une voiture depuis la France avec MAS OCAS AUTO : vente à l'export, documents et organisation depuis Le Mans.",
    h1: "Exporter une voiture",
    intro:
      "MAS OCAS AUTO accompagne aussi les projets d'exportation de véhicules d'occasion. Que vous soyez un particulier ou un professionnel, nous clarifions documents, délais et modalités depuis Le Mans.",
    summary:
      "Vendre ou acheminer un véhicule à l'étranger avec un accompagnement clair.",
    icon: "exporter",
    homepageFeatured: true,
    relatedSlugs: [
      "importer-voiture",
      "documents-necessaires",
      "livraison-vehicule",
      "acheter-voiture-europe",
    ],
    sections: [
      {
        heading: "Exportation : pour qui et pourquoi",
        paragraphs: [
          "Demande depuis l'étranger, revente hors France ou transfert vers un autre pays européen : l'export demande une préparation documentaire spécifique.",
          "MAS OCAS AUTO, dont l'activité couvre vente, import et export, vous indique ce qui est réaliste selon la destination et le statut de l'acheteur.",
        ],
      },
      {
        heading: "Documents et points de vigilance",
        paragraphs: [
          "Certificat de cession, certificat de situation administrative, facture, et selon les cas documents de sortie du territoire : la liste dépend du pays cible.",
          "Nous listons les pièces à réunir avant engagement pour éviter un blocage au départ ou à l'arrivée.",
        ],
      },
      {
        heading: "Organisation et livraison vers l'étranger",
        paragraphs: [
          "Transport, rendez-vous de remise et suivi : nous coordonnons les étapes avec vous et communiquons les tarifs sur devis avant validation.",
          "Contactez MAS OCAS AUTO au Mans pour un projet d'export : un interlocuteur unique jusqu'à la confirmation du dossier.",
        ],
      },
    ],
  },
  {
    slug: "acheter-voiture-europe",
    title: "Acheter une voiture en Europe",
    metaDescription:
      "Acheter une voiture en Europe avec MAS OCAS AUTO : libre circulation, contrôles et accompagnement pour un achat serein.",
    h1: "Acheter une voiture en Europe",
    intro:
      "Acheter une voiture en Europe élargit le choix, mais impose de vérifier conformité, historique et coûts de mise en circulation en France. MAS OCAS AUTO vous guide depuis Le Mans.",
    summary:
      "Repères pour un achat européen réussi, sans mauvaise surprise à l'arrivée.",
    icon: "europe",
    relatedSlugs: [
      "importer-voiture",
      "demarches-importation",
      "homologation-conformite",
      "financer-vehicule",
    ],
    sections: [
      {
        heading: "Libre circulation et réalités du terrain",
        paragraphs: [
          "Au sein de l'Union européenne, l'achat d'un véhicule d'occasion est courant — mais chaque pays a ses habitudes de vente et ses documents.",
          "Prix attractif ne suffit pas : transport, TVA éventuelle selon le statut, contrôles et immatriculation française doivent entrer dans le calcul.",
        ],
      },
      {
        heading: "Sélectionner un véhicule fiable à distance",
        paragraphs: [
          "Photos, historique, cohérence des annonces et possibilité de contrôle avant achat : MAS OCAS AUTO vous aide à poser les bonnes questions au vendeur ou à l'intermédiaire.",
          "Lorsque c'est pertinent, nous pouvons intégrer le véhicule dans un parcours d'importation déjà cadré.",
        ],
      },
      {
        heading: "De l'achat européen à la route française",
        paragraphs: [
          "Une fois le véhicule acquis, restent les étapes de conformité, de documents et d'immatriculation en France.",
          "Nos guides sur les démarches d'importation et l'homologation détaillent ces étapes ; le contact garage reste Mathieu SINGER au Mans.",
        ],
      },
    ],
  },
  {
    slug: "demarches-importation",
    title: "Les démarches d'importation",
    metaDescription:
      "Démarches d'importation d'un véhicule en France : étapes, interlocuteurs et accompagnement MAS OCAS AUTO au Mans.",
    h1: "Les démarches d'importation",
    intro:
      "Importer un véhicule implique une suite d'étapes administratives. MAS OCAS AUTO les ordonne avec vous pour éviter les allers-retours et les délais inutiles.",
    summary:
      "Comprendre le parcours administratif d'une importation de véhicule.",
    icon: "demarches",
    relatedSlugs: [
      "importer-voiture",
      "documents-necessaires",
      "homologation-conformite",
      "immatriculation",
    ],
    sections: [
      {
        heading: "Vue d'ensemble du parcours",
        paragraphs: [
          "Identification du véhicule, documents d'origine, contrôles techniques ou de conformité selon le cas, puis demande d'immatriculation en France : chaque étape conditionne la suivante.",
          "Nous établissons un ordre de priorité adapté à votre dossier (UE ou hors UE, particulier ou professionnel).",
        ],
      },
      {
        heading: "Qui fait quoi",
        paragraphs: [
          "Certaines formalités restent à votre charge (identité, justificatif de domicile, paiement des taxes le cas échéant). D'autres peuvent être préparées ou expliquées avec l'aide du garage.",
          "MAS OCAS AUTO clarifie dès le départ ce qui est déjà prêt côté véhicule et ce que vous devez fournir.",
        ],
      },
      {
        heading: "Délais et suivi",
        paragraphs: [
          "Les délais varient selon la complétude du dossier et les organismes concernés. Un dossier complet dès le départ réduit fortement les risques de rejet.",
          "Pour un projet concret, contactez-nous : nous cadrons le calendrier réaliste avant engagement.",
        ],
      },
    ],
  },
  {
    slug: "documents-necessaires",
    title: "Documents nécessaires",
    metaDescription:
      "Documents nécessaires pour acheter, importer ou immatriculer un véhicule avec MAS OCAS AUTO au Mans.",
    h1: "Documents nécessaires",
    intro:
      "Carte grise, certificat de cession, contrôle technique, pièces d'identité… MAS OCAS AUTO liste ce qui est requis selon votre situation pour éviter les dossiers incomplets.",
    summary:
      "La liste des pièces utiles à l'achat, à l'import et à l'immatriculation.",
    icon: "documents",
    homepageFeatured: true,
    relatedSlugs: [
      "immatriculation",
      "demarches-importation",
      "acheter-voiture-occasion",
      "homologation-conformite",
    ],
    sections: [
      {
        heading: "Pour un achat en France",
        paragraphs: [
          "En général : pièce d'identité, justificatif de domicile, et selon les cas permis de conduire. Côté véhicule : certificat de cession, certificat de situation administrative et contrôle technique en cours de validité si requis.",
          "MAS OCAS AUTO vous indique avant signature ce qui est déjà en place sur le véhicule du stock.",
        ],
      },
      {
        heading: "Pour une importation",
        paragraphs: [
          "Documents du pays d'origine, facture ou acte de vente, preuve de propriété et pièces liées à la conformité peuvent s'ajouter.",
          "La liste exacte dépend de l'origine du véhicule. Nous la construisons avec vous dès l'étude de faisabilité.",
        ],
      },
      {
        heading: "Anticiper pour gagner du temps",
        paragraphs: [
          "Scanner ou photographier vos justificatifs avant le rendez-vous accélère le montage du dossier.",
          "Une question sur une pièce manquante ? Écrivez ou passez au garage du Mans : Mathieu SINGER vous répond.",
        ],
      },
    ],
  },
  {
    slug: "homologation-conformite",
    title: "Homologation / conformité",
    metaDescription:
      "Homologation et conformité d'un véhicule importé : points clés et accompagnement MAS OCAS AUTO.",
    h1: "Homologation et conformité",
    intro:
      "Un véhicule acquis hors de France doit être conforme pour circuler et être immatriculé. MAS OCAS AUTO vous explique les enjeux de conformité sans jargon inutile.",
    summary:
      "Vérifier que le véhicule peut être mis en circulation en France.",
    icon: "homologation",
    relatedSlugs: [
      "importer-voiture",
      "demarches-importation",
      "documents-necessaires",
      "immatriculation",
    ],
    sections: [
      {
        heading: "Pourquoi la conformité compte",
        paragraphs: [
          "Éclairage, émissions, identification du véhicule et équipements obligatoires : des écarts peuvent bloquer l'immatriculation ou imposer des travaux.",
          "Anticiper ces points évite d'acheter un véhicule difficile à régulariser.",
        ],
      },
      {
        heading: "Contrôles et attestations",
        paragraphs: [
          "Selon l'origine et l'âge du véhicule, un contrôle technique, une attestation de conformité ou une procédure d'homologation individuelle peut être nécessaire.",
          "MAS OCAS AUTO vous oriente vers le parcours adapté et les documents à prévoir avant de vous engager.",
        ],
      },
      {
        heading: "Lien avec l'immatriculation",
        paragraphs: [
          "Sans dossier de conformité complet, la demande de carte grise française risque le rejet. Homologation et immatriculation vont de pair.",
          "Consultez aussi notre page immatriculation et contactez le garage pour un cas précis.",
        ],
      },
    ],
  },
  {
    slug: "immatriculation",
    title: "Immatriculation",
    metaDescription:
      "Immatriculer un véhicule d'occasion ou importé : étapes, documents et aide MAS OCAS AUTO au Mans.",
    h1: "Immatriculation d'un véhicule",
    intro:
      "Changement de titulaire ou première immatriculation en France après import : MAS OCAS AUTO clarifie les étapes et les pièces pour obtenir votre carte grise.",
    summary:
      "Les étapes pour obtenir ou mettre à jour votre carte grise.",
    icon: "immatriculation",
    relatedSlugs: [
      "documents-necessaires",
      "acheter-voiture-occasion",
      "demarches-importation",
      "homologation-conformite",
    ],
    sections: [
      {
        heading: "Immatriculation après achat en France",
        paragraphs: [
          "Après la vente, le nouveau titulaire dispose d'un délai pour faire établir la carte grise à son nom. Le certificat de cession et les justificatifs d'identité sont centraux.",
          "Nous vous remettons les documents vendeur / garage nécessaires et listons ce qui reste à votre charge.",
        ],
      },
      {
        heading: "Immatriculation d'un véhicule importé",
        paragraphs: [
          "Le dossier est plus complet : preuves d'origine, conformité et éventuelles taxes ou quitus selon le cas.",
          "MAS OCAS AUTO vous aide à ordonner ces pièces pour limiter les allers-retours administratifs.",
        ],
      },
      {
        heading: "Délais et suivi pratique",
        paragraphs: [
          "Les délais dépendent de la plateforme utilisée et de la complétude du dossier. Un dossier incomplet est la cause la plus fréquente de retard.",
          "Pour un accompagnement personnalisé, contactez Mathieu SINGER à Le Mans.",
        ],
      },
    ],
  },
  {
    slug: "livraison-vehicule",
    title: "Livraison d'un véhicule",
    metaDescription:
      "Livraison d'un véhicule d'occasion avec MAS OCAS AUTO : remise au Mans ou livraison à domicile, devis clair.",
    h1: "Livraison d'un véhicule",
    intro:
      "Remise au garage du Mans ou livraison jusqu'à chez vous : MAS OCAS AUTO organise l'acheminement de votre véhicule avec un devis avant validation.",
    summary:
      "Modalités, zones et organisation de la livraison de votre véhicule.",
    icon: "livraison",
    homepageFeatured: true,
    relatedSlugs: [
      "acheter-voiture-occasion",
      "exporter-voiture",
      "financer-vehicule",
      "documents-necessaires",
    ],
    sections: [
      {
        heading: "Remise au garage ou livraison à domicile",
        paragraphs: [
          "Vous pouvez récupérer votre véhicule au 15 Rue du Spoutnik, 72000 Le Mans, après contrôle final et remise des documents.",
          "La livraison à domicile ou sur site est proposée selon votre secteur, sur rendez-vous.",
        ],
      },
      {
        heading: "Avant le départ",
        paragraphs: [
          "Contrôle final, propreté, documents remis et créneau confirmé : rien n'est improvisé le jour J.",
          "Les tarifs de livraison sont communiqués sur devis — pas de surprise à la livraison.",
        ],
      },
      {
        heading: "Zones et projets particuliers",
        paragraphs: [
          "Pour une livraison longue distance ou un export, nous étudions le transport adapté à votre destination.",
          "Demandez un devis via la page contact en précisant le sujet « Livraison ».",
        ],
      },
    ],
  },
  {
    slug: "financer-vehicule",
    title: "Financer son véhicule",
    metaDescription:
      "Financer son véhicule d'occasion avec MAS OCAS AUTO : crédit, simulation et transparence des coûts au Mans.",
    h1: "Financer son véhicule",
    intro:
      "Prix du véhicule, frais éventuels et mensualités : MAS OCAS AUTO clarifie le coût total avant engagement et peut orienter vers une simulation de financement.",
    summary:
      "Comprendre le coût total et les options de financement avant de signer.",
    icon: "financer",
    homepageFeatured: true,
    relatedSlugs: [
      "acheter-voiture-occasion",
      "livraison-vehicule",
      "documents-necessaires",
      "acheter-voiture-europe",
    ],
    sections: [
      {
        heading: "Lire le prix affiché sans zone d'ombre",
        paragraphs: [
          "Le prix du véhicule est le point de départ. Les frais éventuels (livraison, certaines démarches) sont précisés avant engagement.",
          "Vous validez uniquement lorsque le coût total est clair pour vous.",
        ],
      },
      {
        heading: "Crédit et simulation",
        paragraphs: [
          "Financement et crédit : une simulation indicative peut être étudiée avec nos partenaires, expliquée sans jargon.",
          "Apport, durée et mensualité souhaitée : ces éléments permettent d'ajuster la proposition à votre budget.",
        ],
      },
      {
        heading: "Passer à l'étape suivante",
        paragraphs: [
          "Parcourez le stock ou contactez MAS OCAS AUTO avec le sujet « Financement » pour une étude personnalisée.",
          "Mathieu SINGER vous répond depuis le garage du Mans.",
        ],
      },
    ],
  },
];

export const guideTopics = guideArticles;

export const homepageGuideTopics = guideArticles.filter(
  (article) => article.homepageFeatured,
);

export function getGuideArticle(slug: string): GuideArticle | undefined {
  return guideArticles.find((article) => article.slug === slug);
}

export function getRelatedArticles(article: GuideArticle): GuideArticle[] {
  return article.relatedSlugs
    .map((slug) => getGuideArticle(slug))
    .filter((related): related is GuideArticle => Boolean(related));
}
