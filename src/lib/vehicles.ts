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
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
};

export const vehicles: Vehicle[] = [
  {
    slug: "peugeot-3008-gt-2021",
    brand: "Peugeot",
    model: "3008 GT PureTech 180",
    year: 2021,
    price: 24990,
    mileage: 58400,
    fuel: "Essence",
    transmission: "Automatique",
    power: "180 ch",
    color: "Gris Artense",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "SUV familial soigné, prêt à partir",
    description:
      "3008 GT en excellent état, entretien Peugeot à jour. Idéal famille ou trajets quotidiens Sarthois, avec livrabilité rapide dans le Grand Ouest.",
    features: [
      "Toit panoramique",
      "Caméra 360°",
      "Sièges chauffants",
      "Apple CarPlay / Android Auto",
      "Aide au stationnement",
    ],
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
    features: [
      "Écran tactile 9,3\"",
      "Radar de recul",
      "Régulateur de vitesse",
      "Climatisation automatique",
      "Jantes alliage 16\"",
    ],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Citadine claire vue de trois-quarts avant",
  },
  {
    slug: "volkswagen-golf-8-2020",
    brand: "Volkswagen",
    model: "Golf 8 Style 1.5 eTSI",
    year: 2020,
    price: 21990,
    mileage: 71200,
    fuel: "Hybride",
    transmission: "Automatique",
    power: "150 ch",
    color: "Bleu Atlantique",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "Confort allemand, mild-hybrid",
    description:
      "Golf 8 Style mild-hybrid : couple disponible tôt, consommation maîtrisée, finition soignée. Un choix solide pour rouler loin sans compromis.",
    features: [
      "Digital Cockpit Pro",
      "Adaptive Cruise Control",
      "LED Matrix",
      "Keyless Access",
      "Pack hiver",
    ],
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Compacte bleue sur route",
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
      "Yaris Hybrid Design quasi neuve : fiabilité Toyota, bonus écologique déjà amorti, idéale pour un premier véhicule ou un second foyer.",
    features: [
      "Toyota Safety Sense",
      "Caméra de recul",
      "Chargeur induction",
      "Sièges tissu/synthétique",
      "Garantie constructeur restante",
    ],
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Citadine compacte en lumière du jour",
  },
  {
    slug: "bmw-serie-3-320d-2019",
    brand: "BMW",
    model: "Série 3 320d Luxury",
    year: 2019,
    price: 27490,
    mileage: 89400,
    fuel: "Diesel",
    transmission: "Automatique",
    power: "190 ch",
    color: "Noir Saphir",
    doors: 4,
    seats: 5,
    status: "Réservé",
    highlight: "Berline prestige, grand trajet",
    description:
      "320d Luxury : silence de marche, châssis précis, finition cuir. Parfaite pour les longs trajets A11 / A28. Dossier complet disponible sur demande.",
    features: [
      "Cuir Dakota",
      "GPS Professional",
      "Toit ouvrant",
      "Sièges électriques mémoire",
      "Pack Driving Assistant",
    ],
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Berline noire de profil",
  },
  {
    slug: "citroen-c5-aircross-2021",
    brand: "Citroën",
    model: "C5 Aircross Shine BlueHDi",
    year: 2021,
    price: 22990,
    mileage: 64300,
    fuel: "Diesel",
    transmission: "Automatique",
    power: "130 ch",
    color: "Blanc Banquise",
    doors: 5,
    seats: 5,
    status: "Disponible",
    highlight: "Confort suspendu, volume XXL",
    description:
      "C5 Aircross Shine : suspensions à butées hydrauliques progressives, coffre généreux, parfait pour week-ends et déménagements légers.",
    features: [
      "Suspension Progressive Hydraulic",
      "Hayon électrique",
      "Grip Control",
      "Chargeur smartphone",
      "Banquette coulissante",
    ],
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "SUV familial blanc stationné",
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
