import type { AxiosProgressEvent } from "axios";

import type {
  Product,
  ProductImage,
  ProductStatus,
} from "@/features/products/types/product";
import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdminProductDetail,
  AdminProductDetailResponse,
  AdminProductListResponse,
  AdminProductQuery,
  ProductImageMutationVariables,
  ProductImageUploadVariables,
  ProductWritePayload,
} from "../types/admin-product";

export async function getAdminProducts(query: AdminProductQuery) {
  const response = await apiClient.get<AdminProductListResponse>("/admin/products", {
    params: query,
  });
  return response.data;
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail> {
  const productId = toApiPathSegment(id);
  const response = await apiClient.get<AdminProductDetailResponse>(
    `/admin/products/${productId}`,
  );

  return { summary: response.data, product: response.data.product };
}

export async function createProduct(payload: ProductWritePayload): Promise<Product> {
  const response = await apiClient.post<Product>("/products", payload);
  return response.data;
}

export async function updateProduct(id: string, payload: ProductWritePayload) {
  const response = await apiClient.patch<Product>(
    `/products/${toApiPathSegment(id)}`,
    payload,
  );
  return response.data;
}

export async function updateProductStatus(id: string, status: ProductStatus) {
  const response = await apiClient.patch<AdminProductDetailResponse>(
    `/admin/products/${toApiPathSegment(id)}/status`,
    { status },
  );
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await apiClient.delete<{ message: string }>(
    `/admin/products/${toApiPathSegment(id)}`,
  );
  return response.data;
}

export async function restoreProduct(id: string) {
  const response = await apiClient.patch<Product>(
    `/products/${toApiPathSegment(id)}/restore`,
  );
  return response.data;
}

export async function uploadProductImage(variables: ProductImageUploadVariables) {
  const { productId, file, altText, sortOrder, isPrimary, onProgress } = variables;
  const formData = new FormData();
  formData.append("image", file);
  if (altText !== undefined) formData.append("altText", altText);
  if (sortOrder !== undefined) formData.append("sortOrder", String(sortOrder));
  if (isPrimary !== undefined) formData.append("isPrimary", String(isPrimary));

  const response = await apiClient.post<ProductImage>(
    `/products/${toApiPathSegment(productId)}/images`,
    formData,
    {
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
      },
    },
  );
  return response.data;
}

export async function updateProductImage(variables: ProductImageMutationVariables) {
  const { imageId, altText, sortOrder, isPrimary } = variables;
  const payload = { altText, sortOrder, isPrimary };
  const response = await apiClient.patch<ProductImage>(
    `/product-images/${toApiPathSegment(imageId)}`,
    payload,
  );
  return response.data;
}

export async function deleteProductImage(imageId: string) {
  const response = await apiClient.delete<{ message: string }>(
    `/product-images/${toApiPathSegment(imageId)}`,
  );
  return response.data;
}
