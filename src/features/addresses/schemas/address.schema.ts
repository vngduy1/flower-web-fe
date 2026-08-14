import { z } from "zod";

const phonePattern = /^[0-9+\-\s()]+$/;
const postalCodePattern = /^\d{3}-?\d{4}$/;

export const addressSchema = z.object({
  label: z.string().trim().max(50, "ラベルは50文字以内で入力してください"),
  recipientName: z
    .string()
    .trim()
    .min(1, "受取人名を入力してください")
    .max(100, "受取人名は100文字以内で入力してください"),
  recipientPhone: z
    .string()
    .trim()
    .min(1, "電話番号を入力してください")
    .max(20, "電話番号は20文字以内で入力してください")
    .regex(phonePattern, "電話番号の形式が正しくありません"),
  postalCode: z
    .string()
    .trim()
    .regex(postalCodePattern, "郵便番号は1234567または123-4567形式です"),
  prefecture: z
    .string()
    .trim()
    .min(1, "都道府県を入力してください")
    .max(20, "都道府県は20文字以内で入力してください"),
  city: z
    .string()
    .trim()
    .min(1, "市区町村を入力してください")
    .max(100, "市区町村は100文字以内で入力してください"),
  addressLine1: z
    .string()
    .trim()
    .min(1, "番地を入力してください")
    .max(255, "番地は255文字以内で入力してください"),
  addressLine2: z
    .string()
    .trim()
    .max(255, "建物名・部屋番号は255文字以内で入力してください"),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
