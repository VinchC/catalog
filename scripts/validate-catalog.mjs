import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Chargement des données du catalogue.
const filePath = resolve(process.cwd(), "data/catalog.json");
const data = JSON.parse(readFileSync(filePath, "utf8"));

const errors = [];

// Vérifie qu'une valeur est une chaîne non vide.
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// Vérifie qu'une valeur est un entier.
function isInteger(value) {
  return Number.isInteger(value);
}

// Vérifie que les identifiants d'une collection sont uniques.
function checkUniqueIds(items, label) {
  const seen = new Set();

  for (const item of items) {
    if (!isNonEmptyString(item.id)) {
      errors.push(`${label} : identifiant absent ou invalide.`);
      continue;
    }

    if (seen.has(item.id)) {
      errors.push(`${label} : identifiant dupliqué "${item.id}".`);
    }

    seen.add(item.id);
  }
}

// Vérifie que les slugs d'une collection sont uniques.
function checkUniqueSlugs(items, label) {
  const seen = new Set();

  for (const item of items) {
    if (!isNonEmptyString(item.slug)) {
      errors.push(`${label} "${item.title ?? "sans titre"}" : slug absent ou invalide.`);
      continue;
    }

    if (seen.has(item.slug)) {
      errors.push(`${label} : slug dupliqué "${item.slug}".`);
    }

    seen.add(item.slug);
  }
}

// Vérifie les champs indispensables d'une collection de genres.
function checkGenres(genres, label) {
  for (const genre of genres) {
    if (!isNonEmptyString(genre.id)) {
      errors.push(`${label} : identifiant de genre absent ou invalide.`);
    }

    if (!isNonEmptyString(genre.name)) {
      errors.push(`${label} : nom de genre absent ou invalide.`);
    }
  }

  checkUniqueIds(genres, label);
}

// Vérifie les références aux genres.
function checkGenreReferences(items, genres, label) {
  const genreIds = new Set(genres.map((genre) => genre.id));

  for (const item of items) {
    if (!Array.isArray(item.genreIds)) {
      errors.push(`${label} "${item.title ?? item.id}" : genreIds doit être un tableau.`);
      continue;
    }

    for (const genreId of item.genreIds) {
      if (!genreIds.has(genreId)) {
        errors.push(
          `${label} "${item.title ?? item.id}" : genre inconnu "${genreId}".`
        );
      }
    }
  }
}

// Vérifie les champs obligatoires des personnes.
function checkPeople(items, label, requiredFields) {
  for (const item of items) {
    for (const field of requiredFields.strings) {
      if (!isNonEmptyString(item[field])) {
        errors.push(`${label} "${item.id ?? "sans identifiant"}" : champ "${field}" invalide.`);
      }
    }

    for (const field of requiredFields.numbers) {
      if (!isInteger(item[field])) {
        errors.push(`${label} "${item.id ?? "sans identifiant"}" : champ "${field}" invalide.`);
      }
    }
  }

  checkUniqueIds(items, label);
}

// Vérifie les champs indispensables des œuvres et des films.
function checkItems(items, label) {
  for (const item of items) {
    if (!isNonEmptyString(item.id)) {
      errors.push(`${label} : identifiant absent ou invalide.`);
    }

    if (!isNonEmptyString(item.slug)) {
      errors.push(`${label} "${item.id ?? "sans identifiant"}" : slug absent ou invalide.`);
    }

    if (!isNonEmptyString(item.title)) {
      errors.push(`${label} "${item.id ?? "sans identifiant"}" : titre absent ou invalide.`);
    }

    if (!isInteger(item.year)) {
      errors.push(`${label} "${item.title ?? item.id}" : année invalide.`);
    }
  }

  checkUniqueIds(items, label);
  checkUniqueSlugs(items, label);
}

// Vérifie qu'une référence désigne une personne existante.
function checkPersonReferences(items, people, field, label) {
  const personIds = new Set(people.map((person) => person.id));

  for (const item of items) {
    if (!personIds.has(item[field])) {
      errors.push(
        `${label} "${item.title ?? item.id}" : référence inconnue "${item[field]}".`
      );
    }
  }
}

// Vérification de la structure générale du fichier.
if (!data || !data.music || !data.cinema) {
  console.error("Erreur : le fichier doit contenir les catalogues music et cinema.");
  process.exit(1);
}

// Catalogue musical.
const { artists, works, genres: musicGenres } = data.music;

if (
  !Array.isArray(artists) ||
  !Array.isArray(works) ||
  !Array.isArray(musicGenres)
) {
  errors.push("Catalogue musical : artists, works et genres doivent être des tableaux.");
} else {
  checkPeople(artists, "Artiste", {
    strings: ["name", "country"],
    numbers: ["startYear"],
  });

  checkItems(works, "Œuvre musicale");
  checkGenres(musicGenres, "Genre musical");
  checkPersonReferences(works, artists, "artistId", "Œuvre musicale");
  checkGenreReferences(works, musicGenres, "Œuvre musicale");
}

// Catalogue cinéma.
const { directors, movies, genres: cinemaGenres } = data.cinema;

if (
  !Array.isArray(directors) ||
  !Array.isArray(movies) ||
  !Array.isArray(cinemaGenres)
) {
  errors.push("Catalogue cinéma : directors, movies et genres doivent être des tableaux.");
} else {
  checkPeople(directors, "Réalisateur", {
    strings: ["name", "country"],
    numbers: ["birthYear"],
  });

  checkItems(movies, "Film");
  checkGenres(cinemaGenres, "Genre cinéma");
  checkPersonReferences(movies, directors, "directorId", "Film");
  checkGenreReferences(movies, cinemaGenres, "Film");
}

// Résultat du contrôle.
if (errors.length > 0) {
  console.error(`\n❌ ${errors.length} erreur(s) détectée(s) :\n`);

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("✅ Catalogue valide : aucune incohérence détectée.");