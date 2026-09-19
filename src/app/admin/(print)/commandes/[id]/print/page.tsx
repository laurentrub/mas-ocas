import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/vehicles";
import { company } from "@/lib/company";
import { PrintButton } from "@/components/admin/print-button";

type Props = { params: Promise<{ id: string }> };

export default async function CommandePrintPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("purchase_orders")
    .select("*, clients(*), bank_accounts(*)")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const client = Array.isArray(order.clients) ? order.clients[0] : order.clients;
  const bank = Array.isArray(order.bank_accounts)
    ? order.bank_accounts[0]
    : order.bank_accounts;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-10 text-navy print:p-6">
      <PrintButton />

      <header className="flex justify-between border-b border-[#d0d9e6] pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange">
            Bon de commande
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">{company.brand}</h1>
          <p className="mt-1 text-sm text-[#5a6b80]">{company.legalName}</p>
          <p className="text-sm text-[#5a6b80]">{company.address.full}</p>
          <p className="text-sm text-[#5a6b80]">{company.rcs.label}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-bold">{order.numero}</p>
          <p className="text-sm text-[#5a6b80]">
            {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
            Acheteur
          </h2>
          {client ? (
            <div className="mt-2 text-sm leading-relaxed">
              <p className="font-semibold">
                {client.prenom} {client.nom}
              </p>
              <p>{client.email}</p>
              <p>{client.telephone}</p>
              <p>{client.adresse}</p>
              <p>
                {client.code_postal} {client.ville}
              </p>
            </div>
          ) : null}
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
            Véhicule
          </h2>
          <p className="mt-2 font-semibold">{order.vehicle_label}</p>
        </div>
      </section>

      <section className="mt-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#d0d9e6] text-left">
              <th className="py-2">Désignation</th>
              <th className="py-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#eef2f7]">
              <td className="py-3">{order.vehicle_label}</td>
              <td className="py-3 text-right font-semibold">
                {formatPrice(Number(order.amount))}
              </td>
            </tr>
            {Array.isArray(order.installment_schedule) &&
            order.installment_schedule.length > 0 ? (
              (
                order.installment_schedule as {
                  label: string;
                  amount: number;
                  due_label: string;
                }[]
              ).map((row) => (
                <tr key={row.label} className="border-b border-[#eef2f7]">
                  <td className="py-2 text-[#5a6b80]">
                    {row.label}
                    <span className="mt-0.5 block text-xs">{row.due_label}</span>
                  </td>
                  <td className="py-2 text-right">
                    {formatPrice(Number(row.amount))}
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td className="py-2 text-[#5a6b80]">Acompte</td>
                  <td className="py-2 text-right">
                    {formatPrice(Number(order.deposit))}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-bold">Solde à payer</td>
                  <td className="py-2 text-right text-lg font-extrabold">
                    {formatPrice(Number(order.balance))}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-8 rounded border border-orange/40 bg-orange/5 p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-orange">
          Paiement par virement bancaire
        </h2>
        {bank ? (
          <div className="mt-3 space-y-1 text-sm">
            <p>
              <strong>Compte :</strong> {bank.label}
            </p>
            <p>
              <strong>Titulaire :</strong> {bank.account_holder}
            </p>
            {bank.bank_name ? (
              <p>
                <strong>Banque :</strong> {bank.bank_name}
              </p>
            ) : null}
            <p>
              <strong>IBAN :</strong>{" "}
              <span className="font-mono">{bank.iban}</span>
            </p>
            {bank.bic ? (
              <p>
                <strong>BIC :</strong>{" "}
                <span className="font-mono">{bank.bic}</span>
              </p>
            ) : null}
            {bank.instructions ? (
              <p className="mt-2 text-[#5a6b80]">{bank.instructions}</p>
            ) : null}
            <p className="mt-2 text-xs text-[#5a6b80]">
              Merci d’indiquer la référence {order.numero} dans le libellé du
              virement.
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm">RIB non renseigné.</p>
        )}
      </section>

      {order.notes ? (
        <section className="mt-6 text-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5a6b80]">
            Notes
          </h2>
          <p className="mt-2 whitespace-pre-wrap">{order.notes}</p>
        </section>
      ) : null}

      <footer className="mt-12 border-t border-[#d0d9e6] pt-4 text-xs text-[#5a6b80]">
        Document généré par {company.brand} — {company.address.full}
      </footer>
    </div>
  );
}
