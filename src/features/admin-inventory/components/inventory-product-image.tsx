"use client";

import { useAdminProductImages } from "@/features/admin-products/hooks/use-admin-products";
import { CatalogImage } from "@/features/products/components/catalog-image";

export function InventoryProductImage({
  name,
  productId,
  size = "56px",
}: {
  name: string;
  productId: string;
  size?: string;
}) {
  const images = useAdminProductImages(productId);
  const primary = images.data?.find((image) => image.isPrimary) ?? images.data?.[0];

  return <CatalogImage src={primary?.thumbnailUrl ?? null} alt={name} sizes={size} />;
}
