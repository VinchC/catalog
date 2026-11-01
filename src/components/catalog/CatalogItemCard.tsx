import Link from "next/link";

type CatalogItemCardProps = {
  href: string;
  title: string;
  subtitle: string;
  year: number;
  genres: string[];
};

export default function CatalogItemCard({
  href,
  title,
  subtitle,
  year,
  genres,
}: CatalogItemCardProps) {
  return (
    <li className="catalog_item">
      <h3 className="text-lg font-semibold">
        <Link
          href={href}
          className="underline-offset-4 hover:underline"
        >
          {title}
        </Link>
      </h3>

      <p>{subtitle}</p>
      <p>{year}</p>

      <p className="text-sm">
        {genres.length > 0 ? genres.join(", ") : "Genre non renseigné"}
      </p>
    </li>
  );
}