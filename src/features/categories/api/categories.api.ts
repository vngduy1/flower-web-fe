import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdminCategoryQuery,
  Category,
  CategoryListResponse,
  CategoryRelationResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";

function mapCategoryRelation(
  category: CategoryRelationResponse,
): CategoryRelationResponse {
  return {
    id: category.id,
    parentId: category.parentId,
    name: category.name,
    slug: category.slug,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    deletedAt: category.deletedAt,
  };
}

function mapCategory(category: CategoryResponse): Category {
  return {
    ...mapCategoryRelation(category),
    parent: category.parent ? mapCategoryRelation(category.parent) : null,
    children: (category.children ?? []).map(mapCategoryRelation),
  };
}

export async function getCategories(query: AdminCategoryQuery = {}) {
  const response = await apiClient.get<CategoryListResponse>("/categories", {
    params: query,
  });

  const items: Category[] = response.data.items.map((category) => ({
    ...category,
    parent: category.parent ?? null,
    children: category.children ?? [],
  }));

  return {
    ...response.data,
    items,
  };
}

export async function getCategory(id: string): Promise<Category> {
  const response = await apiClient.get<CategoryResponse>(
    `/categories/${toApiPathSegment(id)}`,
  );

  return mapCategory(response.data);
}

export async function createCategory(request: CreateCategoryRequest): Promise<Category> {
  const response = await apiClient.post<CategoryResponse>("/categories", request);

  return mapCategory(response.data);
}

export async function updateCategory(
  id: string,
  request: UpdateCategoryRequest,
): Promise<Category> {
  const response = await apiClient.patch<CategoryResponse>(
    `/categories/${toApiPathSegment(id)}`,
    request,
  );

  return mapCategory(response.data);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${toApiPathSegment(id)}`);
}

export async function restoreCategory(id: string): Promise<Category> {
  const response = await apiClient.patch<CategoryResponse>(
    `/categories/${toApiPathSegment(id)}/restore`,
  );

  return mapCategory(response.data);
}
