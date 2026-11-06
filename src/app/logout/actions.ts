"use server";

import { signOut } from "@/auth";

// Déconnecte l'utilisateur et le redirige vers l'accueil
export async function logout() {
  await signOut({
    redirectTo: "/",
  });
}
