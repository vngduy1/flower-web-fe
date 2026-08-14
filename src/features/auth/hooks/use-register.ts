"use client";

import { useMutation } from "@tanstack/react-query";

import { register } from "../api/auth.api";
import type { RegisterFormValues } from "../schemas/auth.schemas";
import { toRegisterRequest } from "../utils/auth-mappers";

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => register(toRegisterRequest(values)),
  });
}
