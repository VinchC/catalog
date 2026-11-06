import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "./prisma";

beforeAll(() => {
  // Sécurité : interdit l'exécution accidentelle sur la base de développement.
  const databaseUrl = process.env.DATABASE_URL ?? "";

  if (!databaseUrl.includes("/catalog_test")) {
    throw new Error(
      "Test interrompu : DATABASE_URL ne pointe pas vers catalog_test.",
    );
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Contraintes PostgreSQL", () => {
  it("protège les artistes associés et supprime les associations d'une œuvre", async () => {
    const artistId = crypto.randomUUID();
    const genreId = crypto.randomUUID();
    const workId = crypto.randomUUID();
    const slug = `test-integration-${workId}`;

    try {
      // Prépare un artiste, un genre et une œuvre associés.
      await prisma.artist.create({
        data: {
          id: artistId,
          name: "Artiste test intégration",
          country: "France",
          startYear: 2020,
          endYear: null,
        },
      });

      await prisma.musicGenre.create({
        data: {
          id: genreId,
          name: "Genre test intégration",
        },
      });

      await prisma.musicalWork.create({
        data: {
          id: workId,
          slug,
          title: "Œuvre test intégration",
          year: 2026,
          artistId,
        },
      });

      await prisma.musicalWorkGenre.create({
        data: {
          workId,
          genreId,
        },
      });

      // PostgreSQL doit refuser la suppression de l'artiste associé.
      await expect(
        prisma.artist.delete({
          where: { id: artistId },
        }),
      ).rejects.toMatchObject({
        code: "P2003",
      });

      // La suppression de l'œuvre doit entraîner celle de l'association.
      await prisma.musicalWork.delete({
        where: { id: workId },
      });

      const associationsCount = await prisma.musicalWorkGenre.count({
        where: { workId },
      });

      expect(associationsCount).toBe(0);

      // Le genre doit toujours exister.
      const genre = await prisma.musicGenre.findUnique({
        where: { id: genreId },
      });

      expect(genre).not.toBeNull();
    } finally {
      // Nettoyage systématique des données de test.
      await prisma.musicalWorkGenre.deleteMany({
        where: { workId },
      });

      await prisma.musicalWork.deleteMany({
        where: { id: workId },
      });

      await prisma.artist.deleteMany({
        where: { id: artistId },
      });

      await prisma.musicGenre.deleteMany({
        where: { id: genreId },
      });
    }
  });
});
