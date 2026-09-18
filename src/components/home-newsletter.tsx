"use client";

import { FormEvent, useState } from "react";

export function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    setEmail("");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      noValidate
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Adresse e-mail
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        placeholder="votre@email.fr"
        className="h-12 flex-1 rounded-lg border border-[#c5d0de] bg-white px-4 text-[15px] text-navy outline-none placeholder:text-[#9aa8ba] focus:border-orange focus:ring-2 focus:ring-orange/25"
      />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
      >
        S&apos;inscrire
      </button>
      {status === "ok" ? (
        <p className="sr-only" role="status">
          Inscription enregistrée
        </p>
      ) : null}
      {status === "error" ? (
        <p className="basis-full text-sm text-red-700" role="alert">
          Indiquez une adresse e-mail valide.
        </p>
      ) : null}
      {status === "ok" ? (
        <p className="basis-full text-sm font-medium text-navy" role="status">
          Merci — vous serez informé(e) des prochains arrivages.
        </p>
      ) : null}
    </form>
  );
}
