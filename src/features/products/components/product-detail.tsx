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
    return { label: "在庫切れ", className: "text-red-700", isAvailable: false };
  }

  if (!inventory) {
    return {
      label: "在庫情報なし",
      className: "text-muted-foreground",
      isAvailable: false,
    };
  }

  if (!inventory.isStockManaged) {
    return { label: "在庫あり", className: "text-brand", isAvailable: true };
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

export function ProductDetail({ detail }: { detail: ProductDetailData }) {
  const { product } = detail;
  const stock = getStockPresentation(detail);
  const hasSalePrice = product.salePrice !== null;

  return (
    <article className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <nav
        className="text-muted-foreground mb-8 flex flex-wrap items-center gap-2 text-xs"
        aria-label="パンくず"
      >
        <Link href="/" className="hover:text-brand-dark">
          ホーム
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/products" className="hover:text-brand-dark">
          商品一覧
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-brand-dark"
        >
          {product.category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16">
        <ProductImageGallery slug={product.slug} productName={product.name} />

        <div className="lg:pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-accent text-xs font-bold tracking-[0.16em] uppercase hover:underline"
            >
              {product.category.name}
            </Link>
            {product.isFeatured ? (
              <span className="bg-accent-soft text-accent rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase">
                Featured
              </span>
            ) : null}
          </div>

          <h1 className="text-brand-dark mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="text-muted-foreground mt-3 text-xs tracking-[0.08em]">
            商品コード {product.productCode}
          </p>

          <div className="mt-7 flex flex-wrap items-baseline gap-4">
            <p className="text-brand-dark font-serif text-3xl font-semibold">
              {formatYen(product.salePrice ?? product.basePrice)}
            </p>
            {hasSalePrice ? (
              <p className="text-muted-foreground text-base line-through">
                {formatYen(product.basePrice)}
              </p>
            ) : null}
            <span className="text-muted-foreground text-xs">税込</span>
          </div>

          <div className="border-brand/10 mt-8 grid gap-4 border-y py-6 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-xs">在庫状況</p>
              <p className={`mt-1.5 font-semibold ${stock.className}`}>{stock.label}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">発送準備の目安</p>
              <p className="mt-1.5 font-semibold">
                {product.preparationDays === 0
                  ? "最短当日"
                  : `${product.preparationDays}日`}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-brand-dark font-serif text-xl">商品について</h2>
            <p className="text-muted-foreground mt-4 text-sm leading-8 whitespace-pre-line">
              {product.description || "この商品の説明は現在準備中です。"}
            </p>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <AddToCartButton productId={product.id} disabled={!stock.isAvailable} />
            <WishlistButton productId={product.id} />
          </div>
          {!stock.isAvailable ? (
            <p className="text-muted-foreground mt-3 text-xs">
              現在、この商品はカートに追加できません。カート追加時には最新の在庫状況を確認します。
            </p>
          ) : null}
        </div>
      </div>
      <ProductReviewsSection productId={product.id} />
    </article>
  );
}
