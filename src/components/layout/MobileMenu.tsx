"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { logout } from "@/app/logout/actions";
import { activeCatalogs } from "@/config/site";

type MobileMenuProps = {
  isAuthenticated: boolean;
  userName: string | null;
  userRole: string | null;
};

export default function MobileMenu({
  isAuthenticated,
  userName,
  userRole,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
      buttonRef.current?.focus();
    }
  }

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      {/* Bouton d'ouverture et de fermeture */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-md p-2 hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-4"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M18 6L6 18"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Navigation mobile */}
      <nav
        id="mobile-navigation"
        aria-label="Navigation mobile"
        hidden={!isOpen}
        className="absolute right-0 top-full z-50 mt-3 w-64 rounded-lg border border-border bg-background p-4 shadow-lg"
      >
        <ul className="flex flex-col gap-4">
          {activeCatalogs.map((catalog) => (
            <li key={catalog.type}>
              <Link
                href={catalog.href}
                className="header-link block"
                onClick={closeMenu}
              >
                {catalog.title}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/about"
              className="header-link block"
              onClick={closeMenu}
            >
              À propos
            </Link>
          </li>

          <li className="border-t border-border pt-4">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-muted-foreground">
                  {userName} ({userRole})
                </span>

                <form action={logout}>
                  <button type="submit" className="header-link">
                    Déconnexion
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="header-link" onClick={closeMenu}>
                Connexion
              </Link>
            )}
          </li>

          <li className="border-t border-border pt-4">
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </div>
  );
}
