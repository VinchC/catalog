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

// Autorise le rendu bloquant de cette route.
export const instant = false;

// Active ou désactive temporairement le catalogue cinéma.
const cinemaEnabled = false;

type MoviePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function MovieContent({ params }: MoviePageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const director = await getMovieDirectorById(movie.directorId);

  if (!director) {
    notFound();
  }

  const allGenres = await getMovieGenres();

  const genres = allGenres
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
  if (!cinemaEnabled) {
    notFound();
  }

  return (
    <Suspense fallback={<p role="status">Chargement de la fiche du film…</p>}>
      <MovieContent params={params} />
    </Suspense>
  );
}