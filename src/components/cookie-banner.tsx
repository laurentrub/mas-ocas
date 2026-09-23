"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mas-ocas-cookie-ack";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Informations cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#d0d9e6] bg-white p-4 shadow-[0_-8px_30px_rgb(12_35_64/0.12)] sm:p-5"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[#3d4f63]">
          Ce site utilise uniquement des cookies strictement nécessaires au
          fonctionnement (session, sécurité). Aucun cookie publicitaire.{" "}
          <Link
            href="/cookies"
            className="font-semibold text-orange hover:underline"
          >
            Politique cookies
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-orange px-5 text-sm font-bold text-white hover:bg-[#e05f00]"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
