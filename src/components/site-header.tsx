"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Network, Phone, X } from "lucide-react";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/stock", label: "Acheter" },
  { href: "/guide-achat", label: "Guide d’achat" },
  { href: "/financement", label: "Financement" },
  { href: "/livraison", label: "Livraison" },
];

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
        <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-between gap-3 px-4 text-[12px] leading-none sm:px-6 lg:px-8">
          <p className="truncate font-normal text-white/95">
            Garage multi-marques · vente &amp; livraison
          </p>

          <Link
            href="/contact"
            className="hidden items-center gap-1.5 text-white/95 transition-opacity hover:opacity-80 sm:inline-flex"
          >
            <Network className="size-3.5 shrink-0" aria-hidden />
            <span>Nous contacter</span>
          </Link>

          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className="sm:hidden"
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
              const active = link.href.startsWith("/stock")
                ? pathname.startsWith("/stock") ||
                  pathname.startsWith("/vehicules")
                : link.href.startsWith("/guide-achat")
                  ? pathname.startsWith("/guide-achat")
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
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
