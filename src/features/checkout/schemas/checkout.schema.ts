import { z } from "zod";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateOnly(value: string): boolean {
  if (!dateOnlyPattern.test(value)) {
    return false;
  }

  const parts = value.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  if (year === undefined || month === undefined || day === undefined) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const checkoutSchema = z.object({
  addressId: z.string().trim().min(1, "配送先を選択してください"),
  deliveryDate: z
    .string()
    .min(1, "配送日を選択してください")
    .refine(isValidDateOnly, "配送日の形式が正しくありません"),
  timeSlotId: z.string().trim().min(1, "配送時間帯を選択してください"),
  note: z.string().max(1000, "備考は1000文字以内で入力してください"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
