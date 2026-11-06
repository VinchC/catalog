import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginForm from "./LoginForm";

async function LoginPageContent() {
  await connection();

  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <section className="mx-auto w-full max-w-md" aria-labelledby="login-title">
      <h1 id="login-title" className="mb-6 text-2xl font-bold">
        Connexion
      </h1>

      <LoginForm />
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section
          className="mx-auto w-full max-w-md"
          aria-labelledby="login-title"
        >
          <h1 id="login-title" className="mb-6 text-2xl font-bold">
            Connexion
          </h1>

          <p role="status">Chargement...</p>
        </section>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
