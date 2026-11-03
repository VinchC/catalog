import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  // Vérifie si l'utilisateur est déjà connecté
  const session = await auth();

  // Un utilisateur connecté n'a pas besoin de la page login
  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-xl border border-border p-8">
        <h1 className="mb-2 text-2xl font-semibold">Connexion</h1>

        <p className="mb-6 text-sm text-foreground/70">
          Connectez-vous pour accéder aux fonctionnalités réservées aux
          utilisateurs.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
