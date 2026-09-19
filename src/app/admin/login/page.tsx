import { Suspense } from "react";
import AdminLoginPage from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-navy text-white">
          Chargement…
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
