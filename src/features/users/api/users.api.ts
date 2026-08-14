import { apiClient } from "@/lib/api";

import type { UpdateProfileRequest, User } from "../types/user.types";

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>("/users/me");

  return response.data;
}

export async function updateCurrentUser(request: UpdateProfileRequest): Promise<User> {
  const response = await apiClient.patch<User>("/users/me", request);

  return response.data;
}
