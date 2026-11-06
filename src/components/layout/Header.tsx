import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import { siteConfig, activeCatalogs } from "@/config/site";
import { auth } from "@/auth";
import { logout } from "@/app/logout/actions";

async function HeaderContent() {
  await connection();

  const session = await auth();

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* Identité du site */}
          <Link
            href="/"
            className="text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label={`${siteConfig.name} - Accueil`}
          >
            {siteConfig.name}
          </Link>

          {/* Navigation desktop */}
          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {activeCatalogs.map((catalog) => (
                <li key={catalog.type}>
                  <Link href={catalog.href} className="header-link">
                    {catalog.title}
                  </Link>
                </li>
              ))}

              <li>
                <Link href="/about" className="header-link">
                  À propos
                </Link>
              </li>
            </ul>
          </nav>

          {/* Compte et thème desktop */}
          <div className="hidden items-center justify-end gap-4 md:flex">
            {session?.user ? (
              <>
                <span className="text-sm">
                  {session.user.name} ({session.user.role})
                </span>

                <form action={logout}>
                  <button type="submit" className="header-link">
                    Déconnexion
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="header-link">
                Connexion
              </Link>
            )}

            <ThemeToggle />
          </div>

          {/* Navigation mobile */}
          <div className="md:hidden">
            <MobileMenu
              isAuthenticated={Boolean(session?.user)}
              userName={session?.user?.name ?? null}
              userRole={session?.user?.role ?? null}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <span className="text-xl font-bold">{siteConfig.name}</span>
          </div>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
