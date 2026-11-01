// Configuration générale de l'application.
// Toute modification de ces valeurs se répercute
// dans les différents composants qui les utilisent.

export const siteConfig = {
  name: "Catalog",
  description:
    "Un catalogue évolutif consacré à la musique et au cinéma.",
  tagline:
    "Explore des catalogues de musique et de cinéma.",
} as const;

// Configuration des catalogues disponibles.
// Ces données pourront être réutilisées dans la navigation,
// la page d'accueil et d'autres composants.

export const catalogConfig = [
  {
    type: "music",
    title: "Musique",
    description: "Artistes, œuvres et genres musicaux.",
    href: "/catalog/music",
    linkLabel: "Explorer le catalogue musical",
  },
  {
    type: "cinema",
    title: "Cinéma",
    description: "Réalisateurs, films et genres cinématographiques.",
    href: "/catalog/cinema",
    linkLabel: "Explorer le catalogue cinéma",
  },
] as const;