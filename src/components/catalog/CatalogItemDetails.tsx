type CatalogItemDetailsProps = {
  title: string;
  personLabel: string;
  personName: string;
  yearLabel: string;
  year: number;
  genres: string[];
};

export default function CatalogItemDetails({
  title,
  personLabel,
  personName,
  yearLabel,
  year,
  genres,
}: CatalogItemDetailsProps) {
  return (
    <article className="page_stack item_stack">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{title}</h1>

        <p>
          <span className="font-semibold">{personLabel} :</span> {personName}
        </p>

        <p>
          <span className="font-semibold">{yearLabel} :</span> {year}
        </p>
      </header>

      <section aria-labelledby="detail-genres-title" className="space-y-4">
        <h2 id="detail-genres-title" className="text-xl font-semibold">
          Genres
        </h2>

        {genres.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <li
                key={genre}
                className="rounded-md border border-border px-3 py-1"
              >
                {genre}
              </li>
            ))}
          </ul>
        ) : (
          <p>Genre non renseigné.</p>
        )}
      </section>
    </article>
  );
}
