import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/permissions";

async function EditLinkContent({ id }: { id: string }) {
  await connection();

  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <Link href={`/catalog/music/artists/${id}/edit`} className="header-link">
      Modifier
    </Link>
  );
}

export default function EditArtistLink({ id }: { id: string }) {
  return (
    <Suspense fallback={null}>
      <EditLinkContent id={id} />
    </Suspense>
  );
}
