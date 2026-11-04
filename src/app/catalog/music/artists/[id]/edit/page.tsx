import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import AuthBoundary from "@/components/auth/AuthBoundary";
import { prisma } from "@/lib/prisma";
import EditArtistForm from "./EditArtistForm";

export const metadata: Metadata = {
  title: "Modifier un artiste",
};

export const instant = false;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArtistPage({ params }: PageProps) {
  const { id } = await params;

  const artist = await prisma.artist.findUnique({
    where: { id },
  });

  if (!artist) notFound();

  return (
    <AuthBoundary>
      <section aria-labelledby="page-title" className="page_stack">
        <header className="space-y-2">
          <h1 id="page-title" className="text-3xl font-bold">
            Modifier un artiste
          </h1>
          <p>Modifier les informations de {artist.name}.</p>
        </header>

        <EditArtistForm artist={artist} />

        <p>
          <Link href="/catalog/music" className="underline underline-offset-4">
            ← Retour au catalogue musical
          </Link>
        </p>
      </section>
    </AuthBoundary>
  );
}
