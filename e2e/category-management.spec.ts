import { test, expect, apiUrl, bearerHeaders } from "./support/fixtures";
import { loginThroughUi } from "./support/ui";

function responseId(value: unknown): string {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "string"
  ) {
    throw new Error("Category response did not include a string id.");
  }

  return value.id;
}

test.describe("Phase 7 category management regression", () => {
  test("ADMIN category lifecycle honors hierarchy, conflicts, restore, and slug rules", async ({
    page,
    request,
    accounts,
  }) => {
    const runId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const parentName = `Phase 8 Parent ${runId}`;
    const childName = `Phase 8 Child ${runId}`;
    const editedChildName = `${childName} Edited`;
    const parentSlug = `phase8-parent-${runId}`;
    const childSlug = `phase8-child-${runId}`;
    const updatedChildSlug = `${childSlug}-updated`;
    let parentId: string | undefined;
    let childId: string | undefined;

    await loginThroughUi(page, accounts.admin);
    await page.goto("/admin/categories");
    await expect(page.getByRole("heading", { name: "カテゴリ管理" })).toBeVisible();

    try {
      await page
        .getByRole("button", { name: "カテゴリを作成", exact: true })
        .first()
        .click();
      await page.getByLabel("カテゴリ名").fill(parentName);
      await page
        .getByLabel("スラッグ")
        .fill(parentSlug.toUpperCase().replaceAll("-", " "));
      const [parentResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith("/api/categories") &&
            response.request().method() === "POST",
        ),
        page
          .getByRole("dialog")
          .getByRole("button", { name: "カテゴリを作成", exact: true })
          .click(),
      ]);
      expect(parentResponse.status()).toBe(201);
      parentId = responseId((await parentResponse.json()) as unknown);
      await expect(page.locator("tr").filter({ hasText: parentSlug })).toBeVisible();

      await page
        .getByRole("button", { name: "カテゴリを作成", exact: true })
        .first()
        .click();
      await page.getByLabel("カテゴリ名").fill(childName);
      await page.getByLabel("スラッグ").fill(childSlug);
      await page.getByLabel("親カテゴリ").selectOption({ label: parentName });
      const [childResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith("/api/categories") &&
            response.request().method() === "POST",
        ),
        page
          .getByRole("dialog")
          .getByRole("button", { name: "カテゴリを作成", exact: true })
          .click(),
      ]);
      expect(childResponse.status()).toBe(201);
      childId = responseId((await childResponse.json()) as unknown);
      let childRow = page.locator("tr").filter({ hasText: childSlug });
      await expect(childRow).toContainText(parentName);

      await childRow.getByRole("button", { name: `${childName}を編集` }).click();
      await page.getByLabel("カテゴリ名").fill(editedChildName);
      await page.getByLabel("スラッグ").fill(updatedChildSlug);
      const [editResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${childId}`) &&
            response.request().method() === "PATCH",
        ),
        page.getByRole("dialog").getByRole("button", { name: "変更を保存" }).click(),
      ]);
      expect(editResponse.status()).toBe(200);
      childRow = page.locator("tr").filter({ hasText: updatedChildSlug });
      await expect(childRow).toContainText(editedChildName);

      await childRow.getByRole("button", { name: `${editedChildName}を無効化` }).click();
      const [disableResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${childId}`) &&
            response.request().method() === "PATCH",
        ),
        page.getByRole("dialog").getByRole("button", { name: "無効にする" }).click(),
      ]);
      expect(disableResponse.status()).toBe(200);
      childRow = page.locator("tr").filter({ hasText: updatedChildSlug });
      await expect(
        childRow.getByRole("button", { name: `${editedChildName}を有効化` }),
      ).toBeVisible();

      await childRow.getByRole("button", { name: `${editedChildName}を有効化` }).click();
      const [enableResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${childId}`) &&
            response.request().method() === "PATCH",
        ),
        page.getByRole("dialog").getByRole("button", { name: "有効にする" }).click(),
      ]);
      expect(enableResponse.status()).toBe(200);

      await page
        .getByRole("button", { name: "カテゴリを作成", exact: true })
        .first()
        .click();
      await page.getByLabel("カテゴリ名").fill(`${parentName} Duplicate`);
      await page.getByLabel("スラッグ").fill(parentSlug);
      const [duplicateResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith("/api/categories") &&
            response.request().method() === "POST",
        ),
        page
          .getByRole("dialog")
          .getByRole("button", { name: "カテゴリを作成", exact: true })
          .click(),
      ]);
      expect(duplicateResponse.status()).toBe(409);
      await expect(page.getByRole("dialog").getByRole("alert")).toBeVisible();
      await page.getByRole("dialog").getByRole("button", { name: "キャンセル" }).click();

      const parentRow = page.locator("tr").filter({ hasText: parentSlug });
      await parentRow.getByRole("button", { name: `${parentName}を削除` }).click();
      const [parentConflictResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${parentId}`) &&
            response.request().method() === "DELETE",
        ),
        page.getByRole("dialog").getByRole("button", { name: "削除する" }).click(),
      ]);
      expect(parentConflictResponse.status()).toBe(409);
      await expect(page.getByRole("dialog").getByRole("alert")).toBeVisible();
      await page.getByRole("dialog").getByRole("button", { name: "キャンセル" }).click();

      childRow = page.locator("tr").filter({ hasText: updatedChildSlug });
      await childRow.getByRole("button", { name: `${editedChildName}を削除` }).click();
      const [deleteResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${childId}`) &&
            response.request().method() === "DELETE",
        ),
        page.getByRole("dialog").getByRole("button", { name: "削除する" }).click(),
      ]);
      expect(deleteResponse.status()).toBe(200);
      await expect(page.locator("tr").filter({ hasText: updatedChildSlug })).toHaveCount(
        0,
      );

      const [restoreResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${childId}/restore`) &&
            response.request().method() === "PATCH",
        ),
        page.getByRole("button", { name: "復元する" }).click(),
      ]);
      expect(restoreResponse.status()).toBe(200);
      await expect(
        page.locator("tr").filter({ hasText: updatedChildSlug }),
      ).toBeVisible();

      childRow = page.locator("tr").filter({ hasText: updatedChildSlug });
      await childRow.getByRole("button", { name: `${editedChildName}を削除` }).click();
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${childId}`) &&
            response.request().method() === "DELETE",
        ),
        page.getByRole("dialog").getByRole("button", { name: "削除する" }).click(),
      ]);

      await page
        .getByRole("button", { name: "カテゴリを作成", exact: true })
        .first()
        .click();
      await page.getByLabel("カテゴリ名").fill(`${childName} Reuse`);
      await page.getByLabel("スラッグ").fill(updatedChildSlug);
      const [reservedSlugResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith("/api/categories") &&
            response.request().method() === "POST",
        ),
        page
          .getByRole("dialog")
          .getByRole("button", { name: "カテゴリを作成", exact: true })
          .click(),
      ]);
      expect(reservedSlugResponse.status()).toBe(409);
      await page.getByRole("dialog").getByRole("button", { name: "キャンセル" }).click();

      await parentRow.getByRole("button", { name: `${parentName}を削除` }).click();
      const [parentDeleteResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/categories/${parentId}`) &&
            response.request().method() === "DELETE",
        ),
        page.getByRole("dialog").getByRole("button", { name: "削除する" }).click(),
      ]);
      expect(parentDeleteResponse.status()).toBe(200);
    } finally {
      if (childId) {
        await request.delete(apiUrl(`/categories/${childId}`), {
          headers: bearerHeaders(accounts.admin.accessToken),
        });
      }
      if (parentId) {
        await request.delete(apiUrl(`/categories/${parentId}`), {
          headers: bearerHeaders(accounts.admin.accessToken),
        });
      }
    }
  });

  test("category mutations enforce STAFF, CUSTOMER, and Guest permissions", async ({
    request,
    accounts,
  }) => {
    const slug = `phase8-permission-${Date.now()}`;
    const staffCreate = await request.post(apiUrl("/categories"), {
      headers: bearerHeaders(accounts.staff.accessToken),
      data: { name: "Phase 8 Permission", slug },
    });
    expect(staffCreate.status()).toBe(201);
    const categoryId = responseId((await staffCreate.json()) as unknown);

    try {
      const customerUpdate = await request.patch(apiUrl(`/categories/${categoryId}`), {
        headers: bearerHeaders(accounts.customer.accessToken),
        data: { isActive: false },
      });
      expect(customerUpdate.status()).toBe(403);

      const guestDelete = await request.delete(apiUrl(`/categories/${categoryId}`));
      expect(guestDelete.status()).toBe(401);
    } finally {
      const staffDelete = await request.delete(apiUrl(`/categories/${categoryId}`), {
        headers: bearerHeaders(accounts.staff.accessToken),
      });
      expect(staffDelete.status()).toBe(200);
    }
  });
});
