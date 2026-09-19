import {
  deleteBankAccountAction,
  saveBankAccountAction,
} from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { getSessionStaff } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminRibPage() {
  const session = await getSessionStaff();
  if (!session?.access.canManageRib) redirect("/admin");

  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("bank_accounts")
    .select("*")
    .order("is_default", { ascending: false });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Comptes bancaires (RIB)
        </h1>
        <p className="mt-2 text-[#5a6b80]">
          Plusieurs RIB possibles — sélectionnés sur chaque bon de commande
          (paiement par virement).
        </p>
      </header>

      <ul className="space-y-3">
        {(accounts ?? []).map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-start justify-between gap-4 border border-[#d0d9e6] bg-white p-4"
          >
            <div>
              <p className="font-display text-lg font-bold text-navy">
                {a.label}
                {a.is_default ? (
                  <span className="ml-2 text-xs font-semibold uppercase text-orange">
                    Défaut
                  </span>
                ) : null}
              </p>
              <p className="text-sm text-[#5a6b80]">{a.account_holder}</p>
              <p className="mt-1 font-mono text-sm">{a.iban}</p>
              {a.bic ? (
                <p className="font-mono text-xs text-[#5a6b80]">BIC {a.bic}</p>
              ) : null}
              {a.bank_name ? (
                <p className="text-sm text-[#5a6b80]">{a.bank_name}</p>
              ) : null}
            </div>
            <form action={deleteBankAccountAction}>
              <input type="hidden" name="id" value={a.id} />
              <Button type="submit" variant="destructive" size="sm">
                Supprimer
              </Button>
            </form>
          </li>
        ))}
      </ul>

      <section className="border border-[#d0d9e6] bg-white p-5">
        <h2 className="font-display text-xl font-bold text-navy">
          Ajouter un RIB
        </h2>
        <form action={saveBankAccountAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="label">Libellé</Label>
            <Input id="label" name="label" required placeholder="Compte principal" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_holder">Titulaire</Label>
            <Input id="account_holder" name="account_holder" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_name">Banque</Label>
            <Input id="bank_name" name="bank_name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input id="iban" name="iban" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bic">BIC</Label>
            <Input id="bic" name="bic" />
          </div>
          <div className="flex items-center gap-2 self-end pb-2">
            <input id="is_default" name="is_default" type="checkbox" />
            <Label htmlFor="is_default">RIB par défaut</Label>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="instructions">Instructions virement</Label>
            <Textarea id="instructions" name="instructions" rows={2} />
          </div>
          <div>
            <Button type="submit">Enregistrer le RIB</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
