"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type DeleteArtistState = {
  error?: string;
};

export async function deleteArtist(
  _prevState: DeleteArtistState,
  formData: FormData,
): Promise<DeleteArtistState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Identifiant de l'artiste manquant." };
  }

  const artist = await prisma.artist.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!artist) {
    return { error: "Cet artiste n'existe pas ou a déjà été supprimé." };
  }

  // Vérifie qu'aucune œuvre n'est encore associée à cet artiste.
  const worksCount = await prisma.musicalWork.count({
    where: { artistId: id },
  });

  if (worksCount > 0) {
    return {
      error: `Impossible de supprimer ${artist.name} : ${worksCount} œuvre(s) lui sont encore associée(s).`,
    };
  }

  try {
    await prisma.artist.delete({
      where: { id },
    });
  } catch (error) {
    // La contrainte SQL protège aussi contre une association créée entre-temps.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return {
        error:
          "Cet artiste est associé à une ou plusieurs œuvres et ne peut pas être supprimé.",
      };
    }

    throw error;
  }

  revalidatePath("/catalog/music");
  redirect("/catalog/music?notice=artist-deleted");
}
