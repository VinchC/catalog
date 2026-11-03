import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Réutilise le client en développement pour éviter d'ouvrir
// de nouvelles connexions à chaque rechargement du code.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure l'adaptateur PostgreSQL.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Réutilise le client existant ou en crée un nouveau.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

// Conserve le client entre les rechargements en développement.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}