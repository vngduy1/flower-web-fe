"use client";

import { useState } from "react";

import { Alert, Button, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils/cn";

import { CatalogImage } from "./catalog-image";
import { useProduct } from "../hooks/use-product";

interface ProductImageGalleryProps {
  productName: string;
  slug: string;
}

export function ProductImageGallery({ productName, slug }: ProductImageGalleryProps) {
  const productQuery = useProduct(slug);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  if (productQuery.isPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="aspect-square w-full rounded-[2rem]" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (productQuery.error) {
    const error = normalizeApiError(productQuery.error);

    return (
      <div>
        <Alert variant="error" title="商品画像を読み込めませんでした">
          {error.message}
        </Alert>
        <Button className="mt-5" onClick={() => void productQuery.refetch()}>
          もう一度試す
        </Button>
      </div>
    );
  }

  const images = productQuery.data.images;
  const defaultImage = images.find((image) => image.isPrimary) ?? images[0] ?? null;
  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? defaultImage;

  return (
    <div>
      <div className="bg-surface relative aspect-square overflow-hidden rounded-[2rem] border shadow-[0_30px_80px_-50px_rgba(38,61,45,0.65)]">
        <CatalogImage
          key={selectedImage?.id ?? "fallback"}
          src={selectedImage?.largeUrl ?? selectedImage?.imageUrl ?? null}
          alt={selectedImage?.altText || productName}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5" aria-label="商品画像">
          {images.map((image) => {
            const isSelected = image.id === selectedImage?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-2xl border-2 transition-colors",
                  isSelected
                    ? "border-brand"
                    : "hover:border-brand/35 border-transparent",
                )}
                aria-label={`${productName}の画像 ${image.sortOrder + 1}を表示`}
                aria-pressed={isSelected}
              >
                <CatalogImage src={image.thumbnailUrl} alt="" sizes="120px" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
