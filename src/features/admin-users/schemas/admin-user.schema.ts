import { z } from "zod";

import { PHONE_CHARACTERS_PATTERN } from "@/lib/validation/user-fields";

export const adminUserFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "メールアドレスは5文字以上で入力してください。")
    .max(255, "メールアドレスは255文字以内で入力してください。")
    .email("有効なメールアドレスを入力してください。"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください。")
    .max(72, "パスワードは72文字以内で入力してください。"),
  fullName: z
    .string()
    .trim()
    .min(1, "氏名を入力してください。")
    .max(100, "氏名は100文字以内で入力してください。"),
  phone: z
    .string()
    .trim()
    .max(20, "電話番号は20文字以内で入力してください。")
    .refine((value) => !value || value.length >= 8, {
      message: "電話番号は8文字以上で入力してください。",
    })
    .refine((value) => !value || PHONE_CHARACTERS_PATTERN.test(value), {
      message: "電話番号に使用できない文字が含まれています。",
    }),
  roleCode: z.enum(["ADMIN", "STAFF", "CUSTOMER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

export type AdminUserFormValues = z.infer<typeof adminUserFormSchema>;
