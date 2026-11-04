
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteMusicalWork(formData: FormData) {
  // Vérifie que l'utilisateur possède le rôle ADMIN.
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "");

  if (!slug) {
    throw new Error("Identifiant de l'œuvre manquant.");
  }

  // Vérifie que l'œuvre existe.
  const work = await prisma.musicalWork.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!work) {
    throw new Error("Cette œuvre n'existe pas.");
  }

  // Supprime l'œuvre et ses associations aux genres.
  await prisma.musicalWork.delete({
    where: { id: work.id },
  });

  // Invalide les pages concernées.
  revalidatePath("/catalog/music");
  revalidatePath(`/catalog/music/works/${slug}`);

  redirect("/catalog/music");
}
