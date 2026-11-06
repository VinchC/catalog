import "dotenv/config";

import { hash } from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Vérifie la présence d'une variable d'environnement.
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable ${name} est absente.`);
  }

  return value;
}

// Récupère les mots de passe.
const adminPassword: string = getRequiredEnv("ADMIN_PASSWORD");
const userPassword: string = getRequiredEnv("USER_PASSWORD");

// Initialise Prisma avec une connexion directe.
const adapter = new PrismaPg({
  connectionString: getRequiredEnv("DIRECT_URL"),
});

const prisma = new PrismaClient({ adapter });

// Création ou mise à jour des comptes.
async function createUsers(): Promise<void> {
  // Hachage asynchrone des mots de passe.
  const adminHash: string = await hash(adminPassword, 12);
  const userHash: string = await hash(userPassword, 12);

  // Compte administrateur.
  await prisma.user.upsert({
    where: { email: "admin@catalog.local" },
    update: {
      name: "Administrateur",
      passwordHash: adminHash,
      role: "ADMIN",
    },
    create: {
      name: "Administrateur",
      email: "admin@catalog.local",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // Compte utilisateur.
  await prisma.user.upsert({
    where: { email: "user@catalog.local" },
    update: {
      name: "Utilisateur",
      passwordHash: userHash,
      role: "USER",
    },
    create: {
      name: "Utilisateur",
      email: "user@catalog.local",
      passwordHash: userHash,
      role: "USER",
    },
  });

  console.log("Les deux comptes ont été créés ou mis à jour.");
}

// Exécution du script.
createUsers()
  .catch((error: unknown) => {
    console.error("Erreur lors de la création des comptes :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
