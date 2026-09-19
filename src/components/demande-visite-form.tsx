"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { VisitSlot } from "@/lib/demandes";
import { vehiclePath } from "@/lib/vehicles";

type Props = {
  vehicleSlug: string;
  vehicleLabel: string;
};

export function VisitRequestForm({ vehicleSlug, vehicleLabel }: Props) {
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState(tomorrow);
  const [slot, setSlot] = useState<VisitSlot>("matin");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "visite",
          name,
          email,
          phone,
          vehicle_slug: vehicleSlug,
          interest: vehicleLabel,
          message:
            message.trim() ||
            `Demande de rendez-vous pour voir ${vehicleLabel} le ${preferredDate} (${slot}).`,
          details: {
            kind: "visite",
            preferred_date: preferredDate,
            preferred_slot: slot,
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
          Demande de rendez-vous enregistrée
        </p>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Merci {name.trim()}. Nous vous recontactons pour confirmer le créneau
          (le {preferredDate}, {slot === "matin" ? "matin" : "après-midi"}).
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
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="rounded-lg bg-mist px-4 py-3 text-sm text-[#5a6b80]">
        Choisissez une date et un créneau souhaités. Un conseiller MAS OCAS AUTO
        vous contactera pour <strong className="text-navy">confirmer</strong> le
        rendez-vous — ce n’est pas une réservation définitive.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="preferred_date">Date souhaitée</Label>
          <Input
            id="preferred_date"
            type="date"
            required
            min={tomorrow}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot">Créneau</Label>
          <select
            id="slot"
            value={slot}
            onChange={(e) => setSlot(e.target.value as VisitSlot)}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="matin">Matin (9h30 – 12h30)</option>
            <option value="apres-midi">Après-midi (14h – 18h30)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
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
        <Label htmlFor="message">Message (optionnel)</Label>
        <Textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Précisions utiles (disponibilités alternatives…)"
        />
      </div>

      {status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          Une erreur est survenue. Réessayez.
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="h-11 bg-signal text-white hover:bg-signal/90"
      >
        {status === "sending" ? "Envoi…" : "Demander le rendez-vous"}
      </Button>
    </form>
  );
}
