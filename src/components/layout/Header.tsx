import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="text-xl font-bold"
          aria-label="Catalog - Accueil"
        >
          Catalog
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap items-center gap-4">
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li>
              <Link href="/catalog/music">Musique</Link>
            </li>
            <li>
              <Link href="/catalog/cinema">Cinéma</Link>
            </li>
            <li>
              <Link href="/about">À propos</Link>
            </li>
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
