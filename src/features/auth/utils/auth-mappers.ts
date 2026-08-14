import type { RegisterFormValues } from "../schemas/auth.schemas";
import type { RegisterRequest } from "../types/auth.types";

export function toRegisterRequest(values: RegisterFormValues): RegisterRequest {
  const phone = values.phone.trim();

  return {
    email: values.email.trim().toLowerCase(),
    password: values.password,
    fullName: values.fullName.trim(),
    ...(phone ? { phone } : {}),
  };
}
