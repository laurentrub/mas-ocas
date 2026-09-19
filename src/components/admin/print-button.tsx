"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mb-8 rounded-lg bg-orange px-4 py-2 text-sm font-bold text-white print:hidden"
    >
      Imprimer / Enregistrer en PDF
    </button>
  );
}
