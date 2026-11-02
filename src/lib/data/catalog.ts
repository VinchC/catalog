import catalogData from "../../../data/catalog.json";

import type {
  CatalogData,
  Genre,
  Movie,
  MovieDirector,
  MusicalArtist,
  MusicalWork,
} from "@/lib/data/types";

// Source de données actuelle.
// Cette variable pourra être remplacée par un accès à PostgreSQL.
const data: CatalogData = catalogData;

// --------------------------------------------------
// Catalogue musical
// --------------------------------------------------

export async function getMusicalArtists(): Promise<MusicalArtist[]> {
  return data.music.artists;
}

export async function getMusicalWorks(): Promise<MusicalWork[]> {
  return data.music.works;
}

export async function getMusicalGenres(): Promise<Genre[]> {
  return data.music.genres;
}

export async function getMusicalArtistById(
  id: string
): Promise<MusicalArtist | undefined> {
  return data.music.artists.find((artist) => artist.id === id);
}

export async function getMusicalWorkBySlug(
  slug: string
): Promise<MusicalWork | undefined> {
  return data.music.works.find((work) => work.slug === slug);
}

// --------------------------------------------------
// Catalogue cinéma
// --------------------------------------------------

export async function getMovieDirectors(): Promise<MovieDirector[]> {
  return data.cinema.directors;
}

export async function getMovies(): Promise<Movie[]> {
  return data.cinema.movies;
}

export async function getMovieGenres(): Promise<Genre[]> {
  return data.cinema.genres;
}

export async function getMovieDirectorById(
  id: string
): Promise<MovieDirector | undefined> {
  return data.cinema.directors.find((director) => director.id === id);
}

export async function getMovieBySlug(
  slug: string
): Promise<Movie | undefined> {
  return data.cinema.movies.find((movie) => movie.slug === slug);
}