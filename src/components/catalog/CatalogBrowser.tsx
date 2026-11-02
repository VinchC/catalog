"use client";

import { useMemo, useState } from "react";
import CatalogItemCard from "@/components/catalog/CatalogItemCard";

// Structure commune aux œuvres musicales et aux films.
// La page serveur transforme les données métier en objets de ce type.
export type CatalogBrowserItem = {
  slug: string;
  title: string;
  person: string;
  year: number;
  genres: string[];
  href: string;
};

type CatalogBrowserProps = {
  items: CatalogBrowserItem[];
  personLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
};

type SortOrder = "title-asc" | "year-desc" | "year-asc";

export default function CatalogBrowser({
  items,
  personLabel,
  searchLabel,
  searchPlaceholder,
}: CatalogBrowserProps) {
  // Valeurs des contrôles.
  const [search, setSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("title-asc");

  // Liste unique des artistes ou réalisateurs présents dans les résultats.
  const people = useMemo(
    () => [...new Set(items.map((item) => item.person))].sort((a, b) =>
      a.localeCompare(b, "fr")
    ),
    [items]
  );

  // Liste unique des genres disponibles.
  const genres = useMemo(
    () =>
      [...new Set(items.flatMap((item) => item.genres))].sort((a, b) =>
        a.localeCompare(b, "fr")
      ),
    [items]
  );

  // Recherche, application des filtres et tri.
  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");

    return items
      .filter((item) => {
        const matchesSearch =
          query === "" ||
          [
            item.title,
            item.person,
            ...item.genres,
          ].some((value) => value.toLocaleLowerCase("fr").includes(query));

        const matchesPerson =
          selectedPerson === "" || item.person === selectedPerson;

        const matchesGenre =
          selectedGenre === "" || item.genres.includes(selectedGenre);

        return matchesSearch && matchesPerson && matchesGenre;
      })
      .sort((a, b) => {
        if (sortOrder === "title-asc") {
          return a.title.localeCompare(b.title, "fr");
        }

        if (sortOrder === "year-asc") {
          return a.year - b.year || a.title.localeCompare(b.title, "fr");
        }

        return b.year - a.year || a.title.localeCompare(b.title, "fr");
      });
  }, [items, search, selectedPerson, selectedGenre, sortOrder]);

  // Remise à zéro de tous les contrôles.
  function resetFilters() {
    setSearch("");
    setSelectedPerson("");
    setSelectedGenre("");
    setSortOrder("title-asc");
  }

  return (
    <section aria-label="Recherche et filtres du catalogue" className="space-y-6">
      {/* Contrôles de recherche, de filtrage et de tri */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <label htmlFor="catalog-search" className="block font-medium">
            {searchLabel}
          </label>

          <input
            id="catalog-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="catalog-person" className="block font-medium">
            {personLabel}
          </label>

          <select
            id="catalog-person"
            value={selectedPerson}
            onChange={(event) => setSelectedPerson(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="">Tous</option>

            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="catalog-genre" className="block font-medium">
            Genre
          </label>

          <select
            id="catalog-genre"
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="">Tous</option>

            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="catalog-sort" className="block font-medium">
            Trier par
          </label>

          <select
            id="catalog-sort"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as SortOrder)
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="title-asc">Titre (A à Z)</option>
            <option value="year-desc">Année (plus récente)</option>
            <option value="year-asc">Année (plus ancienne)</option>
          </select>
        </div>
      </div>

      {/* Résumé des résultats et réinitialisation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite">
          {filteredItems.length} résultat
          {filteredItems.length !== 1 ? "s" : ""}
          {" sur "}
          {items.length}
        </p>

        <button
          type="button"
          onClick={resetFilters}
          className="rounded-md border border-border px-3 py-2 underline underline-offset-4"
        >
          Réinitialiser
        </button>
      </div>

      {/* Résultats */}
      {filteredItems.length > 0 ? (
        <ul className="items_list">
          {filteredItems.map((item) => (
            <CatalogItemCard
              key={item.slug}
              href={item.href}
              title={item.title}
              subtitle={item.person}
              year={item.year}
              genres={item.genres}
            />
          ))}
        </ul>
      ) : (
        <p role="status">
          Aucun résultat ne correspond à ta recherche ou à tes filtres.
        </p>
      )}
    </section>
  );
}