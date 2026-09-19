"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { vehiclePath } from "@/lib/vehicles";

type Props = {
  vehicleSlug: string;
  vehicleLabel: string;
};

export function DeliveryRequestForm({ vehicleSlug, vehicleLabel }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
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
          type: "livraison",
          name,
          email,
          phone,
          vehicle_slug: vehicleSlug,
          interest: vehicleLabel,
          message:
            message.trim() ||
            `Demande de devis livraison pour ${vehicleLabel} à ${address}, ${postalCode} ${city}.`,
          details: {
            kind: "livraison",
            address,
            postal_code: postalCode,
            city,
            country: "France",
            preferred_date: preferredDate || undefined,
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
          Demande de livraison enregistrée
        </p>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Merci {name.trim()}. Nous préparons un{" "}
          <strong className="text-navy">devis / bon de commande</strong> de
          livraison vers {city} et vous le transmettons.
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
        Indiquez l’adresse de livraison. Un devis / bon de commande vous sera
        édité et envoyé avant validation.
      </p>

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
        <Label htmlFor="address">Adresse de livraison</Label>
        <Input
          id="address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="12 rue…"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postal">Code postal</Label>
          <Input
            id="postal"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_date">Date souhaitée (optionnel)</Label>
        <Input
          id="preferred_date"
          type="date"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Précisions (optionnel)</Label>
        <Textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Étage, digicode, créneau préféré…"
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
        {status === "sending" ? "Envoi…" : "Demander un devis livraison"}
      </Button>
    </form>
  );
}
