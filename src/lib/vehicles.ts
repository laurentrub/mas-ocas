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
    features: [
      "Écran tactile",
      "Caméra de recul",
      "Régulateur de vitesse",
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
    features: [
      "Digital Cockpit",
      "Climatisation automatique",
      "LED",
      "Bluetooth / USB",
      "Aide au démarrage en côte",
    ],
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
    features: [
      "Media Display",
      "Bluetooth",
      "Direction assistée",
      "Vitres électriques avant",
      "Roue de secours",
    ],
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
    features: [
      "Suspension Progressive Hydraulic",
      "Caméra de recul",
      "Grip Control",
      "Chargeur smartphone",
      "Banquette coulissante",
    ],
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
