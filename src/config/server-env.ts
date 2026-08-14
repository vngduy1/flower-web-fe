import "server-only";
import { z } from "zod";

const serverEnvironmentSchema = z.object({
  BACKEND_API_BASE_URL: z.url().transform((value) => value.replace(/\/$/, "")),
  HEALTHCHECK_TIMEOUT_MS: z.coerce.number().int().min(250).max(10_000).default(3_000),
});

export function getServerEnvironment() {
  const result = serverEnvironmentSchema.safeParse({
    BACKEND_API_BASE_URL: process.env.BACKEND_API_BASE_URL,
    HEALTHCHECK_TIMEOUT_MS: process.env.HEALTHCHECK_TIMEOUT_MS,
  });

  if (!result.success) {
    const invalidKeys = result.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");

    throw new Error(
      `Invalid server environment configuration${invalidKeys ? `: ${invalidKeys}` : ""}`,
    );
  }

  return result.data;
}
