"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
type FormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const vehiculeParam = searchParams.get("vehicule") ?? "";
  const sujetParam = searchParams.get("sujet") ?? "";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    interest: vehiculeParam || sujetParam || "Stock général",
    message: vehiculeParam
      ? sujetParam === "Financement"
        ? `Bonjour,\n\nJe souhaite une simulation de financement pour le véhicule suivant : ${vehiculeParam}.\n\nCordialement`
        : sujetParam === "Livraison"
          ? `Bonjour,\n\nJe souhaite un devis de livraison pour le véhicule suivant : ${vehiculeParam}.\n\nCordialement`
          : sujetParam === "Rendez-vous"
            ? `Bonjour,\n\nJe souhaite prendre rendez-vous pour un essai du véhicule suivant : ${vehiculeParam}.\n\nCordialement`
            : sujetParam === "Rappel"
              ? `Bonjour,\n\nMerci de me rappeler au sujet du véhicule suivant : ${vehiculeParam}.\n\nCordialement`
              : `Bonjour,\n\nJe souhaite des informations sur le véhicule suivant : ${vehiculeParam}.\n\nCordialement`
      : sujetParam === "Reprise"
        ? "Bonjour,\n\nJe souhaite une estimation pour une reprise de véhicule.\n\nCordialement"
        : sujetParam === "Financement"
          ? "Bonjour,\n\nJe souhaite faire une simulation de financement.\n\nCordialement"
          : sujetParam === "Livraison"
            ? "Bonjour,\n\nJe souhaite un devis de livraison pour un véhicule.\n\nCordialement"
            : sujetParam === "Rendez-vous"
              ? "Bonjour,\n\nJe souhaite prendre rendez-vous pour un essai.\n\nCordialement"
              : sujetParam === "Rappel"
                ? "Bonjour,\n\nMerci de me rappeler.\n\nCordialement"
                : "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      form.email.includes("@") &&
      form.message.trim().length > 10
    );
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    // Frontend-only slice: simulate envoi réussi
    await new Promise((r) => setTimeout(r, 700));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        className="border border-signal/30 bg-signal/5 px-6 py-8"
        role="status"
      >
        <p className="font-display text-xl font-semibold text-ink">
          Demande enregistrée
        </p>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Merci {form.name.trim()}. Nous avons bien reçu votre message concernant
          « {form.interest} ». Un conseiller MAS OCAS AUTO vous recontacte sous
          24 h ouvrées.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            setStatus("idle");
            setForm((prev) => ({ ...prev, message: "" }));
          }}
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Camille Dupont"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="camille@email.fr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interest">Sujet</Label>
        <select
          id="interest"
          name="interest"
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={form.interest}
          onChange={(e) => setForm({ ...form, interest: e.target.value })}
        >
          <option value="Stock général">Stock général</option>
          <option value="Rendez-vous">Demande de rendez-vous</option>
          <option value="Livraison">Livraison</option>
          <option value="Financement">Financement</option>
          <option value="Rappel">Demande de rappel</option>
          <option value="Reprise de véhicule">Reprise de véhicule</option>
          {vehiculeParam ? (
            <option value={vehiculeParam}>{vehiculeParam}</option>
          ) : null}
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Décrivez le véhicule recherché, votre budget ou une question précise…"
        />
      </div>

      {status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          Une erreur est survenue. Réessayez dans un instant.
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit || status === "sending"}
        className="h-11 w-full bg-signal text-primary-foreground hover:bg-signal/90 sm:w-auto sm:px-8"
      >
        {status === "sending" ? "Envoi…" : "Envoyer la demande"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Formulaire vitrine : aucun envoi serveur dans cette version. Vos données
        restent dans le navigateur.
      </p>
    </form>
  );
}
