import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSessionStaff, isSupabaseConfigured } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=config");
  }

  const session = await getSessionStaff();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell access={session.access} email={session.user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
