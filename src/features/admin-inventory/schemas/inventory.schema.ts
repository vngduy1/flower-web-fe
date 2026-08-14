import { z } from "zod";

export const inventoryAdjustmentSchema = z
  .object({
    changeType: z.enum(["IMPORT", "MANUAL_INCREASE", "MANUAL_DECREASE", "ADJUSTMENT"]),
    quantity: z
      .number()
      .int("整数で入力してください。")
      .min(0, "0以上で入力してください。"),
    reason: z.string().max(500, "理由は500文字以内で入力してください。"),
  })
  .superRefine((data, context) => {
    if (data.changeType !== "ADJUSTMENT" && data.quantity <= 0) {
      context.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "増減数は1以上で入力してください。",
      });
    }
  });

export const thresholdSchema = z.object({
  lowStockThreshold: z.number().int("整数で入力してください。").min(0),
});

export type InventoryAdjustmentValues = z.infer<typeof inventoryAdjustmentSchema>;
export type ThresholdValues = z.infer<typeof thresholdSchema>;
