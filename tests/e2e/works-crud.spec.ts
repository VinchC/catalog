import { test, expect, type Page } from "@playwright/test";
import { loginAs } from "./helpers/auth";

// Crée une œuvre avec un titre unique et les premières options disponibles.
async function createWork(page: Page, title: string) {
  await page.goto("/catalog/music/works/new");

  await page.locator('[name="title"]').fill(title);
  await page.locator('[name="year"]').fill("2026");

  // Sélectionne le premier artiste et le premier genre disponibles.
  await page.locator('[name="artistId"]').selectOption({ index: 1 });
  await page.locator('[name="genreIds"]').first().check();

  await page
    .locator("form")
    .getByRole("button", { name: /créer l’œuvre/i })
    .click();

  await expect(page).toHaveURL(/notice=created/);
}

// Ouvre la fiche détaillée d'une œuvre depuis le catalogue.
async function openWork(page: Page, title: string) {
  await page.getByRole("link", { name: title, exact: true }).click();

  await expect(page).toHaveURL(/\/catalog\/music\/works\/[^/]+$/);
}

// Modifie le titre d'une œuvre depuis sa fiche.
async function editWork(page: Page, oldTitle: string, newTitle: string) {
  await openWork(page, oldTitle);

  await page.getByRole("link", { name: /modifier cette œuvre/i }).click();

  await expect(page).toHaveURL(/\/works\/[^/]+\/edit$/);

  const titleInput = page.locator("form:visible").locator('[name="title"]');
  await expect(titleInput).toBeVisible();
  await titleInput.fill(newTitle);

  await page
    .locator("form:visible")
    .getByRole("button", { name: /enregistrer les modifications/i })
    .click();

  // Affiche une éventuelle erreur renvoyée par la Server Action.
  const errorMessage = page.locator('[role="alert"]');

  if (await errorMessage.isVisible()) {
    console.log("Erreur modification :", await errorMessage.textContent());
  }

  await expect(page).toHaveURL(/notice=updated/);
  await expect(
    page.getByRole("link", { name: newTitle, exact: true }),
  ).toBeVisible();
}

test.describe("CRUD œuvres - USER", () => {
  test("création et modification autorisées, suppression interdite", async ({
    page,
  }) => {
    await loginAs(page, "USER");

    const originalTitle = `Œuvre USER ${Date.now()}`;
    const updatedTitle = `${originalTitle} modifiée`;

    await createWork(page, originalTitle);

    await expect(
      page.getByRole("link", { name: originalTitle, exact: true }),
    ).toBeVisible();

    await editWork(page, originalTitle, updatedTitle);
    await openWork(page, updatedTitle);

    // Un utilisateur standard ne doit pas disposer du bouton de suppression.
    await expect(page.getByRole("button", { name: /supprimer/i })).toHaveCount(
      0,
    );
  });
});

test.describe("CRUD œuvres - ADMIN", () => {
  test("création, modification et suppression autorisées", async ({ page }) => {
    await loginAs(page, "ADMIN");

    const originalTitle = `Œuvre ADMIN ${Date.now()}`;
    const updatedTitle = `${originalTitle} modifiée`;

    await createWork(page, originalTitle);
    await editWork(page, originalTitle, updatedTitle);
    await openWork(page, updatedTitle);

    const deleteButton = page.getByRole("button", { name: /supprimer/i });

    await expect(deleteButton).toBeVisible();

    // Accepte la boîte de dialogue de confirmation.
    page.once("dialog", (dialog) => dialog.accept());
    await deleteButton.click();

    await expect(page).toHaveURL(/notice=deleted/);

    // L'œuvre supprimée ne doit plus apparaître dans le catalogue.
    await expect(
      page.getByRole("link", { name: updatedTitle, exact: true }),
    ).toHaveCount(0);
  });
});
