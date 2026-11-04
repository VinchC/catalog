
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export type UpdateWorkState = {
  error?: string;
};

export async function updateMusicalWork(
  _prevState: UpdateWorkState,
  formData: FormData,
): Promise<UpdateWorkState> {
  await requireUser();

  const originalSlug = formData.get("originalSlug");
  const title = formData.get("title");
  const yearValue = formData.get("year");
  const artistId = formData.get("artistId");
  const genreIds = formData.getAll("genreIds");

  if (
    typeof originalSlug !== "string" ||
    typeof title !== "string" ||
    typeof yearValue !== "string" ||
    typeof artistId !== "string" ||
    !originalSlug ||
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

  const uniqueGenreIds = [...new Set(genreIds as string[])];

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

  const work = await prisma.musicalWork.findUnique({
    where: { slug: originalSlug },
  });

  if (!work) {
    return { error: "Cette œuvre n'existe plus." };
  }

  const [artist, genres, existingWork] = await Promise.all([
    prisma.artist.findUnique({ where: { id: artistId } }),
    prisma.musicGenre.findMany({
      where: { id: { in: uniqueGenreIds } },
      select: { id: true },
    }),
    prisma.musicalWork.findFirst({
      where: {
        slug,
        id: { not: work.id },
      },
    }),
  ]);

  if (!artist) {
    return { error: "L'artiste sélectionné n'existe pas." };
  }

  if (genres.length !== uniqueGenreIds.length) {
    return { error: "Un ou plusieurs genres sélectionnés sont invalides." };
  }

  if (existingWork) {
    return { error: "Une autre œuvre utilise déjà ce titre." };
  }

  await prisma.musicalWork.update({
    where: { id: work.id },
    data: {
      title: title.trim(),
      slug,
      year,
      artistId,
      genres: {
        deleteMany: {},
        create: uniqueGenreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
  });

  // Invalide les pages susceptibles de contenir les anciennes données.
  revalidatePath("/catalog/music");
  revalidatePath(`/catalog/music/works/${originalSlug}`);
  revalidatePath(`/catalog/music/works/${slug}`);
  revalidatePath(`/catalog/music/works/${originalSlug}/edit`);
  revalidatePath(`/catalog/music/works/${slug}/edit`);

  redirect("/catalog/music?notice=updated");
}
