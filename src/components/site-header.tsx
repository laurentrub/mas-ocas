"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapPin, Menu, Network, Phone, X } from "lucide-react";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/stock", label: "Acheter" },
  { href: "/guide-achat", label: "Guide d’achat" },
  { href: "/#financement", label: "Financement" },
  { href: "/#livraison", label: "Livraison" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    path: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-3.2 1.7-4.8 4.9-4.9 1.3-.1 1.7-.1 4.9-.1zm0 1.8c-3.2 0-3.5 0-4.8.1-2.2.1-3.3 1.2-3.4 3.4-.1 1.2-.1 1.6-.1 4.8s0 3.5.1 4.8c.1 2.2 1.2 3.3 3.4 3.4 1.2.1 1.6.1 4.8.1s3.5 0 4.8-.1c2.2-.1 3.3-1.2 3.4-3.4.1-1.2.1-1.6.1-4.8s0-3.5-.1-4.8c-.1-2.2-1.2-3.3-3.4-3.4-1.3-.1-1.6-.1-4.8-.1zm0 3.1a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.3-2.1a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    path: "M6.2 9H3v12h3.2V9zM4.6 3.5A1.9 1.9 0 104.6 7.3 1.9 1.9 0 004.6 3.5zM21 15.3V21h-3.2v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H10.7V9h3.1v1.6c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1z",
  },
] as const;

/** Logo: brand name locked as MAS OCAS AUTO, orange slash accent on the O (Distinxion-style mark). */
export function BrandLogo({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "group inline-flex items-baseline gap-0 font-display text-[1.35rem] font-extrabold uppercase tracking-[0.04em] text-white sm:text-[1.55rem]",
        className
      )}
      aria-label="MAS OCAS AUTO — Accueil"
    >
      <span>MAS&nbsp;</span>
      <span className="relative inline-block">
        <span className="relative z-10">O</span>
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[2px] w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] bg-orange"
        />
      </span>
      <span>CAS&nbsp;AUTO</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar — Distinxion: compact medium blue */}
      <div className="bg-utility text-white">
        <div className="mx-auto grid h-9 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 text-[12px] leading-none sm:px-6 lg:px-8">
          <p className="truncate font-normal text-white/95">
            Garage multi-marques · vente &amp; livraison
          </p>

          <div
            className="hidden items-center justify-center gap-3.5 md:flex"
            aria-label="Réseaux sociaux"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 transition-opacity hover:opacity-80"
                aria-label={social.label}
              >
                <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          <div className="hidden items-center justify-end gap-5 sm:flex">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-white/95 transition-opacity hover:opacity-80"
            >
              <Network className="size-3.5 shrink-0" aria-hidden />
              <span>Nous contacter</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-white/95 transition-opacity hover:opacity-80"
            >
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span>Trouvez votre point de vente</span>
            </Link>
          </div>

          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className="justify-self-end sm:hidden"
            aria-label="Appeler"
          >
            <Phone className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Primary nav — Distinxion: deep navy, roomy */}
      <div className="bg-navy text-white shadow-[0_1px_0_rgb(0_0_0/0.15)]">
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <BrandLogo onNavigate={() => setOpen(false)} />

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => {
              const active =
                link.href.startsWith("/stock")
                  ? pathname.startsWith("/stock")
                  : link.href.startsWith("/guide-achat")
                    ? pathname.startsWith("/guide-achat")
                    : link.href.startsWith("/contact") && !link.href.includes("Reprise")
                      ? pathname.startsWith("/contact")
                      : false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[15px] font-semibold tracking-wide text-white/90 transition-colors hover:text-white",
                    active && "text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-md bg-orange px-5 text-[14px] font-bold tracking-wide text-white transition-colors hover:bg-[#e05f00]"
            >
              Demande d&apos;info
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center text-white lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-white/10 lg:hidden">
            <nav className="mx-auto flex max-w-[1200px] flex-col px-4 py-2 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-3.5 text-base font-semibold text-white/95"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mb-3 mt-2 inline-flex h-11 items-center justify-center rounded-md bg-orange text-sm font-bold text-white"
                onClick={() => setOpen(false)}
              >
                Demande d&apos;info
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
