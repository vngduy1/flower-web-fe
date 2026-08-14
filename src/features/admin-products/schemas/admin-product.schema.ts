import { z } from "zod";

const decimal = /^\d+(?:\.\d{1,2})?$/;
const optionalDecimal = z
  .string()
  .trim()
  .refine((value) => !value || decimal.test(value), {
    message: "0以上、小数点以下2桁以内で入力してください。",
  });

export const productFormSchema = z
  .object({
    productCode: z.string().trim().min(1, "商品コードは必須です。").max(50),
    name: z.string().trim().min(1, "商品名は必須です。").max(200),
    slug: z.string().trim().min(1, "スラッグは必須です。").max(220),
    categoryId: z.string().min(1, "カテゴリーを選択してください。"),
    description: z.string().max(5000).default(""),
    basePrice: z
      .string()
      .trim()
      .regex(decimal, "0以上、小数点以下2桁以内で入力してください。"),
    salePrice: optionalDecimal.default(""),
    costPrice: optionalDecimal.default(""),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "SOLD_OUT"]),
    isFeatured: z.boolean(),
    availableFrom: z.string().default(""),
    availableUntil: z.string().default(""),
    preparationDays: z.number().int().min(0).max(365),
  })
  .superRefine((data, context) => {
    if (data.salePrice && Number(data.salePrice) > Number(data.basePrice)) {
      context.addIssue({
        code: "custom",
        path: ["salePrice"],
        message: "セール価格は通常価格以下にしてください。",
      });
    }
    if (
      data.availableFrom &&
      data.availableUntil &&
      new Date(data.availableFrom) >= new Date(data.availableUntil)
    ) {
      context.addIssue({
        code: "custom",
        path: ["availableUntil"],
        message: "終了日時は開始日時より後にしてください。",
      });
    }
  });

export type ProductFormValues = z.input<typeof productFormSchema>;
