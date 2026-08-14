import { z } from "zod";

import {
  PHONE_CHARACTERS_PATTERN,
  userFullNameSchema,
} from "@/lib/validation/user-fields";

export const updateProfileSchema = z.object({
  fullName: userFullNameSchema,
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || (value.length >= 8 && value.length <= 20),
      "電話番号は8〜20文字で入力してください",
    )
    .refine(
      (value) => value.length === 0 || PHONE_CHARACTERS_PATTERN.test(value),
      "電話番号に使用できない文字が含まれています",
    ),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
