import { Suspense } from "react";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth/permissions";

async function EditLinkContent({ href }: { href: string }) {
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <a href={href} className="header-link">
      Modifier cette œuvre
    </a>
  );
}

export default function EditWorkLink({ href }: { href: string }) {
  return (
    <Suspense fallback={null}>
      <EditLinkContent href={href} />
    </Suspense>
  );
}
