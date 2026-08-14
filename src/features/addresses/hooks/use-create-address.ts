"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAddress } from "../api/addresses.api";
import { addressKeys } from "../api/addresses.queries";

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.list() }),
  });
}
