"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  bulkDeleteVehiclesAction,
  bulkUpdateVehicleStatusAction,
} from "@/app/admin/(dashboard)/actions";
import { AdminVehicleThumb } from "@/components/admin/vehicle-thumb";
import { Button } from "@/components/ui/button";
import { formatMileage, formatPrice } from "@/lib/vehicles";
import type { VehicleStatus } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

export type StockVehicleRow = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number | string;
  mileage: number;
  status: VehicleStatus;
  source: string;
  image: string | null;
  image_alt: string | null;
};

const STATUSES: VehicleStatus[] = [
  "Disponible",
  "Réservé",
  "Livraison sous 48h",
  "Vendu",
];

type Props = {
  vehicles: StockVehicleRow[];
  canDelete: boolean;
};

export function StockVehiclesTable({ vehicles, canDelete }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [bulkStatus, setBulkStatus] = useState<VehicleStatus>("Disponible");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allIds = useMemo(() => vehicles.map((v) => v.id), [vehicles]);
  const selectedCount = selected.size;
  const allSelected = allIds.length > 0 && selectedCount === allIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  function toggleAll() {
    setSelected((prev) => {
      if (prev.size === allIds.length) return new Set();
      return new Set(allIds);
    });
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function appendSelectedIds(form: FormData) {
    for (const id of selected) form.append("ids", id);
  }

  function onBulkStatus() {
    if (!selectedCount) return;
    setError(null);
    const form = new FormData();
    appendSelectedIds(form);
    form.set("status", bulkStatus);
    startTransition(async () => {
      try {
        await bulkUpdateVehicleStatusAction(form);
        setSelected(new Set());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de la mise à jour");
      }
    });
  }

  function onBulkDelete() {
    if (!selectedCount || !canDelete) return;
    const ok = window.confirm(
      `Supprimer ${selectedCount} véhicule${selectedCount > 1 ? "s" : ""} ? Cette action est définitive.`
    );
    if (!ok) return;
    setError(null);
    const form = new FormData();
    appendSelectedIds(form);
    startTransition(async () => {
      try {
        await bulkDeleteVehiclesAction(form);
        setSelected(new Set());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de la suppression");
      }
    });
  }

  return (
    <div className="space-y-3">
      {selectedCount > 0 ? (
        <div className="flex flex-wrap items-center gap-3 border border-[#d0d9e6] bg-white px-4 py-3">
          <p className="text-sm font-semibold text-navy">
            {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
          </p>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as VehicleStatus)}
            disabled={pending}
            className="flex h-8 rounded-lg border border-[#d0d9e6] bg-transparent px-2 text-sm"
            aria-label="Nouveau statut"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={onBulkStatus}
          >
            Appliquer le statut
          </Button>
          {canDelete ? (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={onBulkDelete}
            >
              Supprimer
            </Button>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={() => setSelected(new Set())}
            className="text-sm font-medium text-[#5a6b80] hover:text-navy hover:underline"
          >
            Tout désélectionner
          </button>
          {pending ? (
            <span className="text-xs text-[#5a6b80]">Traitement…</span>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto border border-[#d0d9e6] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#d0d9e6] bg-mist text-xs uppercase tracking-wide text-[#5a6b80]">
            <tr>
              <th className="w-10 px-3 py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={!vehicles.length || pending}
                  aria-label="Tout sélectionner"
                  className="size-4 accent-orange"
                />
              </th>
              <th className="px-4 py-3 font-semibold">Véhicule</th>
              <th className="px-4 py-3 font-semibold">Prix</th>
              <th className="px-4 py-3 font-semibold">Km</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const isOn = selected.has(v.id);
              return (
                <tr
                  key={v.id}
                  className={cn(
                    "border-b border-[#eef2f7]",
                    isOn && "bg-orange/5"
                  )}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggleOne(v.id)}
                      disabled={pending}
                      aria-label={`Sélectionner ${v.brand} ${v.model}`}
                      className="size-4 accent-orange"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AdminVehicleThumb
                        src={v.image}
                        alt={v.image_alt || `${v.brand} ${v.model}`}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-navy">
                          {v.brand} {v.model}
                        </p>
                        <p className="text-xs text-[#5a6b80]">{v.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(Number(v.price))}
                  </td>
                  <td className="px-4 py-3">{formatMileage(v.mileage)}</td>
                  <td className="px-4 py-3">{v.status}</td>
                  <td className="px-4 py-3 text-[#5a6b80]">{v.source}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/stock/${v.id}`}
                      className="font-semibold text-orange hover:underline"
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!vehicles.length ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-[#5a6b80]"
                >
                  Aucun véhicule. Cliquez sur Ajouter pour en créer un.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
