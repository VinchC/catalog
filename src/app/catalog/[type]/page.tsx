import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Catalogues",
  description: "Explore les catalogues de musique et de cinéma.",
};

type CatalogPageProps = {
  params: Promise<{
    type: string;
  }>;
};

const catalogs = {
  music: {
    title: "Catalogue musical",
    description: "Retrouve les artistes, les œuvres et les genres musicaux.",
  },
  cinema: {
    title: "Catalogue cinéma",
    description:
      "Découvre les réalisateurs, les films et les genres cinématographiques.",
  },
};

type CatalogType = keyof typeof catalogs;

function isCatalogType(type: string): type is CatalogType {
  return Object.hasOwn(catalogs, type);
}

// Ce composant asynchrone lit les paramètres de l'URL.
// Il sera rendu à l'intérieur de Suspense.
async function CatalogContent({ params }: CatalogPageProps) {
  const { type } = await params;

  if (!isCatalogType(type)) {
    notFound();
  }

  const catalog = catalogs[type];

  return (
    <section aria-labelledby="catalog-title" className="space-y-4">
      <h1 id="catalog-title" className="text-3xl font-bold">
        {catalog.title}
      </h1>

      <p>{catalog.description}</p>

      <p className="rounded-lg border border-border p-4">
        Les données de ce catalogue seront ajoutées à l&apos;étape suivante.
      </p>
    </section>
  );
}

export default function CatalogPage({ params }: CatalogPageProps) {
  return (
    <Suspense
      fallback={
        <p role="status" aria-live="polite">
          Chargement du catalogue...
        </p>
      }
    >
      <CatalogContent params={params} />
    </Suspense>
  );
}
