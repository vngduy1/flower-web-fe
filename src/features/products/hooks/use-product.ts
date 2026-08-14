"use client";

import { useQuery } from "@tanstack/react-query";

import { productQueryOptions } from "../api/products.queries";

export function useProduct(slug: string) {
  return useQuery(productQueryOptions(slug));
}
