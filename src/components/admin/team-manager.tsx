"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppRole } from "@/lib/supabase/database.types";

type Member = {
  id: string;
  email: string | null;
  created_at: string;
  roles: AppRole[];
};

export function TeamManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("conseiller");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur de chargement");
      setMembers([]);
    } else {
      setMembers(data.members ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createMember(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error || "Création impossible");
      return;
    }
    setEmail("");
    setPassword("");
    await load();
  }

  async function setMemberRole(userId: string, nextRole: AppRole) {
    const res = await fetch("/api/admin/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: nextRole }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Mise à jour impossible");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto border border-[#d0d9e6] bg-white">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-[#d0d9e6] bg-mist text-xs uppercase tracking-wide text-[#5a6b80]">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Rôles</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-[#5a6b80]">
                  Chargement…
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-b border-[#eef2f7]">
                  <td className="px-4 py-3">{m.email}</td>
                  <td className="px-4 py-3">{m.roles.join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      className="h-8 rounded border border-input px-2 text-xs"
                      value={m.roles[0] ?? "conseiller"}
                      onChange={(e) =>
                        void setMemberRole(m.id, e.target.value as AppRole)
                      }
                    >
                      <option value="super_admin">super_admin</option>
                      <option value="admin">admin</option>
                      <option value="conseiller">conseiller</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={createMember}
        className="max-w-lg space-y-4 border border-[#d0d9e6] bg-white p-5"
      >
        <h2 className="font-display text-lg font-bold text-navy">
          Créer un membre
        </h2>
        <p className="text-sm text-[#5a6b80]">
          Crée un compte avec e-mail + mot de passe temporaire. La personne se
          connecte sur{" "}
          <span className="font-medium text-navy">/admin/login</span> — pas via
          un lien d’invitation e-mail.
        </p>
        <div className="space-y-2">
          <Label htmlFor="team-email">Email</Label>
          <Input
            id="team-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-password">Mot de passe temporaire</Label>
          <Input
            id="team-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-role">Rôle</Label>
          <select
            id="team-role"
            value={role}
            onChange={(e) => setRole(e.target.value as AppRole)}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="conseiller">Conseiller</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </select>
        </div>
        <Button type="submit" disabled={creating}>
          {creating ? "Création…" : "Créer le compte"}
        </Button>
      </form>
    </div>
  );
}
