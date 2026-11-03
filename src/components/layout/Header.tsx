import Link from "next/link";
import { connection } from "next/server";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import { siteConfig } from "@/config/site";
import { auth } from "@/auth";
import { logout } from "@/app/logout/actions";

export default async function Header() {
  // La session dépend de la requête : on évite le prérendu statique.
  await connection();

  const session = await auth();

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* Bloc gauche : identité du site */}
          <Link
            href="/"
            className="text-xl font-bold"
            aria-label={`${siteConfig.name} - Accueil`}
          >
            {siteConfig.name}
          </Link>

          {/* Bloc central : navigation desktop */}
          <nav
            aria-label="Navigation principale"
            className="hidden md:block"
          >
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/catalog/music" className="header-link">
                  Musique
                </Link>
              </li>
              <li>
                <Link href="/catalog/cinema" className="header-link">
                  Cinéma
                </Link>
              </li>
              <li>
                <Link href="/about" className="header-link">
                  À propos
                </Link>
              </li>
            </ul>
          </nav>

          {/* Bloc droit : compte et thème desktop */}
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

          {/* Menu burger : visible uniquement sous 768 px */}
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