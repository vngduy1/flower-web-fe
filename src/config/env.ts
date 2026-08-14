import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_API_BASE_URL is required")
    .refine(
      (value) => value.startsWith("/") || URL.canParse(value),
      "NEXT_PUBLIC_API_BASE_URL must be a relative path or a valid URL",
    ),
});

const parsedEnvironment = publicEnvironmentSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!parsedEnvironment.success) {
  const invalidKeys = parsedEnvironment.error.issues
    .map((issue) => issue.path.join("."))
    .filter(Boolean)
    .join(", ");

  throw new Error(
    `Invalid public environment configuration${invalidKeys ? `: ${invalidKeys}` : ""}`,
  );
}

export const env = Object.freeze(parsedEnvironment.data);
