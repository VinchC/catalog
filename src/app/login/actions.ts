"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// État retourné au formulaire en cas d'erreur
export type LoginState = {
  error?: string;
};

// Authentification de l'utilisateur
export async function authenticate(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  // Vérification des données reçues
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return { error: "Veuillez renseigner vos identifiants." };
  }

  try {
    await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirectTo: "/",
    });
  } catch (error) {
    // Erreur liée à l'authentification
    if (error instanceof AuthError) {
      return {
        error: "Adresse e-mail ou mot de passe incorrect.",
      };
    }

    // Laisse Next.js gérer les redirections et autres erreurs
    throw error;
  }

  return {};
}
