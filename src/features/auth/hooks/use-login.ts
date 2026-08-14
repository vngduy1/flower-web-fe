"use client";

import { useMutation } from "@tanstack/react-query";

import { login } from "../api/auth.api";
import type { LoginFormValues } from "../schemas/auth.schemas";
import { useAuth } from "./use-auth";

export function useLogin() {
  const { establishSession } = useAuth();

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      const user = await establishSession(response.accessToken);

      return user;
    },
  });
}
