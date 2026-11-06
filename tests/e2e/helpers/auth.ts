import "dotenv/config";

import { expect, type Page } from "@playwright/test";

type Role = "USER" | "ADMIN";

const accounts = {
  USER: {
    email: "user@catalog.local",
    password: process.env.USER_PASSWORD,
  },
  ADMIN: {
    email: "admin@catalog.local",
    password: process.env.ADMIN_PASSWORD,
  },
};

export async function loginAs(page: Page, role: Role): Promise<void> {
  const account = accounts[role];

  if (!account.password) {
    throw new Error(`Mot de passe ${role} absent du fichier .env`);
  }

  await page.goto("/login");

  await page.getByLabel("Adresse e-mail").fill(account.email);
  await page.getByLabel("Mot de passe").fill(account.password);

  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).not.toHaveURL(/\/login/);
}
