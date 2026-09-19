import { updateLeadStatusAction } from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/vehicles";
import type { LeadDetails } from "@/lib/demandes";
import {
  buildInstallmentSchedule,
  buildMonthlyCapitalPreview,
  FINANCE_CUSTOMER_LABELS,
  FINANCE_PRODUCT_LABELS,
} from "@/lib/demandes";

const statusOptions = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_cours", label: "En cours" },
  { value: "traite", label: "Traité" },
  { value: "archive", label: "Archivé" },
] as const;

function LeadDetailsBlock({ details }: { details: LeadDetails | null }) {
  if (!details) return null;

  if (details.kind === "visite") {
    return (
      <div className="mt-3 rounded-lg bg-mist px-3 py-2 text-sm text-navy">
        <p className="font-semibold">Créneau souhaité</p>
        <p>
          {new Date(details.preferred_date + "T12:00:00").toLocaleDateString(
            "fr-FR",
            { weekday: "long", day: "numeric", month: "long", year: "numeric" }
          )}{" "}
          — {details.preferred_slot === "matin" ? "matin" : "après-midi"}
        </p>
        <p className="mt-1 text-xs text-[#5a6b80]">
          À confirmer par téléphone / e-mail.
        </p>
      </div>
    );
  }

  if (details.kind === "livraison") {
    return (
      <div className="mt-3 rounded-lg bg-mist px-3 py-2 text-sm text-navy">
        <p className="font-semibold">Adresse de livraison</p>
        <p>{details.address}</p>
        <p>
          {details.postal_code} {details.city}
          {details.country ? ` · ${details.country}` : ""}
        </p>
        {details.preferred_date ? (
          <p className="mt-1 text-xs text-[#5a6b80]">
            Date souhaitée :{" "}
            {new Date(details.preferred_date + "T12:00:00").toLocaleDateString(
              "fr-FR"
            )}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-[#5a6b80]">
          Éditer un devis / bon de commande livraison.
        </p>
      </div>
    );
  }

  if (details.kind === "financement") {
    if (details.product && details.duration_months) {
      const capital = Math.max(
        0,
        details.vehicle_price - (details.upfront_amount ?? 0)
      );
      const preview = buildMonthlyCapitalPreview(
        capital,
        details.duration_months
      );
      return (
        <div className="mt-3 rounded-lg bg-mist px-3 py-2 text-sm text-navy">
          <p className="font-semibold">
            {FINANCE_PRODUCT_LABELS[details.product]} ·{" "}
            {FINANCE_CUSTOMER_LABELS[details.customer_type]}
          </p>
          <p className="mt-1 text-xs text-[#5a6b80]">
            {details.duration_months} mois · Prix{" "}
            {formatPrice(details.vehicle_price)}
            {typeof details.upfront_amount === "number" ? (
              <>
                {" "}
                · 1ʳᵉ versement {formatPrice(details.upfront_amount)}
              </>
            ) : null}
            {typeof details.simulated_monthly === "number" ? (
              <>
                {" "}
                · mensualité ≈ {formatPrice(details.simulated_monthly)}
              </>
            ) : (
              <> · base capital ≈ {formatPrice(preview.monthly)}/mois</>
            )}
            {details.country ? ` · ${details.country}` : ""}
          </p>
          <ul className="mt-2 space-y-0.5 text-xs text-[#5a6b80]">
            {typeof details.first_monthly_amount === "number" ? (
              <li>
                1ʳᵉ mensualité souhaitée :{" "}
                {formatPrice(details.first_monthly_amount)}
              </li>
            ) : null}
            {details.warranty_extension ? (
              <li>✓ Extension garantie panne mécanique</li>
            ) : null}
            {details.financial_loss_insurance ? (
              <li>✓ Assurance perte financière</li>
            ) : null}
          </ul>
          <p className="mt-1 text-xs text-[#5a6b80]">
            Simulation — accord sous réserve des partenaires financiers.
          </p>
        </div>
      );
    }

    const n = details.installments ?? 3;
    const schedule = buildInstallmentSchedule(details.vehicle_price, n);
    return (
      <div className="mt-3 rounded-lg bg-mist px-3 py-2 text-sm text-navy">
        <p className="font-semibold">
          Simulation {n}× — {formatPrice(details.vehicle_price)}
        </p>
        <ul className="mt-2 space-y-1 text-xs">
          {schedule.map((row) => (
            <li key={row.label} className="flex justify-between gap-2">
              <span>{row.label}</span>
              <span className="font-semibold">{formatPrice(row.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Demandes
        </h1>
        <p className="mt-2 text-[#5a6b80]">
          Visites, livraisons, paiements fractionnés et contacts.
        </p>
      </header>

      <ul className="space-y-3">
        {(leads ?? []).map((lead) => {
          const details = lead.details as LeadDetails | null;
          return (
            <li
              key={lead.id}
              className="border border-[#d0d9e6] bg-white p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange">
                    {lead.type} · {lead.status}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-navy">
                    {lead.name}
                  </p>
                  <p className="text-sm text-[#5a6b80]">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:underline"
                    >
                      {lead.email}
                    </a>
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                  {lead.interest || lead.vehicle_slug ? (
                    <p className="mt-1 text-sm text-navy">
                      Véhicule : {lead.interest || lead.vehicle_slug}
                      {lead.vehicle_slug ? (
                        <>
                          {" · "}
                          <a
                            href={`/vehicules/${lead.vehicle_slug}`}
                            className="font-semibold text-orange hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            fiche
                          </a>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </div>
                <p className="text-xs text-[#5a6b80]">
                  {new Date(lead.created_at).toLocaleString("fr-FR")}
                </p>
              </div>

              <LeadDetailsBlock details={details} />

              {lead.message ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#3d4f63]">
                  {lead.message}
                </p>
              ) : null}
              <form
                action={updateLeadStatusAction}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                <input type="hidden" name="id" value={lead.id} />
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="sm" variant="outline">
                  Mettre à jour
                </Button>
                {lead.type === "livraison" || lead.type === "financement" ? (
                  <a
                    href={`/admin/commandes/new?lead=${lead.id}`}
                    className="inline-flex h-7 items-center rounded-lg bg-orange px-2.5 text-xs font-semibold text-white"
                  >
                    Créer un BDC
                  </a>
                ) : null}
              </form>
            </li>
          );
        })}
        {!leads?.length ? (
          <li className="border border-dashed border-[#d0d9e6] bg-white px-4 py-10 text-center text-[#5a6b80]">
            Aucune demande pour le moment.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
