import type { MetadataRoute } from "next";
import { company } from "@/lib/company";
import { guideArticles } from "@/lib/guide-achat";
import { listVehiclesFromDb } from "@/lib/vehicles-db";
import { vehiclePath } from "@/lib/vehicles";

const base = `https://${company.domain}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/stock",
    "/financement",
    "/livraison",
    "/reprise",
    "/a-propos",
    "/contact",
    "/guide-achat",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/cookies",
    "/cgv",
    "/cgu",
    "/mediation",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/stock" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/stock" ? 0.9 : 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guideArticles.map((article) => ({
    url: `${base}/guide-achat/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const { vehicles } = await listVehiclesFromDb();
  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${base}${vehiclePath(v.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...guideRoutes, ...vehicleRoutes];
}
