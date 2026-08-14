import { z } from "zod";

import {
  PHONE_CHARACTERS_PATTERN,
  userEmailSchema,
  userFullNameSchema,
} from "@/lib/validation/user-fields";

const optionalRegistrationPhone = z
  .string()
  .trim()
  .max(20, "電話番号は20文字以内で入力してください")
  .refine(
    (value) => value.length === 0 || PHONE_CHARACTERS_PATTERN.test(value),
    "電話番号に使用できない文字が含まれています",
  );

export const loginSchema = z.object({
  email: userEmailSchema,
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(72, "パスワードは72文字以内で入力してください"),
});

export const registerSchema = z
  .object({
    fullName: userFullNameSchema,
    email: userEmailSchema,
    phone: optionalRegistrationPhone,
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(100, "パスワードは100文字以内で入力してください"),
    passwordConfirmation: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "確認用パスワードが一致しません",
    path: ["passwordConfirmation"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
