import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import CatalogItemDetails from "@/components/catalog/CatalogItemDetails";

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
  const work = getMusicalWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const artist = getMusicalArtistById(work.artistId);

  if (!artist) {
    notFound();
  }

  const genres = getMusicalGenres()
    .filter((genre) => work.genreIds.includes(genre.id))
    .map((genre) => genre.name);

  return (
    <div className="space-y-8">
      <Link href="/catalog/music" className="underline">
        ← Retour au catalogue musical
      </Link>

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
