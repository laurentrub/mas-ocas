import type { MetadataRoute } from "next";
import { company } from "@/lib/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `https://${company.domain}/sitemap.xml`,
  };
}
