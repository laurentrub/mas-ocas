"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function FbImportButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onFile(file: File) {
    setLoading(true);
    setStatus(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/admin/import-fb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import échoué");
      setStatus(`Importé : ${data.upserted} véhicule(s)`);
      window.location.reload();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Erreur d’import");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? "Import…" : "Importer Facebook (JSON)"}
      </Button>
      {status ? (
        <p className="max-w-[220px] text-right text-xs text-[#5a6b80]">
          {status}
        </p>
      ) : null}
    </div>
  );
}
