import { getMusicalArtists, getMusicalGenres } from "@/lib/data/catalog";
import AuthBoundary from "@/components/auth/AuthBoundary";

import CreateWorkForm from "./CreateWorkForm";

async function NewMusicalWorkContent() {
  const [artists, genres] = await Promise.all([
    getMusicalArtists(),
    getMusicalGenres(),
  ]);

  return (
    <section
      aria-labelledby="page-title"
      className="mx-auto w-full max-w-2xl space-y-8"
    >
      <div>
        <h1 id="page-title" className="text-2xl font-bold">
          Ajouter une œuvre musicale
        </h1>
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
    <AuthBoundary fallback={<p>Chargement du formulaire...</p>}>
      <NewMusicalWorkContent />
    </AuthBoundary>
  );
}
