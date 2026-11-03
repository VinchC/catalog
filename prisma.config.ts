// Charge les variables d'environnement depuis .env.
import "dotenv/config";

// Fonctions de configuration de Prisma.
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Emplacement du schéma Prisma.
  schema: "prisma/schema.prisma",

  // Emplacement des migrations.
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // URL de connexion à la base PostgreSQL.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
