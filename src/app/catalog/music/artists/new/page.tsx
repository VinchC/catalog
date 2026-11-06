import type { Metadata } from "next";
import Link from "next/link";

import AuthBoundary from "@/components/auth/AuthBoundary";
import CreateArtistForm from "./CreateArtistForm";

export const metadata: Metadata = {
  title: "Créer un artiste",
};

export default function NewArtistPage() {
  return (
    <AuthBoundary>
      <section aria-labelledby="page-title" className="page_stack">
        <header className="space-y-2">
          <h1 id="page-title" className="text-3xl font-bold">
            Créer un artiste
          </h1>
          <p>Ajouter un artiste au catalogue musical.</p>
        </header>

        <CreateArtistForm />

        <p>
          <Link href="/catalog/music" className="underline underline-offset-4">
            ← Retour au catalogue musical
          </Link>
        </p>
      </section>
    </AuthBoundary>
  );
}
