import { test, expect } from "./support/fixtures";
import { expectPageReady, loginThroughUi } from "./support/ui";

test.describe("admin production smoke coverage", () => {
  test("critical admin screens load data without runtime errors", async ({
    page,
    accounts,
  }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await loginThroughUi(page, accounts.admin);

    for (const route of [
      "/admin",
      "/admin/products",
      "/admin/inventories",
      "/admin/orders",
      "/admin/coupons",
      "/admin/users",
      "/admin/reviews",
      "/admin/delivery",
      "/admin/categories",
    ]) {
      await page.goto(route);
      await expectPageReady(page);
      await expect(page.getByText("問題が発生しました", { exact: true })).toHaveCount(0);
    }

    expect(runtimeErrors).toEqual([]);
  });

  test("critical administrative actions remain reachable", async ({ page, accounts }) => {
    await loginThroughUi(page, accounts.admin);

    await page.goto("/admin/products");
    await expect(page.locator('a[href="/admin/products/new"]')).toBeVisible();

    await page.goto("/admin/coupons");
    await expect(page.locator('a[href="/admin/coupons/new"]')).toBeVisible();

    await page.goto("/admin/users");
    await expect(page.locator('a[href="/admin/users/new"]')).toBeVisible();

    await page.goto("/admin/categories");
    await expect(
      page.getByRole("button", { name: "カテゴリを作成", exact: true }).first(),
    ).toBeVisible();

    await page.goto("/admin/inventories");
    await expect(page.locator("main form").first()).toBeVisible();

    await page.goto("/admin/orders");
    await expect(page.locator("main form").first()).toBeVisible();

    await page.goto("/admin/reviews");
    await expect(page.locator("main form").first()).toBeVisible();

    await page.goto("/admin/delivery");
    await expect(page.locator("main button").first()).toBeVisible();
  });
});
