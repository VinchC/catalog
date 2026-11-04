
// Configuration générale de l'application.
export const siteConfig = {
  name: "Pops' catalogue",
  description: "Un catalogue évolutif consacré à la musique.",
  tagline: "Explore un catalogue consacré à la musique.",
} as const;

// Configuration des catalogues disponibles.
export const catalogConfig = [
  {
    type: "music",
    enabled: true,
    title: "Musique",
    description: "Artistes, œuvres et genres musicaux.",
    href: "/catalog/music",
    linkLabel: "Explorer le catalogue musical",
  },
  {
    type: "cinema",
    enabled: false,
    title: "Cinéma",
    description: "Réalisateurs, films et genres cinématographiques.",
    href: "/catalog/cinema",
    linkLabel: "Explorer le catalogue cinéma",
  },
] as const;

// Seuls les catalogues activés sont affichés.
export const activeCatalogs = catalogConfig.filter(
  (catalog) => catalog.enabled,
);
