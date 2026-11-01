import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import CatalogItemDetails from "@/components/catalog/CatalogItemDetails";

import {
  getMovieBySlug,
  getMovieDirectorById,
  getMovieGenres,
} from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Fiche de film",
};

type MoviePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function MovieContent({ params }: MoviePageProps) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const director = getMovieDirectorById(movie.directorId);

  if (!director) {
    notFound();
  }

  const genres = getMovieGenres()
    .filter((genre) => movie.genreIds.includes(genre.id))
    .map((genre) => genre.name);

  return (
    <div className="page_stack">
      <Link href="/catalog/cinema" className="underline">
        ← Retour au catalogue cinéma
      </Link>

      <CatalogItemDetails
        title={movie.title}
        personLabel="Réalisateur"
        personName={director.name}
        yearLabel="Année de sortie"
        year={movie.year}
        genres={genres}
      />
    </div>
  );
}

export default function MoviePage({ params }: MoviePageProps) {
  return (
    <Suspense fallback={<p role="status">Chargement de la fiche du film…</p>}>
      <MovieContent params={params} />
    </Suspense>
  );
}
