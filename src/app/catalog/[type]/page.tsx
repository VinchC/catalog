import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getMusicalArtists,
  getMusicalWorks,
  getMusicalGenres,
  getMovieDirectors,
  getMovies,
  getMovieGenres,
} from "@/lib/data/catalog";

import type {
  MusicalArtist,
  MusicalWork,
  MovieDirector,
  Movie,
  Genre,
} from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Catalogues",
  description: "Explore les catalogues de musique et de cinéma.",
};

type CatalogPageProps = {
  params: Promise<{
    type: string;
  }>;
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
};

type CatalogType = keyof typeof catalogs;

function isCatalogType(type: string): type is CatalogType {
  return Object.hasOwn(catalogs, type);
}

// Affichage d'une œuvre musicale avec son artiste et ses genres.
function MusicCatalog({
  artists,
  works,
  genres,
}: {
  artists: MusicalArtist[];
  works: MusicalWork[];
  genres: Genre[];
}) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="artists-title" className="space-y-4">
        <h2 id="artists-title" className="text-2xl font-semibold">
          Artistes
        </h2>

        <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <li
              key={artist.id}
              className="rounded-lg border border-border p-4"
            >
              <h3 className="font-semibold">{artist.name}</h3>
              <p>{artist.country}</p>
              <p className="text-sm">
                {artist.startYear}
                {artist.endYear ? ` – ${artist.endYear}` : " – aujourd'hui"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="works-title" className="space-y-4">
        <h2 id="works-title" className="text-2xl font-semibold">
          Œuvres
        </h2>

        <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => {
            const artist = artists.find(
              (item) => item.id === work.artistId
            );

            const workGenres = genres.filter((genre) =>
              work.genreIds.includes(genre.id)
            );

            return (
              <li
                key={work.id}
                className="rounded-lg border border-border p-4"
              >
                <h3 className="font-semibold">{work.title}</h3>
                <p>{artist?.name ?? "Artiste inconnu"}</p>
                <p>{work.year}</p>
                <p className="text-sm">
                  {workGenres.map((genre) => genre.name).join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

// Affichage d'un film avec son réalisateur et ses genres.
function CinemaCatalog({
  directors,
  movies,
  genres,
}: {
  directors: MovieDirector[];
  movies: Movie[];
  genres: Genre[];
}) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="directors-title" className="space-y-4">
        <h2 id="directors-title" className="text-2xl font-semibold">
          Réalisateurs
        </h2>

        <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
          {directors.map((director) => (
            <li
              key={director.id}
              className="rounded-lg border border-border p-4"
            >
              <h3 className="font-semibold">{director.name}</h3>
              <p>{director.country}</p>
              <p className="text-sm">
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

        <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie: Movie) => {
            const director = directors.find(
              (item) => item.id === movie.directorId
            );

            const movieGenres = genres.filter((genre) =>
              movie.genreIds.includes(genre.id)
            );

            return (
              <li
                key={movie.id}
                className="rounded-lg border border-border p-4"
              >
                <h3 className="font-semibold">{movie.title}</h3>
                <p>{director?.name ?? "Réalisateur inconnu"}</p>
                <p>{movie.year}</p>
                <p className="text-sm">
                  {movieGenres.map((genre) => genre.name).join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

async function CatalogContent({ params }: CatalogPageProps) {
  const { type } = await params;

  if (!isCatalogType(type)) {
    notFound();
  }

  const catalog = catalogs[type];

  return (
    <section aria-labelledby="catalog-title" className="space-y-8">
      <div className="space-y-2">
        <h1 id="catalog-title" className="text-3xl font-bold">
          {catalog.title}
        </h1>

        <p>{catalog.description}</p>
      </div>

      {type === "music" ? (
        <MusicCatalog
          artists={getMusicalArtists()}
          works={getMusicalWorks()}
          genres={getMusicalGenres()}
        />
      ) : (
        <CinemaCatalog
          directors={getMovieDirectors()}
          movies={getMovies()}
          genres={getMovieGenres()}
        />
      )}
    </section>
  );
}

export default function CatalogPage({ params }: CatalogPageProps) {
  return (
    <Suspense
      fallback={<p role="status">Chargement du catalogue...</p>}
    >
      <CatalogContent params={params} />
    </Suspense>
  );
}