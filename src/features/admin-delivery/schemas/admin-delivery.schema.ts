import { z } from "zod";

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .max(maxLength, `${label}は${maxLength}文字以内で入力してください。`);

const finiteNumber = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `${label}は数値で入力してください。`,
    });

const integer = (label: string, min: number, max?: number) =>
  finiteNumber(label)
    .refine((value) => Number.isInteger(Number(value)), {
      message: `${label}は整数で入力してください。`,
    })
    .refine((value) => Number(value) >= min, {
      message: `${label}は${min}以上で入力してください。`,
    })
    .refine((value) => max === undefined || Number(value) <= max, {
      message: `${label}は${max ?? "指定値"}以下で入力してください。`,
    });

const dateOnly = (label: string) =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label}を正しく入力してください。`)
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const parsed = new Date(Date.UTC(year ?? 0, (month ?? 0) - 1, day));

      return (
        parsed.getUTCFullYear() === year &&
        parsed.getUTCMonth() === (month ?? 0) - 1 &&
        parsed.getUTCDate() === day
      );
    }, `${label}を正しく入力してください。`);

const timeOnly = (label: string) =>
  z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, `${label}はHH:mm形式で入力してください。`);

export const deliveryAreaFormSchema = z.object({
  prefecture: requiredText("都道府県", 100),
  city: requiredText("市区町村", 100),
  areaName: requiredText("エリア名", 150),
  deliveryFee: finiteNumber("配送料")
    .refine((value) => Number(value) >= 0, "配送料は0以上で入力してください。")
    .refine(
      (value) => Number(value) <= 1_000_000,
      "配送料は1,000,000以下で入力してください。",
    ),
  isActive: z.boolean(),
});

export const deliveryTimeSlotFormSchema = z
  .object({
    slotCode: requiredText("時間帯コード", 50).regex(
      /^[A-Z0-9_]+$/,
      "時間帯コードは半角大文字、数字、アンダースコアのみ使用できます。",
    ),
    displayName: requiredText("表示名", 100),
    startTime: timeOnly("開始時刻"),
    endTime: timeOnly("終了時刻"),
    defaultCapacity: integer("既定容量", 1, 1000),
    sortOrder: integer("表示順", 0),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.startTime >= values.endTime) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "終了時刻は開始時刻より後にしてください。",
      });
    }
  });

export const deliveryBlackoutDateFormSchema = z.object({
  blackoutDate: dateOnly("配送不可日"),
  reason: requiredText("理由", 255),
  isActive: z.boolean(),
});

export const deliveryCapacityFormSchema = z.object({
  deliveryDate: dateOnly("配送日"),
  timeSlotId: z.string().trim().min(1, "時間帯を選択してください。"),
  maxOrders: integer("最大注文数", 1, 10_000),
  isActive: z.boolean(),
});

export type DeliveryAreaFormValues = z.infer<typeof deliveryAreaFormSchema>;
export type DeliveryTimeSlotFormValues = z.infer<typeof deliveryTimeSlotFormSchema>;
export type DeliveryBlackoutDateFormValues = z.infer<
  typeof deliveryBlackoutDateFormSchema
>;
export type DeliveryCapacityFormValues = z.infer<typeof deliveryCapacityFormSchema>;
