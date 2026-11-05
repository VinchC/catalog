"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/permissions";
import { validateWork } from "@/lib/validation/work";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateWorkState = {
  error?: string;
};

export async function createMusicalWork(
  _prevState: CreateWorkState,
  formData: FormData,
): Promise<CreateWorkState> {
  // Seuls les utilisateurs connectés peuvent créer une œuvre.
  await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const year = Number(formData.get("year"));
  const artistId = String(formData.get("artistId") ?? "");
  const genreIds = formData.getAll("genreIds").map(String);

  // Vérifie les champs et leur cohérence.
  const error = validateWork({ title, year, artistId, genreIds });
  if (error) return { error };

  // Vérifie l'existence de l'artiste.
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { id: true },
  });

  if (!artist) {
    return { error: "L'artiste sélectionné n'existe pas." };
  }

  // Vérifie l'existence de tous les genres sélectionnés.
  const genres = await prisma.musicGenre.findMany({
    where: { id: { in: genreIds } },
    select: { id: true },
  });

  if (genres.length !== genreIds.length) {
    return { error: "Un ou plusieurs genres sélectionnés sont invalides." };
  }

  // Génère un identifiant et un slug uniques.
  const id = crypto.randomUUID();
  const slug = `${title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${id.slice(0, 8)}`;

  // Crée l'œuvre et ses associations avec les genres.
  await prisma.musicalWork.create({
    data: {
      id,
      slug,
      title,
      year,
      artistId,
      genres: {
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
  });

  revalidatePath("/catalog/music");
  redirect("/catalog/music?notice=created");
}
