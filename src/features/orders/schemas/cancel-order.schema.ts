import { z } from "zod";

export const cancelOrderSchema = z.object({
  reason: z.string().max(500, "キャンセル理由は500文字以内で入力してください。"),
});

export type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>;
