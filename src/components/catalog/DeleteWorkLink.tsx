import { Suspense } from "react";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth/permissions";
import DeleteWorkButton from "@/app/catalog/music/works/[slug]/delete/DeleteWorkButton";

async function DeleteLinkContent({ slug }: { slug: string }) {
  await connection();

  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") {
    return null;
  }

  return <DeleteWorkButton slug={slug} />;
}

export default function DeleteWorkLink({ slug }: { slug: string }) {
  return (
    <Suspense fallback={null}>
      <DeleteLinkContent slug={slug} />
    </Suspense>
  );
}
