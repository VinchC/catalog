import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import CatalogBrowser from "@/components/catalog/CatalogBrowser";

import {
  getMusicalArtists,
  getMusicalWorks,
  getMusicalGenres,
  getMovieDirectors,
  getMovies,
  getMovieGenres,
} from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Catalogues",
  description: "Explore les catalogues de musique et de cinéma.",
};

type CatalogPageProps = {
  params: Promise<{ type: string }>;
};

// Configuration des catalogues disponibles.
const catalogs = {
  music: {
    title: "Catalogue musical",
    description: "Artistes, œuvres et genres musicaux.",
  },
  cinema: {
    title: "Catalogue cinéma",
    description: "Réalisateurs, films et genres cinématographiques.",
  },
} as const;

type CatalogType = keyof typeof catalogs;

// Vérifie que le catalogue demandé existe.
function isCatalogType(type: string): type is CatalogType {
  return Object.hasOwn(catalogs, type);
}

// Affichage du catalogue musical.
function MusicCatalog() {
  const artists = getMusicalArtists();
  const works = getMusicalWorks();
  const genres = getMusicalGenres();

  // Prépare les données au format attendu par CatalogBrowser.
  const browserItems = works.map((work) => {
    const artist = artists.find((item) => item.id === work.artistId);

    const workGenres = genres
      .filter((genre) => work.genreIds.includes(genre.id))
      .map((genre) => genre.name);

    return {
      slug: work.slug,
      title: work.title,
      person: artist?.name ?? "Artiste inconnu",
      year: work.year,
      genres: workGenres,
      href: `/catalog/music/works/${work.slug}`,
    };
  });

  return (
    <div className="page_stack">
      <section aria-labelledby="artists-title" className="space-y-4">
        <h2 id="artists-title" className="text-2xl font-semibold">
          Artistes
        </h2>

        <ul className="items_list">
          {artists.map((artist) => (
            <li key={artist.id} className="catalog_item">
              <h3 className="text-lg font-semibold">{artist.name}</h3>

              <p>{artist.country}</p>

              <p>
                {artist.startYear}
                {artist.endYear ? ` – ${artist.endYear}` : " – aujourd'hui"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="works-title" className="space-y-4">
        <h2 id="works-title" className="text-2xl font-semibold">
          Œuvres musicales
        </h2>

        <CatalogBrowser
          items={browserItems}
          personLabel="Artiste"
          searchLabel="Rechercher une œuvre"
          searchPlaceholder="Titre, artiste ou genre..."
        />
      </section>
    </div>
  );
}

// Affichage du catalogue cinéma.
function CinemaCatalog() {
  const directors = getMovieDirectors();
  const movies = getMovies();
  const genres = getMovieGenres();

  // Prépare les données au format attendu par CatalogBrowser.
  const browserItems = movies.map((movie) => {
    const director = directors.find((item) => item.id === movie.directorId);

    const movieGenres = genres
      .filter((genre) => movie.genreIds.includes(genre.id))
      .map((genre) => genre.name);

    return {
      slug: movie.slug,
      title: movie.title,
      person: director?.name ?? "Réalisateur inconnu",
      year: movie.year,
      genres: movieGenres,
      href: `/catalog/cinema/movies/${movie.slug}`,
    };
  });

  return (
    <div className="page_stack">
      <section aria-labelledby="directors-title" className="space-y-4">
        <h2 id="directors-title" className="text-2xl font-semibold">
          Réalisateurs
        </h2>

        <ul className="items_list">
          {directors.map((director) => (
            <li key={director.id} className="catalog_item">
              <h3 className="text-lg font-semibold">{director.name}</h3>

              <p>{director.country}</p>

              <p>
                {director.birthYear}
                {director.deathYear ? ` – ${director.deathYear}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="movies-title" className="space-y-4">
        <h2 id="movies-title" className="text-2xl font-semibold">
          Films
        </h2>

        <CatalogBrowser
          items={browserItems}
          personLabel="Réalisateur"
          searchLabel="Rechercher un film"
          searchPlaceholder="Titre, réalisateur ou genre..."
        />
      </section>
    </div>
  );
}

// Contenu dynamique de la page.
async function CatalogContent({ params }: CatalogPageProps) {
  const { type } = await params;

  if (!isCatalogType(type)) {
    notFound();
  }

  const catalog = catalogs[type];

  return (
    <div className="page_stack">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{catalog.title}</h1>
        <p>{catalog.description}</p>
      </header>

      {type === "music" ? <MusicCatalog /> : <CinemaCatalog />}

      <p>
        <Link href="/" className="underline underline-offset-4">
          ← Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}

// Conserve Suspense autour de l'accès aux paramètres dynamiques.
export default function CatalogPage({ params }: CatalogPageProps) {
  return (
    <Suspense fallback={<p role="status">Chargement du catalogue...</p>}>
      <CatalogContent params={params} />
    </Suspense>
  );
}
