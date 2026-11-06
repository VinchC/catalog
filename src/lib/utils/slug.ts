// Normalise un texte pour en faire une base de slug.
// Gère notamment les ligatures françaises qui ne sont pas décomposées
// automatiquement par normalize("NFD").
export function slugify(value: string): string {
  return (
    value
      .replace(/[œŒ]/g, "oe")
      .replace(/[æÆ]/g, "ae")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "element"
  );
}
