import type { UpdateProfileFormValues } from "../schemas/profile.schema";
import type { UpdateProfileRequest } from "../types/user.types";

export function toUpdateProfileRequest(
  values: UpdateProfileFormValues,
): UpdateProfileRequest {
  const phone = values.phone.trim();

  return {
    fullName: values.fullName.trim(),
    ...(phone ? { phone } : {}),
  };
}
