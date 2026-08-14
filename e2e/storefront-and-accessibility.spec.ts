import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

import { test, expect } from "./support/fixtures";
import { loginThroughUi } from "./support/ui";

function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"],
): string {
  return violations
    .map(
      (violation) =>
        `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`,
    )
    .join("\n");
}

async function expectMainToHaveNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations, formatViolations(results.violations)).toEqual([]);
}

test.describe("storefront and accessibility regression", () => {
  test("important storefront routes and a real product detail load", async ({ page }) => {
    for (const route of ["/", "/products", "/categories/hoa", "/login", "/register"]) {
      await page.goto(route);
      await expect(page.locator("main h1").first()).toBeVisible();
    }

    await page.goto("/products");
    const productLink = page.locator('main a[href^="/products/"]').first();
    await expect(productLink).toBeVisible();
    const href = await productLink.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href ?? "/products");
    await expect(page.locator("main h1").first()).toBeVisible();
  });

  test("selected public surfaces have no detectable axe violations", async ({ page }) => {
    for (const route of ["/", "/login", "/products"]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expectMainToHaveNoAxeViolations(page);
    }
  });

  test("selected ADMIN surfaces have no detectable axe violations", async ({
    page,
    accounts,
  }) => {
    await loginThroughUi(page, accounts.admin);

    for (const route of ["/admin", "/admin/categories"]) {
      await page.goto(route);
      await expect(page.locator("main h1").first()).toBeVisible();
      await expectMainToHaveNoAxeViolations(page);
    }
  });
});
