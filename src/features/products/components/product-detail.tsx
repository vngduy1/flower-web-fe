import Link from "next/link";

import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { ProductReviewsSection } from "@/features/reviews/components/product-reviews-section";
import { formatYen } from "@/lib/format/currency";

import { ProductImageGallery } from "./product-image-gallery";
import type { ProductDetail as ProductDetailData } from "../types/product";

function getStockPresentation(detail: ProductDetailData) {
  const { inventory, product } = detail;

  if (product.status === "SOLD_OUT" || inventory?.isOutOfStock) {
    return {
      label: "在庫切れ",
      className: "text-red-700",
      isAvailable: false,
    };
  }

  if (!inventory) {
    return {
      label: "在庫情報なし",
      className: "text-muted-foreground",
      isAvailable: false,
    };
  }

  if (!inventory.isStockManaged) {
    return {
      label: "在庫あり",
      className: "text-brand",
      isAvailable: true,
    };
  }

  if (inventory.isLowStock) {
    return {
      label: `残りわずか（${inventory.availableQuantity ?? 0}点）`,
      className: "text-amber-700",
      isAvailable: true,
    };
  }

  return {
    label: `在庫あり（${inventory.availableQuantity ?? 0}点）`,
    className: "text-brand",
    isAvailable: true,
  };
}

export function ProductDetail({
  detail,
}: {
  detail: ProductDetailData;
}) {
  const { product } = detail;
  const stock = getStockPresentation(detail);
  const hasSalePrice = product.salePrice !== null;

  return (
    <article className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
      {/* Breadcrumb */}
      <nav
        className="mb-10 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.04em] text-muted-foreground"
        aria-label="パンくず"
      >
        <Link
          href="/"
          className="transition-colors hover:text-brand-dark"
        >
          ホーム
        </Link>

        <span className="text-brand-dark/25" aria-hidden="true">
          /
        </span>

        <Link
          href="/products"
          className="transition-colors hover:text-brand-dark"
        >
          商品一覧
        </Link>

        <span className="text-brand-dark/25" aria-hidden="true">
          /
        </span>

        <Link
          href={`/categories/${product.category.slug}`}
          className="transition-colors hover:text-brand-dark"
        >
          {product.category.name}
        </Link>

        <span className="text-brand-dark/25" aria-hidden="true">
          /
        </span>

        <span className="text-brand-dark" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* Main product */}
      <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <ProductImageGallery
          slug={product.slug}
          productName={product.name}
        />

        <div className="lg:pt-2">
          {/* Category */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/categories/${product.category.slug}`}
              className="home-eyebrow transition-colors hover:text-brand-dark"
            >
              {product.category.name}
            </Link>

            {product.isFeatured ? (
              <>
                <span
                  className="h-3 w-px bg-brand/20"
                  aria-hidden="true"
                />

                <span className="text-[9px] font-bold tracking-[0.16em] text-brand-dark/60 uppercase">
                  Featured
                </span>
              </>
            ) : null}
          </div>

          <div className="hanaori-rule mt-5" />

          {/* Name */}
          <h1 className="mt-7 font-serif text-4xl leading-tight font-medium text-brand-dark sm:text-5xl lg:text-[3.4rem]">
            {product.name}
          </h1>

          <p className="mt-4 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            Product No. {product.productCode}
          </p>

          {/* Price */}
          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <p className="font-serif text-3xl font-medium text-brand-dark sm:text-4xl">
              {formatYen(product.salePrice ?? product.basePrice)}
            </p>

            {hasSalePrice ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatYen(product.basePrice)}
              </p>
            ) : null}

            <span className="text-[10px] tracking-[0.08em] text-muted-foreground">
              税込
            </span>
          </div>

          {/* Availability */}
          <dl className="mt-9 border-y border-brand/15">
            <div className="grid gap-2 border-b border-brand/10 py-5 sm:grid-cols-[150px_1fr] sm:items-center">
              <dt className="text-xs text-muted-foreground">
                在庫状況
              </dt>

              <dd className={`text-sm font-semibold ${stock.className}`}>
                {stock.label}
              </dd>
            </div>

            <div className="grid gap-2 py-5 sm:grid-cols-[150px_1fr] sm:items-center">
              <dt className="text-xs text-muted-foreground">
                発送準備の目安
              </dt>

              <dd className="text-sm font-semibold text-brand-dark">
                {product.preparationDays === 0
                  ? "最短当日"
                  : `${product.preparationDays}日`}
              </dd>
            </div>
          </dl>

          {/* Description */}
          <section className="mt-10">
            <p className="home-eyebrow">About this flower</p>

            <h2 className="mt-4 font-serif text-xl text-brand-dark">
              商品について
            </h2>

            <p className="mt-5 text-sm leading-8 text-muted-foreground whitespace-pre-line">
              {product.description || "この商品の説明は現在準備中です。"}
            </p>
          </section>

          {/* Actions */}
          <div className="mt-10 border-t border-brand/15 pt-7">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <AddToCartButton
                productId={product.id}
                disabled={!stock.isAvailable}
              />

              <WishlistButton productId={product.id} />
            </div>

            {!stock.isAvailable ? (
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                現在、この商品はカートに追加できません。
                カート追加時には最新の在庫状況を確認します。
              </p>
            ) : (
              <p className="mt-4 text-[11px] leading-6 text-muted-foreground">
                ご注文確定時に最新の在庫状況を確認します。
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 border-t border-brand/15 pt-16 sm:mt-24 sm:pt-20">
        <ProductReviewsSection productId={product.id} />
      </div>
    </article>
  );
}