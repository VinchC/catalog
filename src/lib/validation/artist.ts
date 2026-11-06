// Vérifie les données d'un artiste avant création ou modification.
type ArtistInput = {
  name: string;
  country: string;
  startYear: number;
  endYear: number | null;
};

export function validateArtist(input: ArtistInput): string | null {
  if (!input.name.trim() || !input.country.trim()) {
    return "Le nom et le pays sont obligatoires.";
  }

  if (
    !Number.isInteger(input.startYear) ||
    input.startYear < 1 ||
    input.startYear > 2100
  ) {
    return "L'année de début est invalide.";
  }

  if (
    input.endYear !== null &&
    (!Number.isInteger(input.endYear) ||
      input.endYear < input.startYear ||
      input.endYear > 2100)
  ) {
    return "L'année de fin est invalide.";
  }

  return null;
}