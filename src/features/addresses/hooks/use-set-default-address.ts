"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setDefaultAddress } from "../api/addresses.api";
import { addressKeys } from "../api/addresses.queries";

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.list() }),
  });
}
