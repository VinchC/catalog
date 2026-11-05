type WorkInput = {
  title: string;
  year: number;
  artistId: string;
  genreIds: string[];
};

export function validateWork(input: WorkInput): string | null {
  if (!input.title.trim() || !input.artistId) {
    return "Le titre et l'artiste sont obligatoires.";
  }

  if (!Number.isInteger(input.year) || input.year < 1 || input.year > 2100) {
    return "L'année de l'œuvre est invalide.";
  }

  if (input.genreIds.length === 0) {
    return "Au moins un genre doit être sélectionné.";
  }

  if (new Set(input.genreIds).size !== input.genreIds.length) {
    return "La sélection contient des genres en double.";
  }

  return null;
}
