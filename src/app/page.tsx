
import Link from "next/link";

import { siteConfig, activeCatalogs } from "@/config/site";

export default function HomePage() {
  return (
    <div className="page_stack">
      <section aria-labelledby="home-title" className="space-y-3">
        <h1 id="home-title" className="text-3xl font-bold">
          Bienvenue sur {siteConfig.name}
        </h1>

        <p className="max-w-2xl">{siteConfig.tagline}</p>
      </section>

      <section aria-labelledby="catalogs-title" className="space-y-4">
        <h2 id="catalogs-title" className="text-2xl font-semibold">
          Explorer le catalogue
        </h2>

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
          {activeCatalogs.map((catalog) => (
            <Link
              key={catalog.type}
              href={catalog.href}
              className="catalog_link"
            >
              <h3 className="text-xl font-semibold">{catalog.title}</h3>

              <p className="mt-2">{catalog.description}</p>

              <span className="mt-4 inline-block underline">
                {catalog.linkLabel}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
