import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatMileage, formatPrice } from "@/lib/vehicles";
import { company, companyTelHref } from "@/lib/company";
import { PrintButton } from "@/components/admin/print-button";

type Props = { params: Promise<{ id: string }> };

type ScheduleRow = {
  label: string;
  amount: number;
  due_label: string;
};

function transferMotif(
  numero: string,
  client: { nom?: string | null; prenom?: string | null } | null,
  createdAt: string
) {
  const date = new Date(createdAt);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  const raw = `${client?.prenom ?? ""}${client?.nom ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 18);
  return raw ? `${raw}-${dd}${mm}${yy}` : `${numero}-${dd}${mm}${yy}`;
}

export default async function CommandePrintPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("purchase_orders")
    .select(
      "*, clients(*), bank_accounts(*), vehicles(brand, model, year, price, mileage, fuel, transmission, power, color, doors, seats, warranty_note, status)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const client = Array.isArray(order.clients) ? order.clients[0] : order.clients;
  const bank = Array.isArray(order.bank_accounts)
    ? order.bank_accounts[0]
    : order.bank_accounts;
  const vehicle = Array.isArray(order.vehicles)
    ? order.vehicles[0]
    : order.vehicles;

  const schedule = Array.isArray(order.installment_schedule)
    ? (order.installment_schedule as ScheduleRow[])
    : [];
  const installmentCount = order.installment_count ?? 1;
  const createdLabel = new Date(order.created_at).toLocaleDateString("fr-FR");
  const deliveryLabel = order.delivery_date
    ? new Date(order.delivery_date + "T12:00:00").toLocaleDateString("fr-FR")
    : null;
  const motif = transferMotif(order.numero, client, order.created_at);
  const telHref = companyTelHref();

  return (
    <div className="mx-auto max-w-[820px] bg-white p-8 text-[13px] leading-snug text-navy print:max-w-none print:p-0">
      <PrintButton />

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-navy pb-4">
        <div>
          <p className="font-display text-xl font-extrabold uppercase tracking-tight">
            {company.brand}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-orange">
            Bon de commande
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-base font-bold">
            N° {order.numero}
          </p>
          <p className="text-[#5a6b80]">· {createdLabel}</p>
        </div>
      </header>

      {/* Vendeur / Client */}
      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a6b80]">
            Vendeur
          </h2>
          <p className="mt-2 font-semibold">{company.brand}</p>
          <p>{company.legalName}</p>
          <p>{company.address.full}</p>
          {telHref ? <p>Tél. {company.phone}</p> : null}
          <p>{company.email}</p>
          <p className="mt-1 text-[#5a6b80]">
            {company.rcs.label}
            {company.siret ? ` · SIRET ${company.siret}` : ` · SIREN ${company.siren}`}
            {company.vatNumber ? ` · TVA ${company.vatNumber}` : ""}
          </p>
        </div>
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a6b80]">
            Client
          </h2>
          {client ? (
            <div className="mt-2">
              <p className="font-semibold">
                {client.prenom} {client.nom}
              </p>
              {(client.adresse || client.code_postal || client.ville) && (
                <p>
                  {[client.adresse, `${client.code_postal ?? ""} ${client.ville ?? ""}`.trim(), client.pays]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              <p>
                {[client.email, client.telephone ? `Tél. ${client.telephone}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-[#5a6b80]">—</p>
          )}
        </div>
      </section>

      {/* Véhicule */}
      <section className="mt-7">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a6b80]">
          Véhicule
        </h2>
        <table className="mt-2 w-full border-collapse">
          <thead>
            <tr className="border-b border-[#d0d9e6] text-left text-[11px] uppercase tracking-wide text-[#5a6b80]">
              <th className="py-2 font-semibold">Désignation</th>
              <th className="py-2 text-right font-semibold">Prix TTC</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#eef2f7]">
              <td className="py-3 font-semibold">
                {order.vehicle_label ||
                  (vehicle
                    ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
                    : "—")}
              </td>
              <td className="py-3 text-right font-extrabold">
                {formatPrice(Number(order.amount))}
              </td>
            </tr>
          </tbody>
        </table>
        {vehicle ? (
          <p className="mt-2 text-[12px] text-[#3d4f63]">
            {[
              `Marque : ${vehicle.brand}`,
              `Modèle : ${vehicle.model}`,
              `Année : ${vehicle.year}`,
              `Boîte : ${vehicle.transmission}`,
              `Carburant : ${vehicle.fuel}`,
              `KM : ${formatMileage(vehicle.mileage)}`,
              vehicle.power ? `Puissance : ${vehicle.power}` : null,
              vehicle.color ? `Couleur : ${vehicle.color}` : null,
              `Places : ${vehicle.seats}`,
              vehicle.warranty_note
                ? `Garantie : ${vehicle.warranty_note}`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
      </section>

      {/* Livraison */}
      {(deliveryLabel || order.delivery_place) && (
        <section className="mt-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a6b80]">
            Livraison
          </h2>
          <dl className="mt-2 grid gap-1 sm:grid-cols-[140px_1fr]">
            {deliveryLabel ? (
              <>
                <dt className="text-[#5a6b80]">Date prévue</dt>
                <dd className="font-medium">{deliveryLabel}</dd>
              </>
            ) : null}
            {order.delivery_place ? (
              <>
                <dt className="text-[#5a6b80]">Lieu</dt>
                <dd className="font-medium">{order.delivery_place}</dd>
              </>
            ) : null}
          </dl>
        </section>
      )}

      {/* Conditions financières */}
      <section className="mt-7">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a6b80]">
          Conditions financières
        </h2>
        <dl className="mt-2 grid gap-1 sm:grid-cols-[220px_1fr]">
          <dt className="text-[#5a6b80]">Prix TTC</dt>
          <dd className="font-semibold">{formatPrice(Number(order.amount))}</dd>
          <dt className="text-[#5a6b80]">Mode</dt>
          <dd className="font-medium">
            {installmentCount > 1
              ? `${installmentCount} fois (virement)`
              : "Comptant (virement)"}
          </dd>
          {schedule.length > 0 ? (
            schedule.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-[#5a6b80]">
                  {row.label} — {row.due_label}
                </dt>
                <dd className="font-semibold">
                  {formatPrice(Number(row.amount))}
                </dd>
              </div>
            ))
          ) : (
            <>
              <dt className="text-[#5a6b80]">Acompte</dt>
              <dd className="font-medium">
                {formatPrice(Number(order.deposit))}
              </dd>
              <dt className="text-[#5a6b80]">Solde</dt>
              <dd className="font-extrabold">
                {formatPrice(Number(order.balance))}
              </dd>
            </>
          )}
        </dl>
        {installmentCount > 1 ? (
          <p className="mt-3 text-[11px] leading-relaxed text-[#5a6b80]">
            Un crédit vous engage et doit être remboursé. Vérifiez vos capacités
            de remboursement avant de vous engager.
          </p>
        ) : null}
      </section>

      {/* RIB */}
      <section className="mt-7 rounded border border-orange/35 bg-orange/[0.06] p-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange">
          Coordonnées bancaires
        </h2>
        {bank ? (
          <div className="mt-2 space-y-1">
            <p>
              <span className="text-[#5a6b80]">Bénéficiaire :</span>{" "}
              {bank.account_holder}
            </p>
            {bank.bank_name ? (
              <p>
                <span className="text-[#5a6b80]">Banque :</span> {bank.bank_name}
              </p>
            ) : null}
            <p>
              <span className="text-[#5a6b80]">IBAN</span>{" "}
              <span className="font-mono font-semibold">{bank.iban}</span>
              {bank.bic ? (
                <>
                  {" · "}
                  <span className="text-[#5a6b80]">BIC</span>{" "}
                  <span className="font-mono">{bank.bic}</span>
                </>
              ) : null}
            </p>
            <p>
              <span className="text-[#5a6b80]">Motif du virement :</span>{" "}
              <span className="font-mono font-semibold">{motif}</span>
            </p>
            <p className="text-[11px] text-[#5a6b80]">
              Virement instantané conseillé
              {bank.instructions ? ` — ${bank.instructions}` : ""}
            </p>
          </div>
        ) : (
          <p className="mt-2">RIB non renseigné.</p>
        )}
      </section>

      {/* Notes */}
      {order.notes ? (
        <section className="mt-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a6b80]">
            Notes
          </h2>
          <p className="mt-2 whitespace-pre-wrap">{order.notes}</p>
        </section>
      ) : null}

      {/* Signatures */}
      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="min-h-[110px] border-t border-[#d0d9e6] pt-3">
          <p className="font-semibold">Bon pour accord — Signature client</p>
          <p className="mt-2 text-[#5a6b80]">Date : {createdLabel}</p>
        </div>
        <div className="min-h-[110px] border-t border-[#d0d9e6] pt-3">
          <p className="font-semibold">Signature vendeur</p>
          <p className="mt-1">
            {company.legalName} — {company.brand}
          </p>
          <p className="mt-2 text-[#5a6b80]">Date : {createdLabel}</p>
        </div>
      </section>

      <footer className="mt-8 border-t border-[#d0d9e6] pt-3 text-[10px] leading-relaxed text-[#5a6b80]">
        Le présent bon de commande vaut contrat de vente dès signature. Acceptation
        des CGV ({company.domain}/cgv). Les garanties légales (conformité, vices
        cachés) s&apos;appliquent. Les conditions de rétractation et d&apos;acompte
        figurent dans les CGV. Médiation : {company.domain}/mediation.
      </footer>
    </div>
  );
}
