import Link from "next/link";
import { notFound } from "next/navigation";
import { updateClientAction } from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/vehicles";

type Props = { params: Promise<{ id: string }> };

export default async function AdminClientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: client }, { data: orders }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("purchase_orders")
      .select("id, numero, vehicle_label, amount, status, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            {client.prenom} {client.nom}
          </h1>
          <p className="mt-1 text-sm text-[#5a6b80]">
            Client depuis{" "}
            {new Date(client.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <Link
          href="/admin/clients"
          className="inline-flex h-8 items-center rounded-lg border border-[#d0d9e6] px-3 text-sm font-medium"
        >
          Retour
        </Link>
      </div>

      <form
        action={updateClientAction}
        className="space-y-4 border border-[#d0d9e6] bg-white p-5"
      >
        <input type="hidden" name="id" value={client.id} />
        <h2 className="font-display text-lg font-bold text-navy">
          Coordonnées
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" name="prenom" defaultValue={client.prenom} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" required defaultValue={client.nom} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={client.email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              defaultValue={client.telephone ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              name="adresse"
              defaultValue={client.adresse ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code_postal">Code postal</Label>
            <Input
              id="code_postal"
              name="code_postal"
              defaultValue={client.code_postal ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ville">Ville</Label>
            <Input id="ville" name="ville" defaultValue={client.ville ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pays">Pays</Label>
            <Input id="pays" name="pays" defaultValue={client.pays ?? "France"} />
          </div>
        </div>
        <Button type="submit">Enregistrer</Button>
      </form>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-navy">
          Bons de commande
        </h2>
        <ul className="space-y-2">
          {(orders ?? []).map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-[#d0d9e6] bg-white px-4 py-3"
            >
              <div>
                <p className="font-mono text-xs text-[#5a6b80]">{o.numero}</p>
                <p className="font-semibold text-navy">
                  {o.vehicle_label ?? "—"}
                </p>
                <p className="text-sm text-[#5a6b80]">
                  {formatPrice(Number(o.amount))} · {o.status}
                </p>
              </div>
              <Link
                href={`/admin/commandes/${o.id}`}
                className="text-sm font-semibold text-orange hover:underline"
              >
                Voir
              </Link>
            </li>
          ))}
          {!orders?.length ? (
            <li className="border border-dashed border-[#d0d9e6] bg-white px-4 py-8 text-center text-[#5a6b80]">
              Aucun bon de commande lié.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
