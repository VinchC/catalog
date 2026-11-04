
import { Suspense } from "react";
import { connection } from "next/server";

import { getMusicalArtists, getMusicalGenres } from "@/lib/data/catalog";
import { requireUser } from "@/lib/auth/permissions";

import CreateWorkForm from "./CreateWorkForm";

async function NewMusicalWorkContent() {
  await connection();
  await requireUser();

  const [artists, genres] = await Promise.all([
    getMusicalArtists(),
    getMusicalGenres(),
  ]);

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ajouter une œuvre musicale</h1>
        <p className="mt-2 text-muted-foreground">
          Renseignez les informations de l’œuvre à ajouter au catalogue.
        </p>
      </div>

      <CreateWorkForm artists={artists} genres={genres} />
    </section>
  );
}

export default function NewMusicalWorkPage() {
  return (
    <Suspense fallback={<p>Chargement du formulaire...</p>}>
      <NewMusicalWorkContent />
    </Suspense>
  );
}
