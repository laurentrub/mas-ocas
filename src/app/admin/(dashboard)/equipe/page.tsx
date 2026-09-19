import { redirect } from "next/navigation";
import { getSessionStaff } from "@/lib/auth/session";
import { TeamManager } from "@/components/admin/team-manager";

export default async function AdminEquipePage() {
  const session = await getSessionStaff();
  if (!session?.access.canManageTeam) redirect("/admin");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Équipe
        </h1>
        <p className="mt-2 text-[#5a6b80]">
          Super admin uniquement — créer des comptes admin et conseillers.
        </p>
      </header>
      <TeamManager />
    </div>
  );
}
