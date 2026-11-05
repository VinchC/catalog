import { test, expect } from "@playwright/test";

test.describe("Pages publiques", () => {
  test("la page d'accueil est accessible", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });

  test("le catalogue musical est accessible", async ({ page }) => {
    const response = await page.goto("/catalog/music");
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });

  test("la page À propos est accessible", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });

  test("le catalogue cinéma désactivé affiche la page 404", async ({
    page,
  }) => {
    await page.goto("/catalog/cinema");

    await expect(
      page.getByRole("heading", { name: "Page introuvable" }),
    ).toBeVisible();

    await expect(page.getByText("Erreur 404")).toBeVisible();
  });
});
