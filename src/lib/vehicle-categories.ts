import type { Vehicle } from "@/lib/vehicles";

export type VehicleCategoryId =
  | "utilitaires"
  | "voitures"
  | "camping-cars";

export type VehicleSubcategoryId =
  | "fourgons-grands"
  | "fourgons-moyens"
  | "combi-monospace"
  | "petits-utilitaires"
  | "pick-up"
  | "depanneuses"
  | "bennes"
  | "berlines"
  | "citadines-compactes"
  | "suv-crossover";

export type NavChild = {
  id: string;
  label: string;
  href: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: NavChild[];
};

/** Menu principal validé (sans poids lourds ni camping-cars). */
export const STOCK_NAV: NavItem[] = [
  {
    id: "voitures",
    label: "Voitures",
    href: "/stock?cat=voitures",
    children: [
      { id: "all", label: "Toutes les voitures", href: "/stock?cat=voitures" },
      {
        id: "berlines",
        label: "Berlines",
        href: "/stock?cat=voitures&sub=berlines",
      },
      {
        id: "citadines-compactes",
        label: "Citadines / compactes",
        href: "/stock?cat=voitures&sub=citadines-compactes",
      },
      {
        id: "suv-crossover",
        label: "SUV / crossover",
        href: "/stock?cat=voitures&sub=suv-crossover",
      },
    ],
  },
  {
    id: "utilitaires",
    label: "Utilitaires",
    href: "/stock?cat=utilitaires",
    children: [
      { id: "all", label: "Tous les utilitaires", href: "/stock?cat=utilitaires" },
      {
        id: "fourgons-grands",
        label: "Fourgons / grands VU",
        href: "/stock?cat=utilitaires&sub=fourgons-grands",
      },
      {
        id: "fourgons-moyens",
        label: "Fourgons moyens",
        href: "/stock?cat=utilitaires&sub=fourgons-moyens",
      },
      {
        id: "combi-monospace",
        label: "Combi / monospace",
        href: "/stock?cat=utilitaires&sub=combi-monospace",
      },
      {
        id: "petits-utilitaires",
        label: "Petits utilitaires",
        href: "/stock?cat=utilitaires&sub=petits-utilitaires",
      },
      {
        id: "pick-up",
        label: "Pick-up",
        href: "/stock?cat=utilitaires&sub=pick-up",
      },
      {
        id: "depanneuses",
        label: "Dépanneuses / plateaux",
        href: "/stock?cat=utilitaires&sub=depanneuses",
      },
      {
        id: "bennes",
        label: "Bennes / hayon",
        href: "/stock?cat=utilitaires&sub=bennes",
      },
    ],
  },
];

export const SECONDARY_NAV: { href: string; label: string }[] = [
  { href: "/financement", label: "Financement" },
  { href: "/livraison", label: "Livraison" },
];

const CATEGORY_LABELS: Record<VehicleCategoryId, string> = {
  utilitaires: "Utilitaires",
  voitures: "Voitures",
  "camping-cars": "Camping-cars",
};

const SUB_LABELS: Record<VehicleSubcategoryId, string> = {
  "fourgons-grands": "Fourgons / grands VU",
  "fourgons-moyens": "Fourgons moyens",
  "combi-monospace": "Combi / monospace",
  "petits-utilitaires": "Petits utilitaires",
  "pick-up": "Pick-up",
  depanneuses: "Dépanneuses / plateaux",
  bennes: "Bennes / hayon",
  berlines: "Berlines",
  "citadines-compactes": "Citadines / compactes",
  "suv-crossover": "SUV / crossover",
};

export function categoryLabel(id: string | undefined): string | undefined {
  if (!id) return undefined;
  return CATEGORY_LABELS[id as VehicleCategoryId];
}

export function subcategoryLabel(id: string | undefined): string | undefined {
  if (!id) return undefined;
  return SUB_LABELS[id as VehicleSubcategoryId];
}

export type VehicleClassification = {
  category: VehicleCategoryId;
  subcategory?: VehicleSubcategoryId;
};

function vehicleText(v: Pick<Vehicle, "brand" | "model" | "highlight" | "description" | "editorial">) {
  return `${v.brand} ${v.model} ${v.highlight} ${v.description} ${v.editorial ?? ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Poids lourds / tracteurs — exclus du site et des imports. */
export function isHeavyVehicleText(text: string): boolean {
  const t = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/actros|tgx|tracteur|semi[- ]?remorque|poids ?lourd/.test(t)) return true;
  if (/remorque 72c|schiebeplateau|72c18/.test(t)) return true;
  if (/\bman\b/.test(t) && /tgx|tgs|tgm|18\.\d{3}/.test(t)) return true;
  return false;
}

export function isHeavyVehicle(
  v: Pick<Vehicle, "brand" | "model" | "highlight" | "description" | "editorial">
): boolean {
  return isHeavyVehicleText(vehicleText(v));
}

/**
 * Classifie un véhicule pour le menu stock.
 * Retourne null si hors catalogue (ex. poids lourds).
 */
export function classifyVehicle(
  v: Pick<Vehicle, "brand" | "model" | "highlight" | "description" | "editorial">
): VehicleClassification | null {
  const t = vehicleText(v);
  if (isHeavyVehicleText(t)) return null;

  if (
    /camping[- ]?car|benimar|mac louis|evidence|spolair|tessoro/.test(t)
  ) {
    return { category: "camping-cars" };
  }

  if (/depann?euse|schiebeplateau|ramp\/car ambulance/.test(t)) {
    return { category: "utilitaires", subcategory: "depanneuses" };
  }

  if (
    (/benne|polybenne|ampliroll/.test(t) ||
      (/hayon/.test(t) && /plateau|benne/.test(t))) &&
    /sprinter|iveco|daily|master|jumper|boxer|ducato|transit/.test(t)
  ) {
    return { category: "utilitaires", subcategory: "bennes" };
  }

  if (/\branger\b|\bf-?150\b|pick[- ]?up/.test(t)) {
    return { category: "utilitaires", subcategory: "pick-up" };
  }

  if (
    /combi|9 ?places|classe v\b|space.?tourer|mixto|6 ?places/.test(t) &&
    /jumpy|expert|vito|trafic|transit|classe v/.test(t)
  ) {
    return { category: "utilitaires", subcategory: "combi-monospace" };
  }

  if (/kangoo|partner|berlingo/.test(t)) {
    return { category: "utilitaires", subcategory: "petits-utilitaires" };
  }

  if (
    /trafic|transit custom|jumpy|expert|\bvito\b/.test(t) &&
    !/classe v/.test(t)
  ) {
    return { category: "utilitaires", subcategory: "fourgons-moyens" };
  }

  if (
    /sprinter|master|jumper|boxer|ducato|\btransit\b|daily|35c|35 s|70c|35-c/.test(
      t
    )
  ) {
    return { category: "utilitaires", subcategory: "fourgons-grands" };
  }

  if (/3008|5008|c5 aircross|\bglc\b|\bgle\b|\bsuv\b/.test(t)) {
    return { category: "voitures", subcategory: "suv-crossover" };
  }

  if (
    /\bgolf\b|\bclio\b|sandero|\byaris\b|citadine|compacte/.test(t)
  ) {
    return { category: "voitures", subcategory: "citadines-compactes" };
  }

  if (
    /\bcla\b|classe a\b|a45|a-class|berline|progressive line/.test(t)
  ) {
    return { category: "voitures", subcategory: "berlines" };
  }

  // Fallback VU keywords without precise sub
  if (
    /fourgon|utilitaire|\bvan\b|fg\b|l2h|l1h|cabine approfondie/.test(t)
  ) {
    return { category: "utilitaires", subcategory: "fourgons-moyens" };
  }

  return { category: "voitures", subcategory: "citadines-compactes" };
}

export function vehicleMatchesCategory(
  v: Pick<Vehicle, "brand" | "model" | "highlight" | "description" | "editorial">,
  cat?: string,
  sub?: string
): boolean {
  if (!cat) {
    return !isHeavyVehicle(v);
  }
  const c = classifyVehicle(v);
  if (!c) return false;
  if (c.category !== cat) return false;
  if (sub && c.subcategory !== sub) return false;
  return true;
}

export function stockHref(opts?: {
  cat?: string;
  sub?: string;
  q?: string;
  budget?: string;
  km?: string;
}): string {
  const params = new URLSearchParams();
  if (opts?.cat) params.set("cat", opts.cat);
  if (opts?.sub) params.set("sub", opts.sub);
  if (opts?.q) params.set("q", opts.q);
  if (opts?.budget) params.set("budget", opts.budget);
  if (opts?.km) params.set("km", opts.km);
  const qs = params.toString();
  return qs ? `/stock?${qs}` : "/stock";
}
