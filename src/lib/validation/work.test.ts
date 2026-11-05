import { describe, expect, it } from "vitest";
import { validateWork } from "./work";

const validWork = {
  title: "Creep",
  year: 1992,
  artistId: "radiohead",
  genreIds: ["rock", "alternative"],
};

describe("validateWork", () => {
  it("accepte une œuvre valide", () => {
    expect(validateWork(validWork)).toBeNull();
  });

  it("refuse un titre manquant", () => {
    expect(validateWork({ ...validWork, title: " " })).not.toBeNull();
  });

  it("refuse un artiste manquant", () => {
    expect(validateWork({ ...validWork, artistId: "" })).not.toBeNull();
  });

  it("refuse une année invalide", () => {
    expect(validateWork({ ...validWork, year: 0 })).not.toBeNull();
  });

  it("refuse une œuvre sans genre", () => {
    expect(validateWork({ ...validWork, genreIds: [] })).not.toBeNull();
  });

  it("refuse les genres en double", () => {
    expect(
      validateWork({ ...validWork, genreIds: ["rock", "rock"] }),
    ).not.toBeNull();
  });
});
