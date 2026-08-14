import { queryOptions } from "@tanstack/react-query";
import { getProductImages } from "@/features/products/api/products.api";

import { getAdminProduct, getAdminProducts } from "./admin-products.api";
import type { AdminProductQuery } from "../types/admin-product";

export const adminProductKeys = {
  all: ["admin-products"] as const,
  lists: () => [...adminProductKeys.all, "list"] as const,
  list: (query: AdminProductQuery) => [...adminProductKeys.lists(), query] as const,
  details: () => [...adminProductKeys.all, "detail"] as const,
  detail: (id: string) => [...adminProductKeys.details(), id] as const,
  images: (id: string) => [...adminProductKeys.detail(id), "images"] as const,
};

export const adminProductsQueryOptions = (query: AdminProductQuery) =>
  queryOptions({
    queryKey: adminProductKeys.list(query),
    queryFn: () => getAdminProducts(query),
    staleTime: 30_000,
  });

export const adminProductQueryOptions = (id: string) =>
  queryOptions({
    queryKey: adminProductKeys.detail(id),
    queryFn: () => getAdminProduct(id),
    staleTime: 30_000,
  });

export const adminProductImagesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: adminProductKeys.images(id),
    queryFn: () => getProductImages(id),
  });
