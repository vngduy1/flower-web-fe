import { test, expect, apiUrl, bearerHeaders } from "./support/fixtures";
import { loginThroughUi } from "./support/ui";

function readResponseId(value: unknown): string {
  if (typeof value !== "object" || value === null || !("id" in value)) {
    throw new Error("The category response did not include an id.");
  }

  const { id } = value;
  if (typeof id !== "string") {
    throw new Error("The category response id was not a string.");
  }

  return id;
}

test.describe("authentication and role authorization", () => {
  test("Guest protected-route redirects preserve a safe returnTo", async ({ page }) => {
    await page.goto("/account/profile?source=e2e#security");
    await expect(page).toHaveURL(/\/login\?/);

    let redirected = new URL(page.url());
    expect(redirected.searchParams.get("returnTo")).toBe(
      "/account/profile?source=e2e#security",
    );

    await page.goto("/admin/categories");
    await expect(page).toHaveURL(/\/login\?/);
    redirected = new URL(page.url());
    expect(redirected.searchParams.get("returnTo")).toBe("/admin/categories");
  });

  test("unsafe external returnTo values are rejected", async ({ page, accounts }) => {
    await page.goto(`/login?returnTo=${encodeURIComponent("//example.com/steal")}`);
    await page.getByLabel("メールアドレス").fill(accounts.customer.email);
    await page.getByLabel("パスワード").fill(accounts.customer.password);
    await page.getByRole("button", { name: "ログイン" }).click();

    await expect(page).toHaveURL(/\/account$/);
    expect(new URL(page.url()).origin).toBe(
      new URL(process.env.E2E_BASE_URL ?? "http://localhost:3001").origin,
    );
  });

  test("CUSTOMER session persists, admin access fails, and logout clears it", async ({
    page,
    request,
    accounts,
  }) => {
    await loginThroughUi(page, accounts.customer);
    await expect(page).toHaveURL(/\/account$/);

    await page.goto("/products");
    await expect(page.locator("main h1").first()).toBeVisible();
    await page.goto("/account");
    await expect(page.getByText(accounts.customer.fullName).first()).toBeVisible();

    const forbiddenMutation = await request.post(apiUrl("/categories"), {
      headers: bearerHeaders(accounts.customer.accessToken),
      data: { name: "Forbidden", slug: `forbidden-${Date.now()}` },
    });
    expect(forbiddenMutation.status()).toBe(403);

    await page.goto("/admin/categories");
    await expect(page).toHaveURL(/\/account\?reason=forbidden$/);

    await page.getByText(accounts.customer.fullName, { exact: true }).first().click();
    await page.getByRole("button", { name: "ログアウト" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?returnTo=%2Faccount$/);
  });

  test("STAFF can manage categories but cannot enter ADMIN-only routes", async ({
    page,
    request,
    accounts,
  }) => {
    await loginThroughUi(page, accounts.staff);
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/categories");
    await expect(page.getByRole("heading", { name: "カテゴリ管理" })).toBeVisible();
    await expect(page.getByRole("link", { name: "カテゴリ管理" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.getByRole("link", { name: "ユーザー管理" })).toHaveCount(0);

    const slug = `phase8-staff-${Date.now()}`;
    let createdId: string | undefined;

    try {
      const created = await request.post(apiUrl("/categories"), {
        headers: bearerHeaders(accounts.staff.accessToken),
        data: { name: "Phase 8 Staff Category", slug, isActive: true },
      });
      expect(created.status()).toBe(201);
      const createdBody = (await created.json()) as unknown;
      expect(createdBody).toMatchObject({ slug });
      createdId = readResponseId(createdBody);

      const updated = await request.patch(apiUrl(`/categories/${createdId}`), {
        headers: bearerHeaders(accounts.staff.accessToken),
        data: { isActive: false },
      });
      expect(updated.status()).toBe(200);

      const deleted = await request.delete(apiUrl(`/categories/${createdId}`), {
        headers: bearerHeaders(accounts.staff.accessToken),
      });
      expect(deleted.status()).toBe(200);
      createdId = undefined;
    } finally {
      if (createdId) {
        await request.delete(apiUrl(`/categories/${createdId}`), {
          headers: bearerHeaders(accounts.staff.accessToken),
        });
      }
    }

    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/account\?reason=forbidden$/);
  });

  test("cross-tab token replacement and logout cannot retain the previous user", async ({
    page,
    context,
    accounts,
  }) => {
    await loginThroughUi(page, accounts.customer);
    await expect(page.getByText(accounts.customer.fullName).first()).toBeVisible();

    const sibling = await context.newPage();
    await sibling.goto("/account");
    await expect(sibling.getByText(accounts.customer.fullName).first()).toBeVisible();

    await sibling.evaluate((accessToken) => {
      window.localStorage.setItem("flower-web.access-token", accessToken);
      window.dispatchEvent(new Event("flower-web:auth-session-changed"));
    }, accounts.staff.accessToken);

    await expect(sibling.getByText(accounts.staff.fullName).first()).toBeVisible();
    await expect(page.getByText(accounts.staff.fullName).first()).toBeVisible();
    await expect(page.getByText(accounts.customer.fullName, { exact: true })).toHaveCount(
      0,
    );

    await sibling.goto("/admin/categories");
    await expect(sibling.getByRole("heading", { name: "カテゴリ管理" })).toBeVisible();
    await sibling.locator("summary").filter({ hasText: accounts.staff.fullName }).click();
    await sibling.getByRole("button", { name: "ログアウト" }).click();

    await expect(page).toHaveURL(/\/login\?returnTo=/);
  });

  test("ADMIN can enter every administrative route", async ({ page, accounts }) => {
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
      await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
      await expect(page.locator("main h1").first()).toBeVisible();
    }
  });
});
