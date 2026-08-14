import { z } from "zod";

export const createReviewSchema = z.object({
  orderItemId: z.string().min(1, "購入した商品を選択してください。"),
  rating: z
    .number()
    .int("評価は整数で選択してください。")
    .min(1, "評価を選択してください。")
    .max(5, "評価は5以下で選択してください。"),
  title: z.string().max(150, "タイトルは150文字以内で入力してください。"),
  comment: z
    .string()
    .trim()
    .min(1, "レビュー本文を入力してください。")
    .max(3000, "レビュー本文は3000文字以内で入力してください。"),
});

export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;
