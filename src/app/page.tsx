import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section aria-labelledby="home-title" className="space-y-3">
        <h1 id="home-title" className="text-3xl font-bold">
          Bienvenue sur Catalog
        </h1>

        <p className="max-w-2xl">
          Explore des catalogues de musique et de cinéma. L&apos;application sera
          enrichie progressivement avec la recherche, les filtres, les fiches
          détaillées et la gestion des données.
        </p>
      </section>

      <section aria-labelledby="catalogs-title" className="space-y-4">
        <h2 id="catalogs-title" className="text-2xl font-semibold">
          Choisir un catalogue
        </h2>

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
          <Link
            href="/catalog/music"
            className="rounded-lg border border-border p-6 transition-colors hover:bg-foreground/5"
          >
            <h3 className="text-xl font-semibold">Musique</h3>
            <p className="mt-2">Artistes, œuvres et genres musicaux.</p>
            <span className="mt-4 inline-block underline">
              Explorer le catalogue musical
            </span>
          </Link>

          <Link
            href="/catalog/cinema"
            className="rounded-lg border border-border p-6 transition-colors hover:bg-foreground/5"
          >
            <h3 className="text-xl font-semibold">Cinéma</h3>
            <p className="mt-2">
              Réalisateurs, films et genres cinématographiques.
            </p>
            <span className="mt-4 inline-block underline">
              Explorer le catalogue cinéma
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
