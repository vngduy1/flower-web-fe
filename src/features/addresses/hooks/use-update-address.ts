"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAddress } from "../api/addresses.api";
import { addressKeys } from "../api/addresses.queries";

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.list() }),
  });
}
