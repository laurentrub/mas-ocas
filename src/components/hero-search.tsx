"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const budgets = [
  { value: "", label: "Budget" },
  { value: "10000", label: "Jusqu'à 10 000 €" },
  { value: "15000", label: "Jusqu'à 15 000 €" },
  { value: "20000", label: "Jusqu'à 20 000 €" },
  { value: "25000", label: "Jusqu'à 25 000 €" },
  { value: "30000", label: "Jusqu'à 30 000 €" },
];

const mileages = [
  { value: "", label: "Kilométrage" },
  { value: "30000", label: "Jusqu'à 30 000 km" },
  { value: "60000", label: "Jusqu'à 60 000 km" },
  { value: "100000", label: "Jusqu'à 100 000 km" },
  { value: "150000", label: "Jusqu'à 150 000 km" },
];

export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<"acheter" | "reprise">("acheter");
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [mileage, setMileage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (tab === "reprise") {
      router.push("/contact?sujet=Reprise");
      return;
    }
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (budget) params.set("budget", budget);
    if (mileage) params.set("km", mileage);
    const qs = params.toString();
    router.push(qs ? `/stock?${qs}` : "/stock");
  }

  return (
    <div className="relative z-30 mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-white p-4 shadow-[0_12px_40px_rgb(12_35_64/0.18)] sm:p-5">
        <div className="mb-3.5 flex flex-wrap gap-x-6 gap-y-1 border-b border-[#e6ebf2]">
          <button
            type="button"
            onClick={() => setTab("acheter")}
            className={cn(
              "relative pb-3 text-[15px] font-semibold transition-colors sm:text-base",
              tab === "acheter" ? "text-navy" : "text-[#9aa8ba] hover:text-navy"
            )}
          >
            Achetez votre véhicule d&apos;occasion
            {tab === "acheter" ? (
              <span
                className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-orange"
                aria-hidden
              />
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setTab("reprise")}
            className={cn(
              "relative pb-3 text-[15px] font-semibold transition-colors sm:text-base",
              tab === "reprise" ? "text-navy" : "text-[#9aa8ba] hover:text-navy"
            )}
          >
            Estimez votre reprise
            {tab === "reprise" ? (
              <span
                className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-orange"
                aria-hidden
              />
            ) : null}
          </button>
        </div>

        {tab === "acheter" ? (
          <form
            onSubmit={onSubmit}
            className="grid gap-3.5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end"
          >
            <label className="block">
              <span className="sr-only">Marque, modèle</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Marque, modèle…"
                className="h-14 w-full rounded-lg border border-[#d5dde8] bg-white px-4 text-base text-navy outline-none placeholder:text-[#9aa8ba] focus:border-orange focus:ring-2 focus:ring-orange/25"
              />
            </label>
            <label className="block">
              <span className="sr-only">Budget</span>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="h-14 w-full appearance-none rounded-lg border border-[#d5dde8] bg-white bg-[length:12px] bg-[right_14px_center] bg-no-repeat px-4 pr-10 text-base text-navy outline-none focus:border-orange focus:ring-2 focus:ring-orange/25"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239aa8ba' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
                }}
              >
                {budgets.map((b) => (
                  <option key={b.value || "all"} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Kilométrage</span>
              <select
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="h-14 w-full appearance-none rounded-lg border border-[#d5dde8] bg-white bg-[length:12px] bg-[right_14px_center] bg-no-repeat px-4 pr-10 text-base text-navy outline-none focus:border-orange focus:ring-2 focus:ring-orange/25"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239aa8ba' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
                }}
              >
                {mileages.map((m) => (
                  <option key={m.value || "all"} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-orange px-7 text-base font-bold text-white transition-colors hover:bg-[#e05f00] md:min-w-[180px]"
            >
              <Search className="size-[18px]" aria-hidden />
              Rechercher
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-xl text-base leading-relaxed text-[#5a6b80]">
              Obtenez une estimation pour la reprise de votre véhicule auprès de
              MAS OCAS AUTO au Mans.
            </p>
            <button
              type="button"
              onClick={() => router.push("/contact?sujet=Reprise")}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-orange px-7 text-base font-bold text-white transition-colors hover:bg-[#e05f00]"
            >
              Estimer ma reprise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
