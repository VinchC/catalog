import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import CatalogBrowser from "@/components/catalog/CatalogBrowser";
import ActionNotice from "@/components/ui/ActionNotice";

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
  searchParams: Promise<{ notice?: string | string[] }>;
};

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

function isCatalogType(type: string): type is CatalogType {
  return Object.hasOwn(catalogs, type);
}

// --------------------------------------------------
// Catalogue musical
// --------------------------------------------------

async function MusicCatalog() {
  // Charge les collections en parallèle.
  const [artists, works, genres] = await Promise.all([
    getMusicalArtists(),
    getMusicalWorks(),
    getMusicalGenres(),
  ]);

  // Transforme les données métier au format commun
  // attendu par CatalogBrowser.
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

// --------------------------------------------------
// Catalogue cinéma
// --------------------------------------------------

async function CinemaCatalog() {
  // Charge les collections en parallèle.
  const [directors, movies, genres] = await Promise.all([
    getMovieDirectors(),
    getMovies(),
    getMovieGenres(),
  ]);

  // Transforme les données métier au format commun
  // attendu par CatalogBrowser.
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

// --------------------------------------------------
// Page dynamique du catalogue
// --------------------------------------------------

async function CatalogContent({ params, searchParams }: CatalogPageProps) {
  const [{ type }, query] = await Promise.all([params, searchParams]);

  if (!isCatalogType(type)) {
    notFound();
  }

  const catalog = catalogs[type];

  const notice =
    typeof query.notice === "string" &&
    ["created", "updated", "deleted"].includes(query.notice)
      ? (query.notice as "created" | "updated" | "deleted")
      : undefined;

  return (
    <div className="page_stack">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{catalog.title}</h1>
        <p>{catalog.description}</p>
      </header>

      {type === "music" && notice && (
        <ActionNotice action={notice} itemType="œuvre" />
      )}

      {type === "music" ? <MusicCatalog /> : <CinemaCatalog />}

      <p>
        <Link href="/" className="underline underline-offset-4">
          ← Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}

export default function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  return (
    <Suspense fallback={<p role="status">Chargement du catalogue...</p>}>
      <CatalogContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
