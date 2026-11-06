"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArtistFormState } from "./types";
import { validateArtist } from "@/lib/validation/artist";

export async function createArtist(
  _prevState: ArtistFormState,
  formData: FormData,
): Promise<ArtistFormState> {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const startYear = Number(formData.get("startYear"));
  const rawEndYear = String(formData.get("endYear") ?? "").trim();
  const endYear = rawEndYear ? Number(rawEndYear) : null;

  const error = validateArtist({ name, country, startYear, endYear });

  if (error) return { error };

  await prisma.artist.create({
    data: {
      id: crypto.randomUUID(),
      name,
      country,
      startYear,
      endYear,
    },
  });

  revalidatePath("/catalog/music");
  redirect("/catalog/music?notice=artist-created");
}
