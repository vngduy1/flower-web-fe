"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

interface CatalogImageProps {
  alt: string;
  className?: string;
  priority?: boolean;
  sizes: string;
  src: string | null;
}

export function CatalogImage({
  alt,
  className,
  priority = false,
  sizes,
  src,
}: CatalogImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(src));

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "bg-brand-soft/60 text-brand-dark grid h-full w-full place-items-center",
          className,
        )}
        role="img"
        aria-label={`${alt}の画像は準備中です`}
      >
        <div className="text-center">
          <span className="font-serif text-4xl" aria-hidden="true">
            花
          </span>
          <span className="mt-2 block text-[10px] font-semibold tracking-[0.14em] uppercase">
            Image coming soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      {isLoading ? (
        <div
          className="bg-surface-muted absolute inset-0 animate-pulse"
          aria-hidden="true"
        />
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
