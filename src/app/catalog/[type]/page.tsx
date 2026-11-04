import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import CreateWorkLink from "@/components/catalog/CreateWorkLink";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";
import ActionNotice from "@/components/ui/ActionNotice";

import {
  getMusicalArtists,
  getMusicalWorks,
  getMusicalGenres,
} from "@/lib/data/catalog";
import CreateArtistLink from "@/components/catalog/CreateArtistLink";

export const metadata: Metadata = {
  title: "Catalogue musical",
  description: "Explore le catalogue musical.",
};

type CatalogPageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ notice?: string | string[] }>;
};

// --------------------------------------------------
// Catalogue musical
// --------------------------------------------------

async function MusicCatalog() {
  // Charge les collections en parallèle.
  const [artists, works, genres] = await Promise.all([
    getMusicalArtists(),
    getMusicalWorks(),
    getMusicalGenres(),
  ]);

  // Transforme les données métier au format commun
  // attendu par CatalogBrowser.
  const browserItems = works.map((work) => {
    const artist = artists.find((item) => item.id === work.artistId);

    const workGenres = genres
      .filter((genre) => work.genreIds.includes(genre.id))
      .map((genre) => genre.name);

    return {
      slug: work.slug,
      title: work.title,
      person: artist?.name ?? "Artiste inconnu",
      year: work.year,
      genres: workGenres,
      href: `/catalog/music/works/${work.slug}`,
    };
  });

  return (
    <div className="page_stack">
      <section aria-labelledby="artists-title" className="space-y-4">
        <h2 id="artists-title" className="text-2xl font-semibold">
          Artistes
        </h2>

        <ul className="items_list">
          {artists.map((artist) => (
            <li key={artist.id} className="catalog_item">
              <h3 className="text-lg font-semibold">{artist.name}</h3>
              <p>{artist.country}</p>

              <p>
                {artist.startYear}
                {artist.endYear ? ` – ${artist.endYear}` : " – aujourd'hui"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="works-title" className="space-y-4">
        <h2 id="works-title" className="text-2xl font-semibold">
          Œuvres musicales
        </h2>

        <CatalogBrowser
          items={browserItems}
          personLabel="Artiste"
          searchLabel="Rechercher une œuvre"
          searchPlaceholder="Titre, artiste ou genre..."
        />
      </section>
    </div>
  );
}

// --------------------------------------------------
// Page dynamique du catalogue
// --------------------------------------------------

async function CatalogContent({ params, searchParams }: CatalogPageProps) {
  const [{ type }, query] = await Promise.all([params, searchParams]);

  // Seul le catalogue musical est accessible.
  if (type !== "music") {
    notFound();
  }

  const notice =
    typeof query.notice === "string" &&
    ["created", "updated", "deleted"].includes(query.notice)
      ? (query.notice as "created" | "updated" | "deleted")
      : undefined;

  return (
    <div className="page_stack">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Catalogue musical</h1>
        <p>Artistes, œuvres et genres musicaux.</p>
      </header>
      <div className="flex justify-between">
        <CreateWorkLink />
        <CreateArtistLink />
      </div>
      {notice && <ActionNotice action={notice} itemType="œuvre" />}

      <MusicCatalog />

      <p>
        <Link href="/" className="underline underline-offset-4">
          ← Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}

export default function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  return (
    <Suspense fallback={<p role="status">Chargement du catalogue...</p>}>
      <CatalogContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
