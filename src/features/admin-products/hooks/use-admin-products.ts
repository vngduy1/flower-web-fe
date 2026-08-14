"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productKeys } from "@/features/products/api/products.queries";
import { adminDashboardKeys } from "@/features/admin-dashboard/api/admin-dashboard.queries";
import { inventoryKeys } from "@/features/admin-inventory/api/admin-inventory.queries";

import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  restoreProduct,
  updateProduct,
  updateProductImage,
  updateProductStatus,
  uploadProductImage,
} from "../api/admin-products.api";
import {
  adminProductImagesQueryOptions,
  adminProductKeys,
  adminProductQueryOptions,
  adminProductsQueryOptions,
} from "../api/admin-products.queries";
import type { AdminProductQuery, ProductWritePayload } from "../types/admin-product";

export const useAdminProducts = (query: AdminProductQuery) =>
  useQuery(adminProductsQueryOptions(query));
export const useAdminProduct = (id: string) => useQuery(adminProductQueryOptions(id));
export const useAdminProductImages = (id: string) =>
  useQuery(adminProductImagesQueryOptions(id));

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return async (id?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all }),
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: adminDashboardKeys.summary() }),
      queryClient.invalidateQueries({
        queryKey: [...adminDashboardKeys.all, "top-products"],
      }),
      id
        ? queryClient.invalidateQueries({ queryKey: adminProductKeys.detail(id) })
        : Promise.resolve(),
    ]);
  };
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({ mutationFn: createProduct, onSuccess: () => invalidate() });
}

export function useUpdateProduct(id: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (payload: ProductWritePayload) => updateProduct(id, payload),
    onSuccess: () => invalidate(id),
  });
}

export function useUpdateProductStatus(id: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (status: Parameters<typeof updateProductStatus>[1]) =>
      updateProductStatus(id, status),
    onSuccess: () => invalidate(id),
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({ mutationFn: deleteProduct, onSuccess: () => invalidate() });
}

export function useRestoreProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({ mutationFn: restoreProduct, onSuccess: () => invalidate() });
}

export function useUploadProductImage(productId: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: uploadProductImage,
    onSuccess: () => invalidate(productId),
  });
}

export function useUpdateProductImage(productId: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: updateProductImage,
    onSuccess: () => invalidate(productId),
  });
}

export function useDeleteProductImage(productId: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: deleteProductImage,
    onSuccess: () => invalidate(productId),
  });
}
