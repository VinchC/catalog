import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it.each([
    ["Œuvre", "oeuvre"],
    ["Été", "ete"],
    ["Ça", "ca"],
    ["L'été d'André", "l-ete-d-andre"],
    ["Cœur de pirate", "coeur-de-pirate"],
    ["Æther", "aether"],
    ["Rock & Roll", "rock-roll"],
    ["  Titre avec espaces  ", "titre-avec-espaces"],
    ["!!!", "element"],
  ])("transforme %s en %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});
