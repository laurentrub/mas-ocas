"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LeadHoneypot } from "@/components/lead-honeypot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const fuels = ["Essence", "Diesel", "Hybride", "Électrique", "Autre"] as const;

export function RepriseForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState<(typeof fuels)[number]>("Essence");
  const [plate, setPlate] = useState("");
  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 1 &&
      email.includes("@") &&
      brand.trim().length > 0 &&
      model.trim().length > 0
    );
  }, [name, email, brand, model]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");

    const vehicleLine = [
      brand.trim(),
      model.trim(),
      year.trim() ? `(${year.trim()})` : null,
      mileage.trim() ? `${mileage.trim()} km` : null,
      fuel,
      plate.trim() ? `immat. ${plate.trim().toUpperCase()}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const bodyMessage = [
      `Demande d’estimation de reprise.`,
      `Véhicule : ${vehicleLine}`,
      condition.trim() ? `État / historique : ${condition.trim()}` : null,
      message.trim() ? `Précisions : ${message.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reprise",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          interest: vehicleLine,
          sujet: "Reprise",
          message: bodyMessage,
          website: honeypot,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="border border-signal/30 bg-signal/5 px-6 py-8"
        role="status"
      >
        <p className="font-display text-xl font-semibold text-ink">
          Demande de reprise enregistrée
        </p>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Merci {name.trim()}. Nous revenons vers vous avec une estimation
          indicative sous 24 h ouvrées.
        </p>
        <Link
          href="/stock"
          className="mt-6 inline-flex text-sm font-semibold text-orange hover:underline"
        >
          Voir le stock
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <LeadHoneypot value={honeypot} onChange={setHoneypot} />

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold text-navy">
          Votre véhicule
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Marque</Label>
            <Input
              id="brand"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Renault"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Modèle</Label>
            <Input
              id="model"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Clio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Année</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2019"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mileage">Kilométrage</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="85000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuel">Énergie</Label>
            <select
              id="fuel"
              value={fuel}
              onChange={(e) =>
                setFuel(e.target.value as (typeof fuels)[number])
              }
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
            >
              {fuels.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate">Immatriculation (optionnel)</Label>
            <Input
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="AB-123-CD"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="condition">État / entretien</Label>
            <Textarea
              id="condition"
              rows={3}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="CT à jour, entretien récent, éventuels défauts…"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold text-navy">
          Vos coordonnées
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="message">Précisions</Label>
            <Textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Souhaitez-vous une reprise dans le cadre d’un achat chez nous ?"
            />
          </div>
        </div>
      </fieldset>

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
        {status === "sending" ? "Envoi…" : "Demander une estimation"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Estimation indicative — sans engagement. Vos données servent uniquement
        à traiter cette demande. Voir la{" "}
        <Link
          href="/politique-de-confidentialite"
          className="underline hover:text-navy"
        >
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}
