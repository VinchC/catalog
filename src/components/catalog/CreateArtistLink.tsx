import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/permissions";

async function CreateLinkContent() {
  await connection();

  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <Link
      href="/catalog/music/artists/new"
      className="inline-block rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      Créer un artiste
    </Link>
  );
}

export default function CreateArtistLink() {
  return (
    <Suspense fallback={null}>
      <CreateLinkContent />
    </Suspense>
  );
}
