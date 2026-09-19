import type { AppRole } from "@/lib/supabase/database.types";

/** Email du super admin (Thierry) — override via env. */
export function getSuperAdminEmail() {
  return (
    process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() ||
    "thierry@mas-ocas-auto.com"
  );
}

export function isPrivilegedSuperAdmin(email?: string | null) {
  if (!email) return false;
  return email.trim().toLowerCase() === getSuperAdminEmail();
}

export type StaffAccess = {
  roles: AppRole[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isConseiller: boolean;
  isStaff: boolean;
  canManageTeam: boolean;
  canManageRib: boolean;
  canDeleteVehicles: boolean;
};

export function deriveAccess(
  roles: AppRole[],
  email?: string | null
): StaffAccess {
  const privileged = isPrivilegedSuperAdmin(email);
  const isSuperAdmin = privileged || roles.includes("super_admin");
  const isAdmin = isSuperAdmin || roles.includes("admin");
  const isConseiller = roles.includes("conseiller");
  const isStaff = isSuperAdmin || isAdmin || isConseiller;

  return {
    roles: privileged && !roles.includes("super_admin")
      ? (["super_admin", ...roles] as AppRole[])
      : roles,
    isSuperAdmin,
    isAdmin,
    isConseiller,
    isStaff,
    canManageTeam: isSuperAdmin,
    canManageRib: isAdmin,
    canDeleteVehicles: isAdmin,
  };
}
