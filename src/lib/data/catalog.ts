import { prisma } from "@/lib/prisma";

import type {
  Genre,
  Movie,
  MovieDirector,
  MusicalArtist,
  MusicalWork,
} from "@/lib/data/types";

// ==================================================
// CATALOGUE MUSICAL
// ==================================================

// Récupère tous les artistes.
export async function getMusicalArtists(): Promise<MusicalArtist[]> {
  return prisma.artist.findMany({
    orderBy: { name: "asc" },
  });
}

// Récupère toutes les œuvres et leurs genres.
export async function getMusicalWorks(): Promise<MusicalWork[]> {
  const works = await prisma.musicalWork.findMany({
    include: {
      genres: {
        select: { genreId: true },
      },
    },
    orderBy: { title: "asc" },
  });

  // Convertit les relations Prisma en genreIds,
  // pour conserver le format utilisé par les composants.
  return works.map(({ genres, ...work }) => ({
    ...work,
    genreIds: genres.map((genre) => genre.genreId),
  }));
}

// Récupère tous les genres musicaux.
export async function getMusicalGenres(): Promise<Genre[]> {
  return prisma.musicGenre.findMany({
    orderBy: { name: "asc" },
  });
}

// Récupère un artiste à partir de son identifiant.
export async function getMusicalArtistById(
  id: string,
): Promise<MusicalArtist | undefined> {
  return (
    (await prisma.artist.findUnique({
      where: { id },
    })) ?? undefined
  );
}

// Récupère une œuvre à partir de son slug.
export async function getMusicalWorkBySlug(
  slug: string,
): Promise<MusicalWork | undefined> {
  const work = await prisma.musicalWork.findUnique({
    where: { slug },
    include: {
      genres: {
        select: { genreId: true },
      },
    },
  });

  if (!work) {
    return undefined;
  }

  const { genres, ...workData } = work;

  return {
    ...workData,
    genreIds: genres.map((genre) => genre.genreId),
  };
}

// ==================================================
// CATALOGUE CINÉMA
// ==================================================

// Récupère tous les réalisateurs.
export async function getMovieDirectors(): Promise<MovieDirector[]> {
  return prisma.movieDirector.findMany({
    orderBy: { name: "asc" },
  });
}

// Récupère tous les films et leurs genres.
export async function getMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    include: {
      genres: {
        select: { genreId: true },
      },
    },
    orderBy: { title: "asc" },
  });

  return movies.map(({ genres, ...movie }) => ({
    ...movie,
    genreIds: genres.map((genre) => genre.genreId),
  }));
}

// Récupère tous les genres cinématographiques.
export async function getMovieGenres(): Promise<Genre[]> {
  return prisma.cinemaGenre.findMany({
    orderBy: { name: "asc" },
  });
}

// Récupère un réalisateur à partir de son identifiant.
export async function getMovieDirectorById(
  id: string,
): Promise<MovieDirector | undefined> {
  return (
    (await prisma.movieDirector.findUnique({
      where: { id },
    })) ?? undefined
  );
}

// Récupère un film à partir de son slug.
export async function getMovieBySlug(
  slug: string,
): Promise<Movie | undefined> {
  const movie = await prisma.movie.findUnique({
    where: { slug },
    include: {
      genres: {
        select: { genreId: true },
      },
    },
  });

  if (!movie) {
    return undefined;
  }

  const { genres, ...movieData } = movie;

  return {
    ...movieData,
    genreIds: genres.map((genre) => genre.genreId),
  };
}