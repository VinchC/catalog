import { Suspense } from "react";
import { connection } from "next/server";

import { getCurrentUser } from "@/lib/auth/permissions";
import DeleteArtistButton from "@/app/catalog/music/artists/[id]/delete/DeleteArtistButton";

async function DeleteLinkContent({ id, name }: { id: string; name: string }) {
  await connection();

  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") return null;

  return <DeleteArtistButton id={id} name={name} />;
}

export default function DeleteArtistLink({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <Suspense fallback={null}>
      <DeleteLinkContent id={id} name={name} />
    </Suspense>
  );
}
