"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminProductKeys } from "@/features/admin-products/api/admin-products.queries";
import {
  createCategory,
  deleteCategory,
  restoreCategory,
  updateCategory,
} from "@/features/categories/api/categories.api";
import {
  categoriesQueryOptions,
  categoryKeys,
} from "@/features/categories/api/categories.queries";
import { productKeys } from "@/features/products/api/products.queries";
import type { AdminCategoryQuery } from "@/features/categories/types/category";

export function useAdminCategories(query: AdminCategoryQuery = {}) {
  return useQuery({
    ...categoriesQueryOptions(query),
    staleTime: 30_000,
  });
}

function useInvalidateCategorySurfaces() {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all }),
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
    ]);
  };
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategorySurfaces();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: invalidate,
  });
}

export function useUpdateCategory(id: string) {
  const invalidate = useInvalidateCategorySurfaces();

  return useMutation({
    mutationFn: (request: Parameters<typeof updateCategory>[1]) =>
      updateCategory(id, request),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategorySurfaces();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidate,
  });
}

export function useRestoreCategory() {
  const invalidate = useInvalidateCategorySurfaces();

  return useMutation({
    mutationFn: restoreCategory,
    onSuccess: invalidate,
  });
}
