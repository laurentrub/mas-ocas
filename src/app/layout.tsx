import type { Metadata } from "next";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company } from "@/lib/company";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${company.brand} · Vente & livraison multi-marques`,
    template: `%s · ${company.brand}`,
  },
  description:
    "Garage multi-marques au Mans : véhicules d'occasion sélectionnés, livraison et accompagnement jusqu'à la remise des clés.",
  metadataBase: new URL(`https://${company.domain}`),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-body">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
