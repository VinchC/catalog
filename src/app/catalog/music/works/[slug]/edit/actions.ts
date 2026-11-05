"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/permissions";
import { validateWork } from "@/lib/validation/work";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type UpdateWorkState = {
  error?: string;
};

export async function updateMusicalWork(
  _prevState: UpdateWorkState,
  formData: FormData,
): Promise<UpdateWorkState> {
  // Seuls les utilisateurs connectés peuvent modifier une œuvre.
  await requireUser();

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const year = Number(formData.get("year"));
  const artistId = String(formData.get("artistId") ?? "");
  const genreIds = formData.getAll("genreIds").map(String);

  if (!slug) {
    return { error: "Identifiant de l'œuvre manquant." };
  }

  // Vérifie les champs et leur cohérence.
  const error = validateWork({ title, year, artistId, genreIds });
  if (error) return { error };

  // Vérifie que l'œuvre existe.
  const existingWork = await prisma.musicalWork.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  });

  if (!existingWork) {
    return { error: "Cette œuvre n'existe pas." };
  }

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

  // Génère un nouveau slug si le titre a changé.
  const newSlug = `${title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${existingWork.id.slice(0, 8)}`;

  // Met à jour l'œuvre et remplace ses associations de genres.
  await prisma.musicalWork.update({
    where: { slug },
    data: {
      title,
      slug: newSlug,
      year,
      artistId,
      genres: {
        deleteMany: {},
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
  });

  // Actualise les pages concernées.
  revalidatePath("/catalog/music");
  revalidatePath(`/catalog/music/works/${slug}`);
  revalidatePath(`/catalog/music/works/${newSlug}`);
  revalidatePath(`/catalog/music/works/${newSlug}/edit`);

  redirect("/catalog/music?notice=updated");
}
