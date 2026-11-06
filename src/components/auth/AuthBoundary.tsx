
import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/permissions";

type Props = {
  children: ReactNode;
  requiredRole?: "USER" | "ADMIN";
  fallback?: ReactNode;
  redirectTo?: string;
};

async function AuthContent({
  children,
  requiredRole,
  redirectTo,
}: Props) {
  // Attend une requête réelle avant de lire la session.
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo ?? "/login");
  }

  if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
    redirect("/");
  }

  return children;
}

export default function AuthBoundary({
  children,
  requiredRole,
  fallback = <p>Chargement...</p>,
  redirectTo,
}: Props) {
  return (
    <Suspense fallback={fallback}>
      <AuthContent
        requiredRole={requiredRole}
        redirectTo={redirectTo}
      >
        {children}
      </AuthContent>
    </Suspense>
  );
}
