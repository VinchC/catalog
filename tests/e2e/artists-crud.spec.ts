import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

// Crée un artiste avec un nom unique pour éviter les conflits entre tests.
async function createArtist(
  page: import("@playwright/test").Page,
  name: string,
) {
  await page.goto("/catalog/music/artists/new");

  await page.locator('[name="name"]').fill(name);
  await page.locator('[name="country"]').fill("France");
  await page.locator('[name="startYear"]').fill("2020");
  await page.locator('[name="endYear"]').fill("");

  await page.locator("form").getByRole("button", { name: /créer/i }).click();

  await expect(page).toHaveURL(/notice=artist-created/);
}

// Récupère la fiche d'un artiste dans la liste du catalogue.
function artistCard(page: import("@playwright/test").Page, name: string) {
  return page.locator("li").filter({
    has: page.getByRole("heading", { name }),
  });
}

test.describe("CRUD artistes - USER", () => {
  test("création et modification autorisées, suppression interdite", async ({
    page,
  }) => {
    await loginAs(page, "USER");

    const originalName = `Artiste USER ${Date.now()}`;
    const updatedName = `${originalName} modifié`;

    await createArtist(page, originalName);

    await expect(
      page.getByRole("heading", { name: originalName }),
    ).toBeVisible();

    const card = artistCard(page, originalName);

    await card.locator('a[href$="/edit"]').click();

    // Attend la fin de la navigation vers la page de modification.
    await expect(page).toHaveURL(/\/artists\/[^/]+\/edit$/);

    // Cible le champ du formulaire réellement visible.
    const nameInput = page.locator("form:visible").locator('[name="name"]');

    await expect(nameInput).toBeVisible();
    await nameInput.fill(updatedName);

    await page
      .locator("form")
      .getByRole("button", { name: /modifier|enregistrer/i })
      .click();

    await expect(page).toHaveURL(/notice=artist-updated/);

    await expect(
      page.getByRole("heading", { name: updatedName }),
    ).toBeVisible();

    // Un utilisateur ne doit pas disposer du bouton de suppression.
    await expect(
      artistCard(page, updatedName).getByRole("button", {
        name: "Supprimer",
      }),
    ).toHaveCount(0);
  });
});

test.describe("CRUD artistes - ADMIN", () => {
  test("création, modification et suppression autorisées", async ({ page }) => {
    await loginAs(page, "ADMIN");

    const originalName = `Artiste ADMIN ${Date.now()}`;
    const updatedName = `${originalName} modifié`;

    await createArtist(page, originalName);

    const card = artistCard(page, originalName);

    await expect(card).toBeVisible();

    await card.locator('a[href$="/edit"]').click();

    // Attend la fin de la navigation vers la page de modification.
    await expect(page).toHaveURL(/\/artists\/[^/]+\/edit$/);

    // Cible le champ du formulaire réellement visible.
    const nameInput = page.locator("form:visible").locator('[name="name"]');

    await expect(nameInput).toBeVisible();
    await nameInput.fill(updatedName);

    await page
      .locator("form")
      .getByRole("button", { name: /modifier|enregistrer/i })
      .click();

    await expect(page).toHaveURL(/notice=artist-updated/);

    const updatedCard = artistCard(page, updatedName);

    await expect(updatedCard).toBeVisible();

    // Accepte la confirmation de suppression.
    page.once("dialog", (dialog) => dialog.accept());

    await updatedCard.getByRole("button", { name: "Supprimer" }).click();

    await expect(page).toHaveURL(/notice=artist-deleted/);

    await expect(page.getByRole("heading", { name: updatedName })).toHaveCount(
      0,
    );
  });
});
