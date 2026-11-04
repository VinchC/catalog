import AuthBoundary from "@/components/auth/AuthBoundary";
import { notFound } from "next/navigation";

import {
  getMusicalArtists,
  getMusicalGenres,
  getMusicalWorkBySlug,
} from "@/lib/data/catalog";

import EditWorkForm from "./EditWorkForm";

type EditWorkPageProps = {
  params: Promise<{ slug: string }>;
};

async function EditWorkContent({ params }: EditWorkPageProps) {
  const { slug } = await params;

  const work = await getMusicalWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const [artists, genres] = await Promise.all([
    getMusicalArtists(),
    getMusicalGenres(),
  ]);

  return (
    <section
      aria-labelledby="page-title"
      className="mx-auto w-full max-w-2xl page_stack"
    >
      <div>
        <h1 id="page-title" className="text-2xl font-bold">
          Modifier une œuvre musicale
        </h1>
        <p className="mt-2 text-muted-foreground">
          Modifiez les informations de cette œuvre.
        </p>
      </div>

      <EditWorkForm
        originalSlug={work.slug}
        title={work.title}
        year={work.year}
        artistId={work.artistId}
        genreIds={work.genreIds}
        artists={artists}
        genres={genres}
      />
    </section>
  );
}

export default function EditMusicalWorkPage({ params }: EditWorkPageProps) {
  return (
    <AuthBoundary fallback={<p role="status">Chargement du formulaire...</p>}>
      <EditWorkContent params={params} />
    </AuthBoundary>
  );
}
