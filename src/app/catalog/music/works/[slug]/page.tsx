import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import CatalogItemDetails from "@/components/catalog/CatalogItemDetails";
import EditWorkLink from "@/components/catalog/EditWorkLink";
import DeleteWorkLink from "@/components/catalog/DeleteWorkLink";

import {
  getMusicalWorkBySlug,
  getMusicalArtistById,
  getMusicalGenres,
} from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Fiche d'œuvre musicale",
};

type WorkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function WorkContent({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = await getMusicalWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const artist = await getMusicalArtistById(work.artistId);

  if (!artist) {
    notFound();
  }

  const allGenres = await getMusicalGenres();

  const genres = allGenres
    .filter((genre) => work.genreIds.includes(genre.id))
    .map((genre) => genre.name);

  return (
    <div className="page_stack">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/catalog/music" className="underline">
          ← Retour au catalogue musical
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <EditWorkLink href={`/catalog/music/works/${work.slug}/edit`} />
          <DeleteWorkLink slug={work.slug} />
        </div>
      </div>

      <CatalogItemDetails
        title={work.title}
        personLabel="Artiste"
        personName={artist.name}
        yearLabel="Année de sortie"
        year={work.year}
        genres={genres}
      />
    </div>
  );
}

export default function MusicalWorkPage({ params }: WorkPageProps) {
  return (
    <Suspense fallback={<p role="status">Chargement de la fiche musicale…</p>}>
      <WorkContent params={params} />
    </Suspense>
  );
}
