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

/**
 * Stock issu des publications Facebook publiques
 * (profile id=61586367090088 — page « Bms trucksroutier »).
 * Champs absents de l’annonce laissés vides / omis — jamais inventés.
 * Feed tronqué hors connexion : 1 véhicule importé.
 */
export const vehicles: Vehicle[] = [
  {
    slug: "peugeot-5008-gt-2022",
    brand: "Peugeot",
    model: "5008 1.5 BlueHDi 130ch S&S GT EAT8",
    year: 2022,
    price: 8800,
    mileage: 140000,
    fuel: "Diesel",
    transmission: "Automatique",
    power: "130 ch",
    color: "Noir",
    doors: 5,
    seats: 7,
    status: "Disponible",
    highlight: "Peugeot 5008 GT BlueHDi — 7 places",
    description:
      "Peugeot 5008 GT 1.5 BlueHDi 130 ch EAT8 (2022), 140 000 km. Diesel automatique, 7 places, finition GT. Prix annoncé TTC export : 8 800 €.",
    editorial:
      "Peugeot 5008 — version constructeur 5008 1.5 BlueHDi 130ch S&S GT EAT8. Année modèle 2022, première mise en circulation 12/2022, 140 000 km, diesel, boîte automatique, 5 portes, 7 places ou plus, couleur noir (intérieur Grey), Crit’Air 2, puissance fiscale 7 CV. Prix TTC export annoncé : 8 800 €. Contact Facebook page : +33 7 70 07 82 98 · contact@bmstracroutier.com.",
    features: [
      "Assistant de parking arrière",
      "Airbags frontal et latéral",
      "Régulateur de vitesse",
      "Radar obstacles avant / arrière",
      "Aide visuelle panoramique Visio Park 1",
      "Jantes 17\"",
      "Boîte automatique 8 rapports",
      "Filtre à particules",
      "Éclairage Eco LED",
    ],
    equipmentCategories: [
      {
        name: "Confort",
        items: [
          "Assistant de parking arrière",
          "Réfrigération automatique",
          "Jantes 17\"",
        ],
      },
      {
        name: "Sûreté et sécurité",
        items: [
          "Airbags frontal et latéral",
          "Radar obstacles avant / arrière",
          "Aide visuelle panoramique Visio Park 1",
        ],
      },
      {
        name: "Multimédia & aides",
        items: [
          "Radio, CD",
          "Régulateur de vitesse",
          "Éclairage Eco LED",
          "Boîte automatique 8 rapports",
          "Filtre à particules",
        ],
      },
    ],
    image: "/vehicles/peugeot-5008-gt-2022-4.jpg",
    imageAlt: "Peugeot 5008 GT noir — vue arrière trois-quarts",
    gallery: [
      {
        src: "/vehicles/peugeot-5008-gt-2022-5.jpg",
        alt: "Peugeot 5008 GT noir — vue arrière conducteur",
      },
      {
        src: "/vehicles/peugeot-5008-gt-2022-1.jpg",
        alt: "Peugeot 5008 GT noir — vue avant trois-quarts",
      },
      {
        src: "/vehicles/peugeot-5008-gt-2022-2.jpg",
        alt: "Peugeot 5008 GT noir — profil arrière",
      },
      {
        src: "/vehicles/peugeot-5008-gt-2022-3.jpg",
        alt: "Peugeot 5008 — banquette arrière 3 places individuelles",
      },
      {
        src: "/vehicles/peugeot-5008-gt-2022-6.jpg",
        alt: "Peugeot 5008 GT — photo annonce Facebook",
      },
      {
        src: "/vehicles/peugeot-5008-gt-2022-7.jpg",
        alt: "Peugeot 5008 GT — photo annonce Facebook",
      },
    ],
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
export function getSimilarVehicles(
  vehicle: Vehicle,
  limit = 4,
  pool: Vehicle[] = vehicles
): Vehicle[] {
  const others = pool.filter((v) => v.slug !== vehicle.slug);
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
