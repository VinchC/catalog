import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./LoginForm";

// Composant chargé de vérifier la session.
async function LoginPageContent() {
  // La session doit être vérifiée à chaque requête.
  await connection();

  const session = await auth();

  // Un utilisateur déjà connecté n'a pas besoin de se reconnecter.
  if (session?.user) {
    redirect("/");
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
      <LoginForm />
    </section>
  );
}

// La page elle-même peut être prérendue.
// Seule la vérification de session est différée.
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Chargement...
          </p>
        </section>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}