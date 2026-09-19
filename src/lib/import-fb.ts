import type { Database } from "@/lib/supabase/database.types";

type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];

type FbPost = {
  id?: string;
  post_id?: string;
  text?: string;
  message?: string;
  caption?: string;
  images?: string[];
  image?: string;
  photos?: string[];
};

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function extractPrice(text: string): number | null {
  const m = text.match(
    /(\d{1,3}(?:[\s.\u202f]\d{3})+|\d+)\s*(?:€|euros?)/i
  );
  if (!m) return null;
  return Number(m[1].replace(/[\s.\u202f]/g, ""));
}

function extractMileage(text: string): number | null {
  const m = text.match(/(\d{1,3}(?:[\s.\u202f]\d{3})+|\d+)\s*km\b/i);
  if (!m) return null;
  return Number(m[1].replace(/[\s.\u202f]/g, ""));
}

function extractYear(text: string): number | null {
  const m = text.match(/\b(20[0-2]\d|19[8-9]\d)\b/);
  if (!m) return null;
  return Number(m[1]);
}

const BRANDS = [
  "Peugeot",
  "Renault",
  "Citroën",
  "Citroen",
  "Volkswagen",
  "VW",
  "Toyota",
  "Ford",
  "Opel",
  "BMW",
  "Mercedes",
  "Audi",
  "Fiat",
  "Seat",
  "Skoda",
  "Hyundai",
  "Kia",
  "Nissan",
  "Dacia",
  "Mini",
  "Suzuki",
  "Mazda",
  "Volvo",
];

function extractBrandModel(text: string): { brand: string; model: string } {
  const firstLine = text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  for (const brand of BRANDS) {
    const re = new RegExp(`\\b${brand}\\b\\s+([A-Za-z0-9][\\w\\- ]{1,40})`, "i");
    const m = firstLine.match(re) || text.match(re);
    if (m) {
      return {
        brand: brand === "Citroen" ? "Citroën" : brand === "VW" ? "Volkswagen" : brand,
        model: m[1].trim().slice(0, 60),
      };
    }
  }
  const parts = firstLine.split(/\s+/);
  return {
    brand: parts[0] || "Inconnu",
    model: parts.slice(1, 4).join(" ") || "Modèle",
  };
}

function detectFuel(text: string): VehicleInsert["fuel"] {
  const t = text.toLowerCase();
  if (t.includes("électri") || t.includes("electri")) return "Électrique";
  if (t.includes("hybride")) return "Hybride";
  if (t.includes("diesel") || t.includes("bluehdi") || t.includes("dci"))
    return "Diesel";
  return "Essence";
}

function detectTransmission(text: string): VehicleInsert["transmission"] {
  const t = text.toLowerCase();
  if (t.includes("auto") || t.includes("edc") || t.includes("dsg"))
    return "Automatique";
  return "Manuelle";
}

function normalizePosts(input: unknown): FbPost[] {
  if (Array.isArray(input)) return input as FbPost[];
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (Array.isArray(obj.posts)) return obj.posts as FbPost[];
    if (Array.isArray(obj.vehicles)) return obj.vehicles as FbPost[];
    if (Array.isArray(obj.items)) return obj.items as FbPost[];
  }
  return [];
}

/** Parse un export JSON de posts Facebook → lignes vehicles à upsert. */
export function parseFacebookVehicles(input: unknown): VehicleInsert[] {
  const posts = normalizePosts(input);
  const out: VehicleInsert[] = [];

  for (const post of posts) {
    const text = String(
      post.text || post.message || post.caption || ""
    ).trim();
    if (text.length < 20) continue;

    const { brand, model } = extractBrandModel(text);
    const year = extractYear(text) ?? new Date().getFullYear();
    const price = extractPrice(text) ?? 0;
    const mileage = extractMileage(text) ?? 0;
    const images =
      post.images ||
      post.photos ||
      (post.image ? [post.image] : []);
    const image = images[0] || "";
    const postId = String(post.id || post.post_id || "");
    const slugBase = slugify(`${brand}-${model}-${year}-${postId || price}`);
    const gallery = images.slice(1).map((src, i) => ({
      src,
      alt: `${brand} ${model} — photo ${i + 2}`,
    }));

    out.push({
      slug: slugBase || `fb-${Date.now()}`,
      brand,
      model,
      year,
      price,
      mileage,
      fuel: detectFuel(text),
      transmission: detectTransmission(text),
      power: "",
      color: "",
      doors: 5,
      seats: 5,
      status: "Disponible",
      highlight: text.split("\n")[0]?.slice(0, 120) || `${brand} ${model}`,
      description: text.slice(0, 500),
      editorial: text,
      features: [],
      image,
      image_alt: `${brand} ${model}`,
      gallery: gallery.length ? gallery : null,
      facebook_post_id: postId || null,
      source: "facebook",
    });
  }

  return out;
}
