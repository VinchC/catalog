import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

import catalogData from "../data/catalog.json";

// Vérifie la présence de la variable d'environnement.
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable ${name} est absente.`);
  }

  return value;
}

// Initialise la connexion PostgreSQL avec l'adaptateur Prisma 7.
const adapter = new PrismaPg({
  connectionString: getRequiredEnv("DIRECT_URL"),
});

const prisma = new PrismaClient({ adapter });

// Importe les données du catalogue musical.
async function seedMusic() {
  const { artists, works, genres } = catalogData.music;

  // Création ou mise à jour des artistes.
  for (const artist of artists) {
    await prisma.artist.upsert({
      where: { id: artist.id },
      update: {
        name: artist.name,
        country: artist.country,
        startYear: artist.startYear,
        endYear: artist.endYear ?? null,
      },
      create: artist,
    });
  }

  // Création ou mise à jour des genres musicaux.
  for (const genre of genres) {
    await prisma.musicGenre.upsert({
      where: { id: genre.id },
      update: { name: genre.name },
      create: genre,
    });
  }

  // Création ou mise à jour des œuvres.
  for (const work of works) {
    const { genreIds, ...workData } = work;

    await prisma.musicalWork.upsert({
      where: { id: work.id },
      update: workData,
      create: workData,
    });

    // Création des associations entre œuvres et genres.
    for (const genreId of genreIds) {
      await prisma.musicalWorkGenre.upsert({
        where: {
          workId_genreId: {
            workId: work.id,
            genreId,
          },
        },
        update: {},
        create: {
          workId: work.id,
          genreId,
        },
      });
    }
  }

  console.log("Catalogue musical importé.");
}

// Importe les données du catalogue cinéma.
async function seedCinema() {
  const { directors, movies, genres } = catalogData.cinema;

  // Création ou mise à jour des réalisateurs.
  for (const director of directors) {
    await prisma.movieDirector.upsert({
      where: { id: director.id },
      update: {
        name: director.name,
        country: director.country,
        birthYear: director.birthYear,
        deathYear: director.deathYear ?? null,
      },
      create: director,
    });
  }

  // Création ou mise à jour des genres cinématographiques.
  for (const genre of genres) {
    await prisma.cinemaGenre.upsert({
      where: { id: genre.id },
      update: { name: genre.name },
      create: genre,
    });
  }

  // Création ou mise à jour des films.
  for (const movie of movies) {
    const { genreIds, ...movieData } = movie;

    await prisma.movie.upsert({
      where: { id: movie.id },
      update: movieData,
      create: movieData,
    });

    // Création des associations entre films et genres.
    for (const genreId of genreIds) {
      await prisma.movieGenre.upsert({
        where: {
          movieId_genreId: {
            movieId: movie.id,
            genreId,
          },
        },
        update: {},
        create: {
          movieId: movie.id,
          genreId,
        },
      });
    }
  }

  console.log("Catalogue cinéma importé.");
}

// Point d'entrée du script.
async function main() {
  console.log("Début de l'import des données...");

  await seedMusic();
  await seedCinema();

  console.log("Import terminé avec succès.");
}

// Exécution et fermeture propre de la connexion.
main()
  .catch((error) => {
    console.error("Erreur pendant l'import :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
