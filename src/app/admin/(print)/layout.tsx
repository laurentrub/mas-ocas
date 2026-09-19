import { redirect } from "next/navigation";
import { getSessionStaff, isSupabaseConfigured } from "@/lib/auth/session";

export default async function PrintLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=config");
  const session = await getSessionStaff();
  if (!session) redirect("/admin/login");
  return <>{children}</>;
}
