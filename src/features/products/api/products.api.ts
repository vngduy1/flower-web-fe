import { apiClient, normalizeApiError, toApiPathSegment } from "@/lib/api";

import type {
  Product,
  ProductDetail,
  ProductImage,
  ProductImageResponse,
  ProductInventory,
  ProductInventoryResponse,
  ProductListQuery,
  ProductListResponse,
  ProductListResponsePayload,
  ProductResponse,
} from "../types/product";

function mapProduct(product: ProductResponse): Product {
  return {
    id: product.id,
    productCode: product.productCode,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    category: product.category,
    description: product.description,
    basePrice: product.basePrice,
    salePrice: product.salePrice,
    status: product.status,
    isFeatured: product.isFeatured,
    availableFrom: product.availableFrom,
    availableUntil: product.availableUntil,
    preparationDays: product.preparationDays,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    deletedAt: product.deletedAt,
  };
}

function mapProductImage(image: ProductImageResponse): ProductImage {
  return { ...image };
}

function mapProductInventory(inventory: ProductInventoryResponse): ProductInventory {
  const availableQuantity = inventory.isStockManaged
    ? Math.max(inventory.stockQuantity - inventory.reservedQuantity, 0)
    : null;

  return {
    ...inventory,
    availableQuantity,
    isLowStock:
      inventory.isStockManaged &&
      availableQuantity !== null &&
      availableQuantity > 0 &&
      availableQuantity <= inventory.lowStockThreshold,
    isOutOfStock:
      inventory.isStockManaged && availableQuantity !== null && availableQuantity <= 0,
  };
}

function toProductRequestParams(query: ProductListQuery) {
  return {
    ...query,
    isFeatured: query.isFeatured === undefined ? undefined : String(query.isFeatured),
  };
}

export async function getProducts(query: ProductListQuery): Promise<ProductListResponse> {
  const response = await apiClient.get<ProductListResponsePayload>("/products", {
    params: toProductRequestParams(query),
  });

  return {
    items: response.data.items.map(mapProduct),
    pagination: response.data.pagination,
  };
}

export async function getProduct(id: string): Promise<Product> {
  const response = await apiClient.get<ProductResponse>(
    `/products/${toApiPathSegment(id)}`,
  );

  return mapProduct(response.data);
}

export async function getProductImages(id: string): Promise<ProductImage[]> {
  const response = await apiClient.get<ProductImageResponse[]>(
    `/products/${toApiPathSegment(id)}/images`,
  );

  return response.data.map(mapProductImage);
}

export async function getProductInventory(id: string): Promise<ProductInventory | null> {
  try {
    const response = await apiClient.get<ProductInventoryResponse>(
      `/products/${toApiPathSegment(id)}/inventory`,
    );

    return mapProductInventory(response.data);
  } catch (error) {
    if (normalizeApiError(error).statusCode === 404) {
      return null;
    }

    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const firstPage = await getProducts({
    keyword: slug,
    status: "ACTIVE",
    page: 1,
    limit: 100,
  });
  let match = firstPage.items.find((product) => product.slug === slug);

  for (let page = 2; !match && page <= firstPage.pagination.totalPages; page += 1) {
    const nextPage = await getProducts({
      keyword: slug,
      status: "ACTIVE",
      page,
      limit: 100,
    });

    match = nextPage.items.find((product) => product.slug === slug);
  }

  if (!match) {
    return null;
  }

  const [product, images, inventory] = await Promise.all([
    getProduct(match.id),
    getProductImages(match.id),
    getProductInventory(match.id),
  ]);

  return product.status === "ACTIVE" ? { product, images, inventory } : null;
}
