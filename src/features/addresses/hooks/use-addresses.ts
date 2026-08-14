"use client";

import { useQuery } from "@tanstack/react-query";

import { addressesQueryOptions } from "../api/addresses.queries";

export function useAddresses(enabled = true) {
  return useQuery({ ...addressesQueryOptions(), enabled });
}
