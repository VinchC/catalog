import catalogData from "../../../data/catalog.json";

import type {
  CatalogData,
  MusicalArtist,
  MusicalWork,
  MovieDirector,
  Movie,
  Genre,
} from "@/lib/data/types";

// Vérification de la structure générale à la compilation.
const data: CatalogData = catalogData;

// Fonctions de lecture du catalogue musical.

export function getMusicalArtists(): MusicalArtist[] {
  return data.music.artists;
}

export function getMusicalWorks(): MusicalWork[] {
  return data.music.works;
}

export function getMusicalGenres(): Genre[] {
  return data.music.genres;
}

// Fonctions de lecture du catalogue cinéma.

export function getMovieDirectors(): MovieDirector[] {
  return data.cinema.directors;
}

export function getMovies(): Movie[] {
  return data.cinema.movies;
}

export function getMovieGenres(): Genre[] {
  return data.cinema.genres;
}

// Fonctions de recherche par identifiant.

export function getMusicalArtistById(id: string): MusicalArtist | undefined {
  return data.music.artists.find((artist) => artist.id === id);
}

export function getMovieDirectorById(id: string): MovieDirector | undefined {
  return data.cinema.directors.find((director) => director.id === id);
}

// Fonctions de recherche par slug.
export function getMusicalWorkBySlug(slug: string): MusicalWork | undefined {
  return data.music.works.find((work) => work.slug === slug);
}

export function getMovieBySlug(slug: string): Movie | undefined {
  return data.cinema.movies.find((movie) => movie.slug === slug);
}
