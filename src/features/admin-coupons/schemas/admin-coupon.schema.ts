import { z } from "zod";

const requiredNumber = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `${label}は数値で入力してください。`,
    });

const optionalNumber = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => !value || Number.isFinite(Number(value)), {
      message: `${label}は数値で入力してください。`,
    });

const dateTime = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .refine((value) => Number.isFinite(new Date(value).getTime()), {
      message: `${label}が正しくありません。`,
    });

export const adminCouponFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "クーポンコードを入力してください。")
      .max(50, "クーポンコードは50文字以内で入力してください。"),
    name: z
      .string()
      .trim()
      .min(1, "クーポン名を入力してください。")
      .max(150, "クーポン名は150文字以内で入力してください。"),
    description: z.string().max(500, "説明は500文字以内で入力してください。"),
    discountType: z.enum(["FIXED_AMOUNT", "PERCENTAGE"]),
    discountValue: requiredNumber("割引値").refine(
      (value) => Number(value) >= 0.01,
      "割引値は0.01以上で入力してください。",
    ),
    minimumOrderAmount: requiredNumber("最低注文額").refine(
      (value) => Number(value) >= 0,
      "最低注文額は0以上で入力してください。",
    ),
    maximumDiscountAmount: optionalNumber("最大割引額").refine(
      (value) => !value || Number(value) > 0,
      "最大割引額は0より大きい値で入力してください。",
    ),
    usageLimit: optionalNumber("総利用上限").refine(
      (value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 1),
      "総利用上限は1以上の整数で入力してください。",
    ),
    perUserLimit: optionalNumber("お客様ごとの利用上限").refine(
      (value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 1),
      "お客様ごとの利用上限は1以上の整数で入力してください。",
    ),
    startsAt: dateTime("開始日時"),
    endsAt: dateTime("終了日時"),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.discountType === "PERCENTAGE" && Number(values.discountValue) > 100) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "パーセント割引は100以下で入力してください。",
      });
    }

    if (
      Number.isFinite(new Date(values.startsAt).getTime()) &&
      Number.isFinite(new Date(values.endsAt).getTime()) &&
      new Date(values.startsAt) >= new Date(values.endsAt)
    ) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "終了日時は開始日時より後にしてください。",
      });
    }
  });

export type AdminCouponFormValues = z.infer<typeof adminCouponFormSchema>;
