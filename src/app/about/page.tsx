import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "À propos",
};

export default function AboutPage() {
  return (
    <section aria-labelledby="about-title" className="space-y-4">
      <h1 id="about-title" className="text-3xl font-bold">
        À propos de {siteConfig.name}
      </h1>

      <p>
        Catalog est une application expérimentale conçue pour évoluer
        progressivement : données JSON, base de données PostgreSQL,
        authentification et gestion des catalogues.
      </p>

      <p>
        Le projet sert également de terrain d&apos;apprentissage pour Next.js,
        TypeScript, React, les tests et l&apos;accessibilité.
      </p>
    </section>
  );
}
