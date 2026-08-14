import {
  expect,
  request as playwrightRequest,
  test as base,
  type APIRequestContext,
} from "@playwright/test";

export interface E2EAccount {
  id?: string;
  email: string;
  password: string;
  fullName: string;
  roleCode: "ADMIN" | "STAFF" | "CUSTOMER";
  accessToken: string;
}

export interface E2EAccounts {
  admin: E2EAccount;
  staff: E2EAccount;
  customer: E2EAccount;
}

interface LoginBody {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roleCode: E2EAccount["roleCode"];
  };
}

interface CreatedUserBody {
  id: string;
}

type WorkerFixtures = {
  accounts: E2EAccounts;
};

const apiBaseUrl = process.env.E2E_API_BASE_URL ?? "http://localhost:3000/api";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRoleCode(value: unknown): value is E2EAccount["roleCode"] {
  return ["ADMIN", "STAFF", "CUSTOMER"].includes(String(value));
}

function parseLoginBody(value: unknown): LoginBody {
  if (
    !isRecord(value) ||
    typeof value.accessToken !== "string" ||
    !isRecord(value.user) ||
    typeof value.user.id !== "string" ||
    typeof value.user.email !== "string" ||
    typeof value.user.fullName !== "string" ||
    !isRoleCode(value.user.roleCode)
  ) {
    throw new Error(
      "Authentication response did not match the verified backend contract.",
    );
  }

  return {
    accessToken: value.accessToken,
    user: {
      id: value.user.id,
      email: value.user.email,
      fullName: value.user.fullName,
      roleCode: value.user.roleCode,
    },
  };
}

function parseCreatedUserBody(value: unknown): CreatedUserBody {
  if (!isRecord(value) || typeof value.id !== "string") {
    throw new Error("Admin user response did not include a string id.");
  }

  return { id: value.id };
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required to run authenticated E2E tests.`);
  }

  return value;
}

export function apiUrl(path: string): string {
  return `${apiBaseUrl}${path}`;
}

export function bearerHeaders(accessToken: string): Record<string, string> {
  return { Authorization: `Bearer ${accessToken}` };
}

async function loginViaApi(
  api: APIRequestContext,
  credentials: Pick<E2EAccount, "email" | "password">,
): Promise<LoginBody> {
  const response = await api.post(apiUrl("/auth/login"), {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  expect(response.status(), "The E2E account must be able to log in").toBe(200);

  return parseLoginBody((await response.json()) as unknown);
}

async function createUser(
  api: APIRequestContext,
  adminToken: string,
  account: Omit<E2EAccount, "id" | "accessToken">,
): Promise<E2EAccount> {
  const response = await api.post(apiUrl("/admin/users"), {
    headers: bearerHeaders(adminToken),
    data: {
      email: account.email,
      password: account.password,
      fullName: account.fullName,
      roleCode: account.roleCode,
      status: "ACTIVE",
    },
  });

  expect(response.status(), `Create disposable ${account.roleCode} account`).toBe(201);
  const created = parseCreatedUserBody((await response.json()) as unknown);
  const authenticated = await loginViaApi(api, account);

  return {
    ...account,
    id: created.id,
    accessToken: authenticated.accessToken,
  };
}

async function deleteUser(
  api: APIRequestContext,
  adminToken: string,
  userId: string | undefined,
): Promise<void> {
  if (!userId) return;

  const response = await api.delete(apiUrl(`/admin/users/${userId}`), {
    headers: bearerHeaders(adminToken),
  });

  expect([200, 404], `Clean up disposable user ${userId}`).toContain(response.status());
}

export const test = base.extend<object, WorkerFixtures>({
  accounts: [
    async ({}, provideAccounts) => {
      const api = await playwrightRequest.newContext();
      const runId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      const adminCredentials = {
        email: requiredEnvironment("E2E_ADMIN_EMAIL"),
        password: requiredEnvironment("E2E_ADMIN_PASSWORD"),
      };
      const adminSession = await loginViaApi(api, adminCredentials);
      expect(adminSession.user.roleCode, "The E2E bootstrap account must be ADMIN").toBe(
        "ADMIN",
      );
      const admin: E2EAccount = {
        ...adminCredentials,
        id: adminSession.user.id,
        fullName: adminSession.user.fullName,
        roleCode: "ADMIN",
        accessToken: adminSession.accessToken,
      };
      const password = `P8!${crypto.randomUUID()}aA9`;
      let staff: E2EAccount | undefined;
      let customer: E2EAccount | undefined;

      try {
        staff = await createUser(api, admin.accessToken, {
          email: `phase8.staff.${runId}@example.com`,
          password,
          fullName: "Phase 8 Staff",
          roleCode: "STAFF",
        });
        customer = await createUser(api, admin.accessToken, {
          email: `phase8.customer.${runId}@example.com`,
          password,
          fullName: "Phase 8 Customer",
          roleCode: "CUSTOMER",
        });

        await provideAccounts({ admin, staff, customer });
      } finally {
        await deleteUser(api, admin.accessToken, customer?.id);
        await deleteUser(api, admin.accessToken, staff?.id);
        await api.dispose();
      }
    },
    { scope: "worker" },
  ],
});

export { expect };
