"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Inbox,
  FileText,
  Landmark,
  Users,
  UserRound,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { company } from "@/lib/company";
import type { StaffAccess } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/stock", label: "Stock", icon: Car },
  { href: "/admin/leads", label: "Demandes", icon: Inbox },
  { href: "/admin/commandes", label: "Bons de commande", icon: FileText },
  { href: "/admin/clients", label: "Clients", icon: UserRound },
  { href: "/admin/rib", label: "RIB", icon: Landmark, adminOnly: true },
  { href: "/admin/equipe", label: "Équipe", icon: Users, superOnly: true },
] as const;

export function AdminShell({
  children,
  access,
  email,
}: {
  children: React.ReactNode;
  access: StaffAccess;
  email: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const items = nav.filter((item) => {
    if ("superOnly" in item && item.superOnly) return access.canManageTeam;
    if ("adminOnly" in item && item.adminOnly) return access.canManageRib;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-mist text-navy">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[#d0d9e6] bg-navy text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange">
            Back-office
          </p>
          <p className="mt-1 font-display text-lg font-extrabold leading-tight">
            {company.brand}
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-orange text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4" />
            Voir le site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Déconnexion
          </button>
          <p className="truncate px-3 pb-2 text-[11px] text-white/40">{email}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#d0d9e6] bg-white px-4 py-3 md:hidden">
          <p className="font-display text-sm font-bold">{company.brand}</p>
          <button
            type="button"
            onClick={signOut}
            className="text-sm font-medium text-orange"
          >
            Quitter
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-[#d0d9e6] bg-white px-2 py-2 md:hidden">
          {items.map(({ href, label }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold",
                  active ? "bg-orange text-white" : "text-navy/70"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
