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

export function ProductImageGallery({
  productName,
  slug,
}: ProductImageGalleryProps) {
  const productQuery = useProduct(slug);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  if (productQuery.isPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="aspect-square w-full rounded-lg" />

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton
              key={index}
              className="aspect-square rounded-md"
            />
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

        <Button
          className="mt-5"
          onClick={() => void productQuery.refetch()}
        >
          もう一度試す
        </Button>
      </div>
    );
  }

  const images = productQuery.data.images;

  const defaultImage =
    images.find((image) => image.isPrimary) ??
    images[0] ??
    null;

  const selectedImage =
    images.find((image) => image.id === selectedImageId) ??
    defaultImage;

  return (
    <div className="min-w-0">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-brand/10 bg-surface">
        <CatalogImage
          key={selectedImage?.id ?? "fallback"}
          src={selectedImage?.largeUrl ?? selectedImage?.imageUrl ?? null}
          alt={selectedImage?.altText || productName}
          sizes="(min-width: 1024px) 52vw, 100vw"
          priority
          className="transition-opacity duration-300"
        />

        {/* Image count */}
        {images.length > 1 ? (
          <div className="absolute right-3 bottom-3 bg-surface/90 px-2.5 py-1 text-[9px] tracking-[0.1em] text-brand-dark backdrop-blur-sm">
            {Math.max(
              images.findIndex((image) => image.id === selectedImage?.id) + 1,
              1,
            )}
            {" / "}
            {images.length}
          </div>
        ) : null}
      </div>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <div
          className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5"
          aria-label="商品画像"
        >
          {images.map((image) => {
            const isSelected = image.id === selectedImage?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border transition-all duration-200",
                  isSelected
                    ? "border-brand ring-1 ring-brand/20"
                    : "border-brand/10 hover:border-brand/40",
                )}
                aria-label={`${productName}の画像 ${image.sortOrder + 1}を表示`}
                aria-pressed={isSelected}
              >
                <CatalogImage
                  src={image.thumbnailUrl}
                  alt=""
                  sizes="120px"
                />

                {isSelected ? (
                  <span
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-brand"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}