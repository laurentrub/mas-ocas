"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateLoanMonthlyPayment,
  FINANCE_CUSTOMER_LABELS,
  FINANCE_DEPOSIT_MIN_RATIO,
  FINANCE_LOSS_INSURANCE_MONTHLY,
  FINANCE_PRODUCT_LABELS,
  FINANCE_SIMULATED_TAEG,
  FINANCE_WARRANTY_MONTHLY,
  financeDepositBounds,
  type FinanceCustomerType,
  type FinanceDurationMonths,
  type FinanceProduct,
} from "@/lib/demandes";
import { formatPrice, vehiclePath } from "@/lib/vehicles";

type Props = {
  vehicleSlug: string;
  vehicleLabel: string;
  /** Prix TTC du véhicule — dynamique */
  vehiclePrice: number;
};

const PRODUCTS: { id: FinanceProduct; hint: string }[] = [
  {
    id: "credit_classique",
    hint: "Propriétaire dès l’achat — 36, 48 ou 60 mois",
  },
  {
    id: "loa",
    hint: "Location avec option d’achat",
  },
  {
    id: "lld",
    hint: "Location longue durée",
  },
];

const DURATIONS: FinanceDurationMonths[] = [36, 48, 60];

export function FinanceRequestForm({
  vehicleSlug,
  vehicleLabel,
  vehiclePrice,
}: Props) {
  const { min: depositMin, max: depositMax } = useMemo(
    () => financeDepositBounds(vehiclePrice),
    [vehiclePrice]
  );

  const [customerType, setCustomerType] =
    useState<FinanceCustomerType>("particulier");
  const [product, setProduct] = useState<FinanceProduct>("credit_classique");
  const [deposit, setDeposit] = useState(depositMin);
  const [duration, setDuration] = useState<FinanceDurationMonths>(60);
  const [warrantyExtension, setWarrantyExtension] = useState(false);
  const [financialLoss, setFinancialLoss] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("France");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  // Recalage du dépôt si le prix véhicule change
  useEffect(() => {
    setDeposit((prev) => Math.min(depositMax, Math.max(depositMin, prev)));
  }, [depositMin, depositMax]);

  const financedCapital = Math.max(0, vehiclePrice - deposit);

  const baseMonthly = useMemo(
    () =>
      calculateLoanMonthlyPayment(
        financedCapital,
        FINANCE_SIMULATED_TAEG,
        duration
      ),
    [financedCapital, duration]
  );

  const optionsMonthly =
    (warrantyExtension ? FINANCE_WARRANTY_MONTHLY : 0) +
    (financialLoss ? FINANCE_LOSS_INSURANCE_MONTHLY : 0);

  const finalMonthly =
    Math.round((baseMonthly + optionsMonthly) * 100) / 100;

  const isCredit = product === "credit_classique";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const options = [
      warrantyExtension
        ? `Extension garantie (+${FINANCE_WARRANTY_MONTHLY} €/mois)`
        : null,
      financialLoss
        ? `Assurance perte financière (+${FINANCE_LOSS_INSURANCE_MONTHLY} €/mois)`
        : null,
    ]
      .filter(Boolean)
      .join(" · ");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "financement",
          name,
          email,
          phone,
          vehicle_slug: vehicleSlug,
          interest: vehicleLabel,
          message:
            message.trim() ||
            `Simulation ${FINANCE_PRODUCT_LABELS[product]} (${FINANCE_CUSTOMER_LABELS[customerType]}, ${duration} mois, TAEG simulé ${(FINANCE_SIMULATED_TAEG * 100).toFixed(1)} %) — ${vehicleLabel}. Prix ${formatPrice(vehiclePrice)}, premier versement ${formatPrice(deposit)}, capital ${formatPrice(financedCapital)}, mensualité estimée ${formatPrice(finalMonthly)}. Pays : ${country}.${options ? ` Options : ${options}.` : ""}`,
          details: {
            kind: "financement",
            vehicle_price: vehiclePrice,
            customer_type: customerType,
            product,
            duration_months: duration,
            upfront_amount: deposit,
            simulated_taeg: FINANCE_SIMULATED_TAEG,
            simulated_monthly: finalMonthly,
            warranty_extension: warrantyExtension,
            financial_loss_insurance: financialLoss,
            country,
          },
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-signal/30 bg-signal/5 px-6 py-8" role="status">
        <p className="font-display text-xl font-semibold text-ink">
          Votre simulation est entre nos mains
        </p>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Merci {name.trim()}. Mensualité indicative{" "}
          <strong className="text-navy">{formatPrice(finalMonthly)}</strong> sur{" "}
          {duration} mois. Nous présentons votre dossier à nos partenaires pour
          une réponse de principe rapide — sans engagement tant que vous n’avez
          pas signé d’offre de crédit.
        </p>
        <Link
          href={vehiclePath(vehicleSlug)}
          className="mt-6 inline-flex text-sm font-semibold text-orange hover:underline"
        >
          Retour à la fiche véhicule
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Widget simulateur */}
      <section
        className="space-y-6 rounded-xl border border-[#d0d9e6] bg-[var(--fin-bg,#fff)] p-4 sm:p-6"
        style={
          {
            "--fin-accent": "#ff6a00",
            "--fin-ink": "#0a2540",
            "--fin-muted": "#5a6b80",
            "--fin-track": "#e4ebf4",
          } as React.CSSProperties
        }
      >
        <header className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--fin-accent)]">
            Simulateur
          </p>
          <h2 className="font-display text-xl font-extrabold text-[var(--fin-ink)] sm:text-2xl">
            {isCredit
              ? "Paiement Étalé (Crédit Classique)"
              : FINANCE_PRODUCT_LABELS[product]}
          </h2>
          {isCredit ? (
            <p className="text-sm leading-relaxed text-[var(--fin-muted)]">
              Vous devenez <strong className="text-[var(--fin-ink)]">immédiatement propriétaire</strong>{" "}
              du véhicule. Étalez le règlement sur 36, 48 ou 60 mois. Un premier
              versement d’au moins{" "}
              <strong className="text-[var(--fin-ink)]">
                {Math.round(FINANCE_DEPOSIT_MIN_RATIO * 100)} %
              </strong>{" "}
              du prix est obligatoire.
            </p>
          ) : null}
        </header>

        <div className="flex flex-wrap items-end justify-between gap-2 rounded-lg bg-[#f4f6f9] px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--fin-muted)]">
              Prix du véhicule
            </p>
            <p className="font-display text-2xl font-extrabold text-[var(--fin-ink)]">
              {formatPrice(vehiclePrice)}
            </p>
          </div>
          <p className="text-xs text-[var(--fin-muted)]">
            TAEG simulé {(FINANCE_SIMULATED_TAEG * 100).toFixed(1)} %
          </p>
        </div>

        {/* Formule */}
        <div className="grid gap-2 sm:grid-cols-3">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProduct(p.id)}
              className={
                product === p.id
                  ? "rounded-lg border-2 border-[var(--fin-accent)] bg-orange/5 px-3 py-3 text-left"
                  : "rounded-lg border border-[#d0d9e6] bg-white px-3 py-3 text-left hover:border-orange/60"
              }
            >
              <span className="block text-sm font-bold text-[var(--fin-ink)]">
                {FINANCE_PRODUCT_LABELS[p.id]}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--fin-muted)]">
                {p.hint}
              </span>
            </button>
          ))}
        </div>

        {/* Curseur premier versement */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Label
              htmlFor="deposit-range"
              className="text-base font-semibold text-navy"
            >
              Votre versement de départ
            </Label>
            <p className="text-base font-semibold text-navy tabular-nums">
              {formatPrice(deposit)}
            </p>
          </div>
          <input
            id="deposit-range"
            type="range"
            min={depositMin}
            max={depositMax}
            step={50}
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="fin-range h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--fin-track)] accent-[var(--fin-accent)]"
            aria-valuemin={depositMin}
            aria-valuemax={depositMax}
            aria-valuenow={deposit}
          />
          <p className="text-[11px] leading-relaxed text-[#8a97a8]">
            ℹ️ Montant minimum requis (10 % du véhicule) permettant d’alléger vos
            mensualités suivantes.
          </p>
          <div className="flex justify-between text-[11px] text-[var(--fin-muted)]">
            <span>Min. {formatPrice(depositMin)}</span>
            <span>Max. {formatPrice(depositMax)}</span>
          </div>
          <p className="text-sm text-[var(--fin-muted)]">
            Montant financé :{" "}
            <strong className="text-[var(--fin-ink)]">
              {formatPrice(financedCapital)}
            </strong>
          </p>

          <aside className="rounded-lg border border-[#d0d9e6] bg-[#f7f9fc] px-3.5 py-3">
            <p className="text-[13px] leading-relaxed text-navy">
              <span className="font-semibold">
                Solution ouverte aux résidents et frontaliers européens :
              </span>{" "}
              Votre dossier est traité en temps réel et sans frais bancaires
              transfrontaliers. Vos IBAN européens (Belgique, Luxembourg,
              Allemagne, Suisse…) sont pleinement acceptés.
            </p>
          </aside>
        </div>

        {/* Durées */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--fin-ink)]">Durée</p>
          <div
            className="grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label="Durée du financement"
          >
            {DURATIONS.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={duration === m}
                onClick={() => setDuration(m)}
                className={
                  duration === m
                    ? "rounded-lg bg-[var(--fin-accent)] px-3 py-3 text-sm font-bold text-white"
                    : "rounded-lg border border-[#d0d9e6] bg-white px-3 py-3 text-sm font-semibold text-[var(--fin-ink)] hover:border-[var(--fin-accent)]"
                }
              >
                {m} mois
              </button>
            ))}
          </div>
        </div>

        {/* Garanties */}
        <div className="space-y-3">
          <p className="font-display text-base font-bold text-[var(--fin-ink)]">
            Garanties & sérénité
          </p>
          <label className="flex cursor-pointer gap-3 rounded-lg border border-[#d0d9e6] bg-white p-4 hover:border-orange/50">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[var(--fin-accent)]"
              checked={warrantyExtension}
              onChange={(e) => setWarrantyExtension(e.target.checked)}
            />
            <span className="flex-1">
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-[var(--fin-ink)]">
                  Extension de Garantie Panne Mécanique Européenne
                </span>
                <span className="text-sm font-bold text-[var(--fin-accent)]">
                  +{FINANCE_WARRANTY_MONTHLY} €/mois
                </span>
              </span>
              <span className="mt-1 block text-xs text-[var(--fin-muted)]">
                Pièces & main-d’œuvre, valable en Europe pendant la durée du
                financement.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded-lg border border-[#d0d9e6] bg-white p-4 hover:border-orange/50">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[var(--fin-accent)]"
              checked={financialLoss}
              onChange={(e) => setFinancialLoss(e.target.checked)}
            />
            <span className="flex-1">
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-[var(--fin-ink)]">
                  Assurance Perte Financière
                </span>
                <span className="text-sm font-bold text-[var(--fin-accent)]">
                  +{FINANCE_LOSS_INSURANCE_MONTHLY} €/mois
                </span>
              </span>
              <span className="mt-1 block text-xs text-[var(--fin-muted)]">
                Vol ou destruction : remboursement visant la valeur d’achat.
              </span>
            </span>
          </label>
        </div>

        {/* Résultat */}
        <div className="rounded-xl border-2 border-[var(--fin-accent)]/40 bg-orange/5 px-5 py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--fin-muted)]">
            Mensualité estimée
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold text-[var(--fin-ink)] sm:text-5xl">
            {formatPrice(finalMonthly)}
            <span className="ml-1 text-lg font-semibold text-[var(--fin-muted)]">
              / mois
            </span>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--fin-muted)]">
            Dont crédit {formatPrice(baseMonthly)}
            {optionsMonthly > 0
              ? ` + options ${formatPrice(optionsMonthly)}`
              : ""}{" "}
            · TAEG simulé {(FINANCE_SIMULATED_TAEG * 100).toFixed(1)} % · hors
            frais annexes éventuels. Simulation indicative — offre définitive
            sous réserve d’accord des partenaires.
          </p>
        </div>

        <p className="text-sm font-bold text-[var(--fin-ink)]">
          Un crédit vous engage et doit être remboursé. Vérifiez vos capacités
          de remboursement avant de vous engager.
        </p>
      </section>

      {/* Profil */}
      <fieldset className="space-y-3">
        <legend className="font-display text-lg font-bold text-navy">
          Votre profil
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["particulier", "Particulier"],
              ["professionnel", "Professionnel"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCustomerType(id)}
              className={
                customerType === id
                  ? "rounded-lg bg-orange px-3 py-3 text-sm font-bold text-white"
                  : "rounded-lg border border-[#d0d9e6] bg-white px-3 py-3 text-sm font-semibold text-navy hover:border-orange"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <aside className="rounded-lg border border-utility/30 bg-[#eef5fb] px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-wider text-utility">
          Clients européens & frontaliers
        </p>
        <p className="mt-2 text-sm leading-relaxed text-navy">
          Belgique, Luxembourg, Suisse, Allemagne… IBAN européens acceptés.
          Virements instantanés et Open Banking pour une instruction fluide.
        </p>
      </aside>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold text-navy">
          Vos coordonnées
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet / raison sociale</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Pays de résidence / siège</Label>
            <Input
              id="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Précisions (optionnel)</Label>
          <Textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </fieldset>

      {status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          Une erreur est survenue. Réessayez.
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="h-11 w-full bg-signal text-white hover:bg-signal/90 sm:w-auto sm:px-8"
      >
        {status === "sending" ? "Envoi…" : "Lancer mon étude gratuite"}
      </Button>

      <div className="space-y-3 border-t border-[#d0d9e6] pt-6 text-xs leading-relaxed text-[#5a6b80]">
        <p className="font-bold text-navy">
          Un crédit vous engage et doit être remboursé. Vérifiez vos capacités
          de remboursement avant de vous engager.
        </p>
        <p>
          Simulation indicative (TAEG {(FINANCE_SIMULATED_TAEG * 100).toFixed(1)}{" "}
          %) — ni offre de crédit ni engagement. L’offre définitive sera
          formalisée par l’organisme financeur. Délai de rétractation de{" "}
          <strong className="text-navy">14 jours</strong> calendaires le cas
          échéant (Code de la consommation).
        </p>
      </div>
    </form>
  );
}
