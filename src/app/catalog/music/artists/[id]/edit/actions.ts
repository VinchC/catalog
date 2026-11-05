"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArtistFormState } from "./type";
import { validateArtist } from "@/lib/validation/artist";

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

  const error = validateArtist({ name, country, startYear, endYear });

  if (error) return { error };

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
