"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export type CreateWorkState = {
  error?: string;
};

export async function createMusicalWork(
  _prevState: CreateWorkState,
  formData: FormData,
): Promise<CreateWorkState> {
  // Seuls les utilisateurs connectés peuvent créer une œuvre.
  await requireUser();

  const title = formData.get("title");
  const yearValue = formData.get("year");
  const artistId = formData.get("artistId");
  const genreIds = formData.getAll("genreIds");

  if (
    typeof title !== "string" ||
    typeof yearValue !== "string" ||
    typeof artistId !== "string" ||
    !title.trim() ||
    !yearValue.trim() ||
    !artistId
  ) {
    return { error: "Veuillez renseigner tous les champs obligatoires." };
  }

  const year = Number(yearValue);

  if (!Number.isInteger(year) || year < 1 || year > 3000) {
    return { error: "Veuillez saisir une année valide." };
  }

  if (!genreIds.every((id) => typeof id === "string")) {
    return { error: "La sélection des genres est invalide." };
  }

  // Génère un slug à partir du titre.
  const slug = title
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    return { error: "Impossible de générer une adresse à partir du titre." };
  }

  const [artist, genres, existingWork] = await Promise.all([
    prisma.artist.findUnique({ where: { id: artistId } }),
    prisma.musicGenre.findMany({
      where: { id: { in: genreIds as string[] } },
      select: { id: true },
    }),
    prisma.musicalWork.findUnique({ where: { slug } }),
  ]);

  if (!artist) {
    return { error: "L'artiste sélectionné n'existe pas." };
  }

  if (genres.length !== new Set(genreIds).size) {
    return { error: "Un ou plusieurs genres sélectionnés sont invalides." };
  }

  if (existingWork) {
    return {
      error:
        "Une œuvre utilisant déjà ce titre existe. Choisissez un autre titre.",
    };
  }

  await prisma.musicalWork.create({
    data: {
      id: crypto.randomUUID(),
      slug,
      title: title.trim(),
      year,
      artistId,
      genres: {
        create: (genreIds as string[]).map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
  });

  revalidatePath("/catalog/music");

  redirect("/catalog/music?notice=created");
}
