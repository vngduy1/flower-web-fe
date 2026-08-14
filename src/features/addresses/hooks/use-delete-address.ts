"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAddress } from "../api/addresses.api";
import { addressKeys } from "../api/addresses.queries";

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.list() }),
  });
}
