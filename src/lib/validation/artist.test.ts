import { describe, expect, it } from "vitest";
import { validateArtist } from "./artist";

describe("validateArtist", () => {
  it("accepte un artiste avec des données valides", () => {
    expect(
      validateArtist({
        name: "Radiohead",
        country: "Royaume-Uni",
        startYear: 1985,
        endYear: null,
      }),
    ).toBeNull();
  });

  it("refuse un nom ou un pays manquant", () => {
    expect(
      validateArtist({
        name: "",
        country: "France",
        startYear: 2000,
        endYear: null,
      }),
    ).toBe("Le nom et le pays sont obligatoires.");
  });

  it("refuse une année de début invalide", () => {
    expect(
      validateArtist({
        name: "Artiste",
        country: "France",
        startYear: 0,
        endYear: null,
      }),
    ).toBe("L'année de début est invalide.");
  });

  it("refuse une année de fin antérieure au début", () => {
    expect(
      validateArtist({
        name: "Artiste",
        country: "France",
        startYear: 2000,
        endYear: 1999,
      }),
    ).toBe("L'année de fin est invalide.");
  });

  it("accepte une année de fin égale à l'année de début", () => {
    expect(
      validateArtist({
        name: "Artiste",
        country: "France",
        startYear: 2000,
        endYear: 2000,
      }),
    ).toBeNull();
  });
});
