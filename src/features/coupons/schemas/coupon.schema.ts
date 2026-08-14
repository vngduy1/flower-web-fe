import { z } from "zod";

export const couponCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "クーポンコードを入力してください")
    .max(50, "クーポンコードは50文字以内で入力してください"),
});

export type CouponCodeFormValues = z.infer<typeof couponCodeSchema>;
