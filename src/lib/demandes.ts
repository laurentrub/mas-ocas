import type { Vehicle } from "@/lib/vehicles";
import { vehicleDisplayName, vehiclePath } from "@/lib/vehicles";

export type VisitSlot = "matin" | "apres-midi";

export type VisitDetails = {
  kind: "visite";
  preferred_date: string;
  preferred_slot: VisitSlot;
};

export type DeliveryDetails = {
  kind: "livraison";
  address: string;
  postal_code: string;
  city: string;
  country: string;
  preferred_date?: string;
};

export type FinanceCustomerType = "particulier" | "professionnel";

export type FinanceProduct =
  | "credit_classique"
  | "loa"
  | "lld"
  /** @deprecated */
  | "credit_avec_apport"
  /** @deprecated */
  | "credit_sans_apport";

export type FinanceDurationMonths = 36 | 48 | 60;

export type FinanceDetails = {
  kind: "financement";
  vehicle_price: number;
  customer_type: FinanceCustomerType;
  product: FinanceProduct;
  duration_months: FinanceDurationMonths;
  /** Premier versement obligatoire — min 10 % du prix */
  upfront_amount?: number;
  /** Première mensualité modulée — optionnel */
  first_monthly_amount?: number | null;
  simulated_taeg?: number;
  simulated_monthly?: number;
  /** @deprecated kept for older leads */
  installments?: 2 | 3 | 4;
  warranty_extension: boolean;
  financial_loss_insurance: boolean;
  country?: string;
};

/** TAEG simulé pour le widget (indicatif) — marché occasion. */
export const FINANCE_SIMULATED_TAEG = 0.069;

export const FINANCE_DEPOSIT_MIN_RATIO = 0.1;
export const FINANCE_DEPOSIT_MAX_RATIO = 0.5;

export const FINANCE_WARRANTY_MONTHLY = 29;
export const FINANCE_LOSS_INSURANCE_MONTHLY = 19;

export function financeDepositBounds(vehiclePrice: number) {
  const min = Math.ceil(vehiclePrice * FINANCE_DEPOSIT_MIN_RATIO);
  const max = Math.floor(vehiclePrice * FINANCE_DEPOSIT_MAX_RATIO);
  return { min, max: Math.max(min, max) };
}

/**
 * Mensualité constante (annuité).
 * Mensualité = (Capital × TauxMensuel) / (1 − (1 + TauxMensuel)^(−Mois))
 * où TauxMensuel = TAEG / 12 (TAEG exprimé en décimal, ex. 0.069).
 * Vérif : 20 691 € · 60 mois · 6,9 % → 408,73 €.
 */
export function calculateLoanMonthlyPayment(
  capital: number,
  annualTaeg: number,
  months: number
): number {
  if (capital <= 0 || months <= 0) return 0;
  const tauxMensuel = annualTaeg / 12;
  if (tauxMensuel === 0) return Math.round((capital / months) * 100) / 100;
  const mensualite =
    (capital * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -months));
  return Math.round(mensualite * 100) / 100;
}

export const FINANCE_PRODUCT_LABELS: Record<FinanceProduct, string> = {
  credit_classique: "Paiement Étalé (Crédit Classique)",
  loa: "LOA · option d’achat",
  lld: "LLD · renouvellement possible",
  credit_avec_apport: "Paiement Étalé (Crédit Classique)",
  credit_sans_apport: "Paiement Étalé (Crédit Classique)",
};

export function financeUpfrontLabel(product: FinanceProduct): string {
  if (product === "loa" || product === "lld") {
    return "Premier versement obligatoire (10 % min)";
  }
  return "Premier versement obligatoire (10 % min)";
}

export function isLoaOrLld(product: FinanceProduct): boolean {
  return product === "loa" || product === "lld";
}

export const FINANCE_CUSTOMER_LABELS: Record<FinanceCustomerType, string> = {
  particulier: "Particulier",
  professionnel: "Professionnel (B2B)",
};

export type LeadDetails = VisitDetails | DeliveryDetails | FinanceDetails;

export function demandeVisiteHref(slug: string) {
  return `/demande/visite/${slug}`;
}

export function demandeLivraisonHref(slug: string) {
  return `/demande/livraison/${slug}`;
}

export function demandeFinancementHref(slug: string) {
  return `/demande/financement/${slug}`;
}

/** @deprecated prefer demande*Href(slug) — kept for generic contact links */
export function contactVehicleHref(
  vehicle: Vehicle,
  sujet?: "Financement" | "Livraison" | "Rappel" | "Rendez-vous"
) {
  if (sujet === "Rendez-vous") return demandeVisiteHref(vehicle.slug);
  if (sujet === "Livraison") return demandeLivraisonHref(vehicle.slug);
  if (sujet === "Financement") return demandeFinancementHref(vehicle.slug);
  const base = `/contact?vehicule=${encodeURIComponent(vehicleDisplayName(vehicle))}`;
  return sujet ? `${base}&sujet=${encodeURIComponent(sujet)}` : base;
}

export function buildInstallmentSchedule(
  total: number,
  installments: 2 | 3 | 4 | FinanceDurationMonths
): { label: string; amount: number; due_label: string }[] {
  const n = installments;
  const base = Math.floor((total / n) * 100) / 100;
  const parts: number[] = Array.from({ length: n }, () => base);
  const drift =
    Math.round((total - parts.reduce((a, b) => a + b, 0)) * 100) / 100;
  parts[parts.length - 1] =
    Math.round((parts[parts.length - 1] + drift) * 100) / 100;

  const isLong = n >= 24;

  return parts.map((amount, i) => ({
    label: isLong
      ? `Mensualité ${i + 1}/${n}`
      : `${i + 1}${i === 0 ? "re" : "e"} éch.`,
    amount,
    due_label: isLong
      ? "Part de capital indicative (hors intérêts et frais)"
      : i === 0
        ? "commande / livraison"
        : `${i * 30} j`,
  }));
}

/** Mensualité de capital indicative sur N mois (hors intérêts / frais). */
export function buildMonthlyCapitalPreview(
  total: number,
  months: FinanceDurationMonths
): { monthly: number; months: FinanceDurationMonths } {
  const monthly = Math.round((total / months) * 100) / 100;
  return { monthly, months };
}

export function vehicleBackHref(slug: string) {
  return vehiclePath(slug);
}
