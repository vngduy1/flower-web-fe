import "server-only";

import { cache } from "react";

import { getProductBySlug, getProductImages } from "./products.api";
import type { Product, ProductImage } from "../types/product";

export const getProductBySlugCached = cache(getProductBySlug);

const getProductImagesCached = cache(getProductImages);

export async function getPrimaryProductImages(
  products: Product[],
): Promise<Record<string, ProductImage | null>> {
  const entries = await Promise.all(
    products.map(async (product) => {
      try {
        const images = await getProductImagesCached(product.id);
        const primaryImage = images.find((image) => image.isPrimary) ?? images[0] ?? null;

        return [product.id, primaryImage] as const;
      } catch {
        return [product.id, null] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
}
