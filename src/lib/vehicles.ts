export type EquipmentCategory = {
  name: string;
  items: string[];
};

export type VehiclePreparation = {
  /** Inspection mécanique / freinage / sécurité réalisée avant mise en vente */
  inspected?: boolean;
  /** Contrôle technique à jour (ou en cours de renouvellement) */
  ctUpToDate?: boolean;
  /** Entretien à jour selon les infos connues du dossier */
  maintenanceUpToDate?: boolean;
  /** Véhicule préparé / nettoyé avant remise */
  preparedForDelivery?: boolean;
  /** Documents de vente prêts ou listés */
  documentsReady?: boolean;
};

export type VehicleImportOrigin = {
  /** Pays d’origine si import (ex. Belgique, Allemagne) */
  country: string;
  /** Note factuelle courte — ne pas inventer de détails réglementaires */
  note?: string;
};

export type Vehicle = {
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "Essence" | "Diesel" | "Hybride" | "Électrique";
  transmission: "Manuelle" | "Automatique";
  power: string;
  color: string;
  doors: number;
  seats: number;
  status: "Disponible" | "Réservé" | "Livraison sous 48h";
  highlight: string;
  /** Présentation courte (listes / cartes) */
  description: string;
  /**
   * Texte éditorial de la fiche — unique par véhicule.
   * Si absent, la page utilise `description`.
   */
  editorial?: string;
  /** Liste plate (rétrocompat) — préférer equipmentCategories quand renseigné */
  features: string[];
  /** Équipements groupés ; section catégorisée affichée seulement si présent */
  equipmentCategories?: EquipmentCategory[];
  /** Flags de préparation — n’afficher que les clés true */
  preparation?: VehiclePreparation;
  /** Origine / import — section masquée si absent */
  importOrigin?: VehicleImportOrigin;
  /**
   * Garantie saisie à l’ajout du véhicule — texte libre tel quel
   * (ex. « Garantie 2 ans », « Extension de garantie »).
   * Chip + section masqués si vide / absent. Ne jamais inventer de durée.
   */
  warrantyNote?: string;
  image: string;
  imageAlt: string;
  /** Galerie additionnelle (hors image principale) — absente = une seule photo */
  gallery?: { src: string; alt: string }[];
};

export const VEHICLE_DETAIL_BASE = "/vehicules" as const;

export function vehiclePath(slug: string): string {
  return `${VEHICLE_DETAIL_BASE}/${slug}`;
}

/** Mock stock — everyday used cars only (no luxury / sport prestige). */
export const vehicles: Vehicle[] = [
  {
    slug: "peugeot-3008-gt-2021",
    brand: "Peugeot",
    model: "3008 Allure PureTech 130",
    year: 2021,
    price: 22990,
    mileage: 58400,
    fuel: "Essence",
    transmission: "Automatique",
    power: "130 ch",
    color: "Gris Artense",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "SUV familial soigné, prêt à partir",
    description:
      "3008 Allure en bon état, entretien à jour. Idéal famille ou trajets quotidiens Sarthois, avec livrabilité rapide dans le Grand Ouest.",
    editorial:
      "Ce Peugeot 3008 Allure PureTech 130 (2021) cumule 58 400 km. Boîte automatique, motorisation essence 130 ch et finition Allure : un SUV familial clair pour un usage quotidien au Mans et alentours. L’entretien est à jour selon le dossier présenté. Contactez MAS OCAS AUTO pour confirmer la disponibilité, organiser un essai ou demander une livraison.",
    features: [
      "Écran tactile",
      "Caméra de recul",
      "Régulateur de vitesse",
      "Apple CarPlay / Android Auto",
      "Aide au stationnement",
    ],
    equipmentCategories: [
      {
        name: "Confort & multimédia",
        items: ["Écran tactile", "Apple CarPlay / Android Auto"],
      },
      {
        name: "Aide à la conduite",
        items: [
          "Caméra de recul",
          "Régulateur de vitesse",
          "Aide au stationnement",
        ],
      },
    ],
    preparation: {
      maintenanceUpToDate: true,
      inspected: true,
    },
    warrantyNote: "Garantie 2 ans",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "SUV familial gris stationné en extérieur",
  },
  {
    slug: "renault-clio-intens-2022",
    brand: "Renault",
    model: "Clio Intens TCe 90",
    year: 2022,
    price: 15490,
    mileage: 32100,
    fuel: "Essence",
    transmission: "Manuelle",
    power: "90 ch",
    color: "Blanc Glacier",
    doors: 5,
    seats: 5,
    status: "Livraison sous 48h",
    highlight: "Citadine économique, stock immédiat",
    description:
      "Clio récente, faible kilométrage, parfaite pour la ville du Mans. Contrôle technique OK, carrosserie propre, livrable sous 48 h selon disponibilité.",
    editorial:
      "Renault Clio Intens TCe 90 (2022), 32 100 km : citadine essence manuelle adaptée à la ville du Mans. Contrôle technique OK et carrosserie propre selon le dossier. Statut actuel : livraison sous 48 h selon disponibilité. MAS OCAS AUTO confirme le créneau de remise ou de livraison sur demande.",
    features: [
      "Écran tactile 9,3\"",
      "Radar de recul",
      "Régulateur de vitesse",
      "Climatisation automatique",
      "Jantes alliage 16\"",
    ],
    equipmentCategories: [
      {
        name: "Confort & multimédia",
        items: [
          "Écran tactile 9,3\"",
          "Climatisation automatique",
          "Jantes alliage 16\"",
        ],
      },
      {
        name: "Aide à la conduite",
        items: ["Radar de recul", "Régulateur de vitesse"],
      },
    ],
    preparation: {
      ctUpToDate: true,
      preparedForDelivery: true,
      inspected: true,
    },
    warrantyNote: "Extension de garantie",
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Citadine blanche vue de trois-quarts avant",
  },
  {
    slug: "volkswagen-golf-8-2020",
    brand: "Volkswagen",
    model: "Golf 8 Life 1.5 TSI",
    year: 2020,
    price: 19990,
    mileage: 71200,
    fuel: "Essence",
    transmission: "Manuelle",
    power: "130 ch",
    color: "Bleu Atlantique",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "Compacte polyvalente, usage quotidien",
    description:
      "Golf 8 Life : habitacle soigné, consommation maîtrisée, finition claire. Un choix solide pour rouler au quotidien sans superflu.",
    editorial:
      "Volkswagen Golf 8 Life 1.5 TSI (2020), 71 200 km. Compacte essence manuelle 130 ch, finition Life : polyvalente pour un usage quotidien. Habitacle soigné et finition claire selon la présentation du véhicule. Demandez un essai au garage du Mans ou une simulation de financement via le formulaire de contact.",
    features: [
      "Digital Cockpit",
      "Climatisation automatique",
      "LED",
      "Bluetooth / USB",
      "Aide au démarrage en côte",
    ],
    equipmentCategories: [
      {
        name: "Confort & multimédia",
        items: ["Digital Cockpit", "Climatisation automatique", "Bluetooth / USB"],
      },
      {
        name: "Éclairage & aides",
        items: ["LED", "Aide au démarrage en côte"],
      },
    ],
    preparation: {
      inspected: true,
    },
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Compacte sur une rue en ville",
  },
  {
    slug: "toyota-yaris-hybrid-2023",
    brand: "Toyota",
    model: "Yaris Hybrid Design",
    year: 2023,
    price: 18990,
    mileage: 18650,
    fuel: "Hybride",
    transmission: "Automatique",
    power: "116 ch",
    color: "Rouge Emblème",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "Quasi neuve, conso record",
    description:
      "Yaris Hybrid Design quasi neuve : fiabilité Toyota, idéale pour un premier véhicule ou un second foyer.",
    editorial:
      "Toyota Yaris Hybrid Design (2023), 18 650 km uniquement. Hybride automatique 116 ch, finition Design : profil quasi neuf pour un premier véhicule ou un second foyer. Contactez MAS OCAS AUTO pour confirmer la disponibilité, organiser un essai ou demander une livraison.",
    features: [
      "Toyota Safety Sense",
      "Caméra de recul",
      "Chargeur induction",
      "Sièges tissu/synthétique",
    ],
    equipmentCategories: [
      {
        name: "Sécurité",
        items: ["Toyota Safety Sense", "Caméra de recul"],
      },
      {
        name: "Confort & multimédia",
        items: ["Chargeur induction", "Sièges tissu/synthétique"],
      },
    ],
    preparation: {
      inspected: true,
      preparedForDelivery: true,
    },
    warrantyNote: "Garantie constructeur restante",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Citadine compacte en lumière du jour",
  },
  {
    slug: "dacia-sandero-essential-2022",
    brand: "Dacia",
    model: "Sandero Essential TCe 90",
    year: 2022,
    price: 12990,
    mileage: 41200,
    fuel: "Essence",
    transmission: "Manuelle",
    power: "90 ch",
    color: "Gris Plateau",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "Budget maîtrisé, entretien simple",
    description:
      "Sandero Essential : citadine spacieuse, coût d’usage bas, idéale premier achat ou véhicule de travail léger. Dossier clair et CT à jour.",
    editorial:
      "Dacia Sandero Essential TCe 90 (2022), 41 200 km. Citadine essence manuelle pensée pour un budget maîtrisé : premier achat ou usage professionnel léger. Dossier clair et contrôle technique à jour selon les infos du stock. MAS OCAS AUTO vous accompagne pour l’essai, le financement éventuel et la livraison.",
    features: [
      "Media Display",
      "Bluetooth",
      "Direction assistée",
      "Vitres électriques avant",
      "Roue de secours",
    ],
    equipmentCategories: [
      {
        name: "Confort & multimédia",
        items: ["Media Display", "Bluetooth", "Vitres électriques avant"],
      },
      {
        name: "Équipement de base",
        items: ["Direction assistée", "Roue de secours"],
      },
    ],
    preparation: {
      ctUpToDate: true,
      inspected: true,
      documentsReady: true,
    },
    warrantyNote: "Garantie 1 an",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Berline compacte grise stationnée",
  },
  {
    slug: "citroen-c5-aircross-2021",
    brand: "Citroën",
    model: "C5 Aircross Feel BlueHDi",
    year: 2021,
    price: 21990,
    mileage: 64300,
    fuel: "Diesel",
    transmission: "Automatique",
    power: "130 ch",
    color: "Blanc Banquise",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "Confort suspendu, volume généreux",
    description:
      "C5 Aircross Feel : suspensions confortables, coffre généreux, parfait pour week-ends et trajets famille.",
    editorial:
      "Citroën C5 Aircross Feel BlueHDi (2021), 64 300 km. SUV diesel automatique 130 ch, finition Feel : suspensions confortables et volume utile pour la famille ou les week-ends. Disponible au stock MAS OCAS AUTO au Mans — demandez un essai, une simulation de financement ou un devis de livraison.",
    features: [
      "Suspension Progressive Hydraulic",
      "Caméra de recul",
      "Grip Control",
      "Chargeur smartphone",
      "Banquette coulissante",
    ],
    equipmentCategories: [
      {
        name: "Confort",
        items: [
          "Suspension Progressive Hydraulic",
          "Banquette coulissante",
          "Chargeur smartphone",
        ],
      },
      {
        name: "Aide à la conduite",
        items: ["Caméra de recul", "Grip Control"],
      },
    ],
    preparation: {
      inspected: true,
    },
    warrantyNote: "Garantie 2 ans pièces et main-d'œuvre",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Véhicule familial blanc sur route",
  },
];

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function filterVehicles(opts: {
  q?: string | null;
  budget?: string | null;
  km?: string | null;
}): Vehicle[] {
  const q = (opts.q ?? "").trim().toLowerCase();
  const budget = opts.budget ? Number(opts.budget) : null;
  const km = opts.km ? Number(opts.km) : null;

  return vehicles.filter((v) => {
    if (q) {
      const hay = `${v.brand} ${v.model}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (budget != null && !Number.isNaN(budget) && v.price > budget) return false;
    if (km != null && !Number.isNaN(km) && v.mileage > km) return false;
    return true;
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(km)} km`;
}

export function vehicleDisplayName(vehicle: Vehicle): string {
  return `${vehicle.brand} ${vehicle.model}`;
}

export function vehicleEditorial(vehicle: Vehicle): string {
  return vehicle.editorial?.trim() || vehicle.description;
}

export function preparationFlags(
  preparation: VehiclePreparation | undefined
): { key: keyof VehiclePreparation; label: string }[] {
  if (!preparation) return [];
  const labels: { key: keyof VehiclePreparation; label: string }[] = [
    { key: "inspected", label: "Inspection réalisée avant mise en vente" },
    { key: "ctUpToDate", label: "Contrôle technique à jour" },
    { key: "maintenanceUpToDate", label: "Entretien à jour" },
    { key: "preparedForDelivery", label: "Préparé pour la livraison" },
    { key: "documentsReady", label: "Documents de vente prêts" },
  ];
  return labels.filter((item) => preparation[item.key] === true);
}

/** 3–4 véhicules similaires (même énergie ou marque, sinon prix proche). */
export function getSimilarVehicles(vehicle: Vehicle, limit = 4): Vehicle[] {
  const others = vehicles.filter((v) => v.slug !== vehicle.slug);
  const scored = others.map((v) => {
    let score = 0;
    if (v.fuel === vehicle.fuel) score += 3;
    if (v.brand === vehicle.brand) score += 4;
    if (v.transmission === vehicle.transmission) score += 1;
    const priceDelta = Math.abs(v.price - vehicle.price);
    if (priceDelta <= 3000) score += 2;
    else if (priceDelta <= 6000) score += 1;
    return { v, score };
  });
  scored.sort((a, b) => b.score - a.score || a.v.price - b.v.price);
  return scored.slice(0, limit).map((s) => s.v);
}

export function vehicleSeoTitle(vehicle: Vehicle): string {
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year} — ${formatPrice(vehicle.price)}`;
}

export function vehicleSeoDescription(vehicle: Vehicle): string {
  return `${vehicle.brand} ${vehicle.model} (${vehicle.year}) · ${formatMileage(vehicle.mileage)} · ${vehicle.fuel} · ${vehicle.transmission} · ${formatPrice(vehicle.price)}. ${vehicle.highlight} Stock MAS OCAS AUTO au Mans.`;
}
