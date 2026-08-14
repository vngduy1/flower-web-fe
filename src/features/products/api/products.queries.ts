import { queryOptions } from "@tanstack/react-query";

import { getProductBySlug, getProducts } from "./products.api";
import type { ProductListQuery } from "../types/product";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (query: ProductListQuery) => [...productKeys.lists(), query] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

export function productsQueryOptions(query: ProductListQuery) {
  return queryOptions({
    queryKey: productKeys.list(query),
    queryFn: () => getProducts(query),
    staleTime: 60_000,
  });
}

export function productQueryOptions(slug: string) {
  return queryOptions({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      const product = await getProductBySlug(slug);

      if (!product) {
        throw new Error("商品が見つかりませんでした。");
      }

      return product;
    },
    staleTime: 60_000,
  });
}
