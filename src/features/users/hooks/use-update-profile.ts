"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/features/auth/api/auth.queries";
import type { AuthenticatedUser } from "@/features/auth/types/auth.types";

import { updateCurrentUser } from "../api/users.api";
import { userKeys } from "../api/users.queries";
import type { UpdateProfileFormValues } from "../schemas/profile.schema";
import { toUpdateProfileRequest } from "../utils/profile-mappers";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateProfileFormValues) =>
      updateCurrentUser(toUpdateProfileRequest(values)),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.me(), updatedUser);
      queryClient.setQueryData<AuthenticatedUser>(authKeys.profile(), (currentUser) =>
        currentUser
          ? {
              ...currentUser,
              fullName: updatedUser.fullName,
              phone: updatedUser.phone,
            }
          : currentUser,
      );
    },
  });
}
