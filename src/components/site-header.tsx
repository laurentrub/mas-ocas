"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Network, Phone, X } from "lucide-react";
import { company, companyTelHref } from "@/lib/company";
import {
  SECONDARY_NAV,
  STOCK_NAV,
  type NavItem,
} from "@/lib/vehicle-categories";
import { cn } from "@/lib/utils";

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

function DesktopDropdown({
  item,
  cat,
  sub,
}: {
  item: NavItem;
  cat: string | null;
  sub: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = cat === item.id;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className={cn(
          "text-[15px] font-semibold tracking-wide text-white/90 transition-colors hover:text-white",
          active && "text-white"
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-[15px] font-semibold tracking-wide text-white/90 transition-colors hover:text-white",
          (active || open) && "text-white"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 min-w-[240px] pt-2"
        >
          <ul className="rounded-lg border border-[#d0d9e6] bg-white py-2 shadow-[0_12px_40px_rgb(12_35_64/0.18)]">
            {item.children.map((child) => {
              const childActive =
                cat === item.id &&
                (child.id === "all" ? !sub : sub === child.id);
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    role="menuitem"
                    className={cn(
                      "block px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-mist hover:text-orange",
                      childActive && "bg-mist text-orange"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SiteHeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");
  const sub = searchParams.get("sub");
  const [open, setOpen] = useState(false);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setMobileOpenId(null);
  }, [pathname, cat, sub]);

  return (
    <header className="sticky top-0 z-50">
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

          {companyTelHref() ? (
            <a
              href={companyTelHref()!}
              className="sm:hidden"
              aria-label="Appeler"
            >
              <Phone className="size-3.5" />
            </a>
          ) : (
            <Link
              href="/contact"
              className="sm:hidden"
              aria-label="Nous contacter"
            >
              <Phone className="size-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="bg-navy text-white shadow-[0_1px_0_rgb(0_0_0/0.15)]">
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <BrandLogo onNavigate={() => setOpen(false)} />

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Navigation principale"
          >
            {STOCK_NAV.map((item) => (
              <DesktopDropdown
                key={item.id}
                item={item}
                cat={cat}
                sub={sub}
              />
            ))}
            {SECONDARY_NAV.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);
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
              {STOCK_NAV.map((item) => (
                <div key={item.id} className="border-b border-white/10">
                  {item.children?.length ? (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-2 py-3.5 text-left text-base font-semibold text-white/95"
                        aria-expanded={mobileOpenId === item.id}
                        onClick={() =>
                          setMobileOpenId((id) =>
                            id === item.id ? null : item.id
                          )
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            mobileOpenId === item.id && "rotate-180"
                          )}
                          aria-hidden
                        />
                      </button>
                      {mobileOpenId === item.id ? (
                        <div className="pb-2 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-2 py-2.5 text-[15px] font-medium text-white/85"
                              onClick={() => setOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-2 py-3.5 text-base font-semibold text-white/95"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {SECONDARY_NAV.map((link) => (
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

export function SiteHeader() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50">
          <div className="h-9 bg-utility" />
          <div className="h-[68px] bg-navy" />
        </header>
      }
    >
      <SiteHeaderInner />
    </Suspense>
  );
}
