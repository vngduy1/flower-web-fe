import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { Alert, EmptyState } from "@/components/ui";
import { getActiveCategoriesCached } from "@/features/categories/api/categories.server";
import { getProducts } from "@/features/products/api/products.api";
import { getPrimaryProductImages } from "@/features/products/api/products.server";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";
import type { Product } from "@/features/products/types/product";
import { normalizeApiError } from "@/lib/api/errors";

import { StorySection } from "@/features/home/components/story-section";
import { PromiseSection } from "@/features/home/components/promise-section";
import { GuideSection } from "@/features/home/components/guide-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { SeasonalPromotion } from "@/features/home/components/seasonal-promotion";

export const metadata: Metadata = {
  title: "季節の花をオンラインで",
  description: "季節の花を、ていねいに束ねてお届けする花織の商品カタログ。",
};

function ProductSection({
  eyebrow,
  products,
  title,
  images,
}: {
  eyebrow: string;
  products: Product[];
  title: string;
  images: Awaited<ReturnType<typeof getPrimaryProductImages>>;
}) {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="home-eyebrow">{eyebrow}</p>

            <div className="hanaori-rule mt-5" />

            <h2 className="text-brand-dark mt-7 font-serif text-3xl sm:text-4xl">
              {title}
            </h2>
          </div>

          <Link
            href="/products"
            className="group text-brand-dark inline-flex items-center gap-3 text-sm font-semibold"
          >
            すべての商品を見る
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} images={images} />
        ) : (
          <EmptyState
            title="商品を準備しています"
            description="公開中の商品が登録されると、こちらに表示されます。"
          />
        )}
      </div>
    </section>
  );
}

async function loadHomeCatalog() {
  try {
    const [categories, featuredProducts, newestProducts] = await Promise.all([
      getActiveCategoriesCached(),
      getProducts({
        status: "ACTIVE",
        isFeatured: true,
        page: 1,
        limit: 4,
      }),
      getProducts({ status: "ACTIVE", page: 1, limit: 4 }),
    ]);
    const uniqueProducts = Array.from(
      new Map(
        [...featuredProducts.items, ...newestProducts.items].map((product) => [
          product.id,
          product,
        ]),
      ).values(),
    );
    const images = await getPrimaryProductImages(uniqueProducts);

    return { categories, featuredProducts, newestProducts, images };
  } catch (error) {
    return { errorMessage: normalizeApiError(error).message };
  }
}

async function HomeCatalogSections() {
  await connection();
  const catalog = await loadHomeCatalog();

  if ("errorMessage" in catalog) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <Alert variant="error" title="商品カタログを読み込めませんでした">
          {catalog.errorMessage}
        </Alert>
      </section>
    );
  }

  return (
    <>
      <section className="border-brand/10 bg-surface border-y px-5 py-14 sm:px-8 sm:py-18 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-xl">
            <p className="home-eyebrow">Categories</p>

            <div className="hanaori-rule mt-5" />

            <h2 className="text-brand-dark mt-7 font-serif text-3xl sm:text-4xl">
              気分やシーンから選ぶ
            </h2>
          </div>

          {catalog.categories.length > 0 ? (
            <>
              <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
                {catalog.categories.slice(0, 8).map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group border-brand/15 hover:border-brand border-t py-7 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <span className="text-accent text-[9px] font-bold tracking-[0.18em]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-brand-dark mt-4 block font-serif text-xl sm:text-2xl">
                          {category.name}
                        </span>
                      </div>

                      <span className="text-brand-dark/40 group-hover:text-brand-dark mt-5 transition-all duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <Link
                  href="/products"
                  className="group text-brand-dark inline-flex items-center gap-3 text-sm font-semibold"
                >
                  すべてのカテゴリーを見る
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              title="カテゴリを準備しています"
              description="公開中のカテゴリが登録されると、こちらに表示されます。"
            />
          )}
        </div>
      </section>

      <ProductSection
        eyebrow="Featured flowers"
        title="今、届けたい花"
        products={catalog.featuredProducts.items}
        images={catalog.images}
      />
      <div className="border-brand/10 bg-surface border-t">
        <ProductSection
          eyebrow="New arrivals"
          title="新しく届いた花"
          products={catalog.newestProducts.items}
          images={catalog.images}
        />
      </div>
    </>
  );
}

function HomeCatalogFallback() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="mb-8">
        <div className="bg-surface-muted h-3 w-28 animate-pulse rounded-full" />
        <div className="bg-surface-muted mt-4 h-10 w-64 animate-pulse rounded-xl" />
      </div>
      <ProductGridSkeleton count={4} />
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* */}
      <HeroSection />

      {/* 花織について */}
      <StorySection />

      {/* 私たちの約束 */}
      <PromiseSection />

      {/* ご利用ガイド */}
      <GuideSection />

      <div id="categories">
        <Suspense fallback={<HomeCatalogFallback />}>
          <HomeCatalogSections />
        </Suspense>
      </div>

      <SeasonalPromotion />
    </>
  );
}
