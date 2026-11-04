
"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArtistFormState } from "./types";

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

  if (!name || !country) {
    return { error: "Le nom et le pays sont obligatoires." };
  }

  if (
    !Number.isInteger(startYear) ||
    startYear < 1 ||
    startYear > 2100
  ) {
    return { error: "L'année de début est invalide." };
  }

  if (
    endYear !== null &&
    (!Number.isInteger(endYear) ||
      endYear < startYear ||
      endYear > 2100)
  ) {
    return { error: "L'année de fin est invalide." };
  }

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
