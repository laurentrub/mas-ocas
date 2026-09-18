import Link from "next/link";
import { company } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy text-chrome">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">
            {company.brand}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-chrome/70">
            Garage multi-marques au Mans. Sélection de véhicules d&apos;occasion,
            livraison et accompagnement jusqu&apos;à la remise des clés.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chrome/50">
            Coordonnées
          </p>
          <address className="mt-3 space-y-1 text-sm not-italic text-chrome/80">
            <p>{company.legalName}</p>
            <p>{company.address.full}</p>
            <p>
              <a className="hover:text-white" href={`tel:${company.phone.replace(/\s/g, "")}`}>
                {company.phone}
              </a>
            </p>
            <p>
              <a className="hover:text-white" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </p>
            <p className="pt-2 text-chrome/60">{company.hours}</p>
          </address>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chrome/50">
            Navigation
          </p>
          <ul className="mt-3 space-y-2 text-sm text-chrome/80">
            <li>
              <Link className="hover:text-white" href="/stock">
                Véhicules
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/#financement">
                Financement
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/#livraison">
                Livraison
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/guide-achat">
                Guide d’achat
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/#faq">
                FAQ
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chrome/50">
            Légales
          </p>
          <ul className="mt-3 space-y-2 text-sm text-chrome/80">
            <li>
              <Link className="hover:text-white" href="/mentions-legales">
                Mentions légales
              </Link>
            </li>
            <li className="pt-2 text-chrome/60">
              {company.legalForm}
              <br />
              {company.rcs.label}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-5 text-xs text-chrome/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {company.brand} — {company.legalName}
          </p>
          <p>
            {company.address.street}, {company.address.postalCode}{" "}
            {company.address.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
