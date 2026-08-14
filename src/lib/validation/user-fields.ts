import { z } from "zod";

export const PHONE_CHARACTERS_PATTERN = /^[0-9+\-\s()]+$/;

export const userEmailSchema = z
  .string()
  .trim()
  .email("有効なメールアドレスを入力してください")
  .max(255, "メールアドレスは255文字以内で入力してください");

export const userFullNameSchema = z
  .string()
  .trim()
  .min(1, "お名前を入力してください")
  .max(100, "お名前は100文字以内で入力してください");
