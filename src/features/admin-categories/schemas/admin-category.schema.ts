import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "カテゴリ名を入力してください。")
    .max(100, "カテゴリ名は100文字以内で入力してください。"),
  slug: z
    .string()
    .trim()
    .min(1, "スラッグを入力してください。")
    .max(120, "スラッグは120文字以内で入力してください。"),
  parentId: z.string(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
