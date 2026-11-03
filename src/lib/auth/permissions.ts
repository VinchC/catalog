// Ce module ne doit être utilisé que côté serveur.
import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Récupère l'utilisateur actuellement connecté.
 *
 * Retourne null si aucun utilisateur n'est connecté.
 */
export async function getCurrentUser() {
  const session = await auth();

  return session?.user ?? null;
}

/**
 * Vérifie qu'un utilisateur est connecté.
 *
 * Si personne n'est connecté, redirige vers la page de connexion.
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Vérifie que l'utilisateur connecté possède le rôle ADMIN.
 *
 * Si l'utilisateur n'est pas connecté, requireUser() le redirige
 * vers la page de connexion.
 *
 * Si l'utilisateur est connecté mais n'est pas ADMIN,
 * il est redirigé vers l'accueil.
 */
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}