"use client";

import { useQuery } from "@tanstack/react-query";

import { productsQueryOptions } from "../api/products.queries";
import type { ProductListQuery } from "../types/product";

export function useProducts(query: ProductListQuery) {
  return useQuery(productsQueryOptions(query));
}
