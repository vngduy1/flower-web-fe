import { z } from "zod";

export const updateAdminOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  note: z.string().max(500, "メモは500文字以内で入力してください。"),
});

export type UpdateAdminOrderStatusValues = z.infer<typeof updateAdminOrderStatusSchema>;
