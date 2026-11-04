"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArtistFormState } from "./type";

export async function updateArtist(
  _prevState: ArtistFormState,
  formData: FormData,
): Promise<ArtistFormState> {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const startYear = Number(formData.get("startYear"));
  const rawEndYear = String(formData.get("endYear") ?? "").trim();
  const endYear = rawEndYear ? Number(rawEndYear) : null;

  if (!id || !name || !country) {
    return { error: "Tous les champs obligatoires doivent être renseignés." };
  }

  if (!Number.isInteger(startYear) || startYear < 1 || startYear > 2100) {
    return { error: "L'année de début est invalide." };
  }

  if (
    endYear !== null &&
    (!Number.isInteger(endYear) || endYear < startYear || endYear > 2100)
  ) {
    return { error: "L'année de fin est invalide." };
  }

  const artist = await prisma.artist.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!artist) {
    return { error: "Cet artiste n'existe pas." };
  }

  await prisma.artist.update({
    where: { id },
    data: {
      name,
      country,
      startYear,
      endYear,
    },
  });

  revalidatePath("/catalog/music");
  redirect("/catalog/music?notice=artist-updated");
}
