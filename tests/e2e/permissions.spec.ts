import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Permissions utilisateur", () => {
  test("un USER peut créer et modifier, mais pas supprimer", async ({
    page,
  }) => {
    await loginAs(page, "USER");
    await page.goto("/catalog/music");

    // Le lien de création d'artiste est accessible.
    await expect(
      page.locator('a[href="/catalog/music/artists/new"]'),
    ).toBeVisible();

    // Les liens de modification sont accessibles.
    await expect(
      page.locator('a[href^="/catalog/music/artists/"][href$="/edit"]').first(),
    ).toBeVisible();

    // Aucun bouton de suppression ne doit être affiché.
    await expect(page.getByRole("button", { name: "Supprimer" })).toHaveCount(
      0,
    );
  });
});

test.describe("Permissions administrateur", () => {
  test("un ADMIN peut créer, modifier et supprimer", async ({ page }) => {
    await loginAs(page, "ADMIN");
    await page.goto("/catalog/music");

    await expect(
      page.locator('a[href="/catalog/music/artists/new"]'),
    ).toBeVisible();

    await expect(
      page.locator('a[href^="/catalog/music/artists/"][href$="/edit"]').first(),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Supprimer" }).first(),
    ).toBeVisible();
  });
});
