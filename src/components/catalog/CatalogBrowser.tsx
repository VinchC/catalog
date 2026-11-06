"use client";

import { useId, useMemo, useState } from "react";
import CatalogItemCard from "@/components/catalog/CatalogItemCard";

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
  const id = useId();

  const [search, setSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("title-asc");

  const people = useMemo(
    () =>
      [...new Set(items.map((item) => item.person))].sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [items],
  );

  const genres = useMemo(
    () =>
      [...new Set(items.flatMap((item) => item.genres))].sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");

    return items
      .filter((item) => {
        const matchesSearch =
          query === "" ||
          [item.title, item.person, ...item.genres].some((value) =>
            value.toLocaleLowerCase("fr").includes(query),
          );

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

  const hasActiveFilters =
    search !== "" ||
    selectedPerson !== "" ||
    selectedGenre !== "" ||
    sortOrder !== "title-asc";

  function resetFilters() {
    setSearch("");
    setSelectedPerson("");
    setSelectedGenre("");
    setSortOrder("title-asc");
  }

  return (
    <section
      aria-label="Recherche et filtres du catalogue"
      className="space-y-6"
    >
      <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <legend className="sr-only">
          Recherche, filtres et tri des résultats
        </legend>

        <div className="space-y-1">
          <label htmlFor={`${id}-search`} className="block font-medium">
            {searchLabel}
          </label>
          <input
            id={`${id}-search`}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor={`${id}-person`} className="block font-medium">
            {personLabel}
          </label>
          <select
            id={`${id}-person`}
            value={selectedPerson}
            onChange={(event) => setSelectedPerson(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
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
          <label htmlFor={`${id}-genre`} className="block font-medium">
            Genre
          </label>
          <select
            id={`${id}-genre`}
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
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
          <label htmlFor={`${id}-sort`} className="block font-medium">
            Trier par
          </label>
          <select
            id={`${id}-sort`}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            <option value="title-asc">Titre (A à Z)</option>
            <option value="year-desc">Année (plus récente)</option>
            <option value="year-asc">Année (plus ancienne)</option>
          </select>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" aria-atomic="true">
          {filteredItems.length} résultat
          {filteredItems.length !== 1 ? "s" : ""}
          {" sur "}
          {items.length}
        </p>

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          className="rounded-md border border-border px-3 py-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50"
        >
          Réinitialiser
        </button>
      </div>

      {filteredItems.length > 0 ? (
        <ul className="items_list" aria-label="Résultats du catalogue">
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
