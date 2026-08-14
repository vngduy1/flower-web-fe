"use client";

import { useQuery } from "@tanstack/react-query";

import { cartQueryOptions } from "../api/cart.queries";

export function useCart(enabled = true) {
  return useQuery({ ...cartQueryOptions(), enabled });
}
