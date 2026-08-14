import { expect, type Page } from "@playwright/test";

import type { E2EAccount } from "./fixtures";

export async function loginThroughUi(page: Page, account: E2EAccount): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("メールアドレス").fill(account.email);
  await page.getByLabel("パスワード").fill(account.password);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/);
}

export async function expectPageReady(page: Page): Promise<void> {
  await expect(page.locator("main h1").first()).toBeVisible();
  await expect(page.locator('[class*="animate-pulse"]')).toHaveCount(0, {
    timeout: 15_000,
  });
}
