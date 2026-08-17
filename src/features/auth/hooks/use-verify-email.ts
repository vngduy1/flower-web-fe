"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyEmail } from "../api/auth.api";
import type { VerifyEmailFormValues } from "../schemas/auth.schemas";

interface VerifyEmailMutationValues extends VerifyEmailFormValues {
  email: string;
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (values: VerifyEmailMutationValues) =>
      verifyEmail({
        email: values.email,
        code: values.code,
      }),
  });
}
