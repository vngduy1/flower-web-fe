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
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
              {eyebrow}
            </p>
            <h2 className="text-brand-dark mt-3 font-serif text-3xl sm:text-4xl">
              {title}
            </h2>
          </div>
          <Link
            href="/products"
            className="text-brand-dark text-sm font-semibold underline-offset-4 hover:underline"
          >
            すべての商品を見る
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
          <div className="mb-8 max-w-xl">
            <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
              Categories
            </p>
            <h2 className="text-brand-dark mt-3 font-serif text-3xl sm:text-4xl">
              気分やシーンから選ぶ
            </h2>
          </div>
          {catalog.categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {catalog.categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="border-brand/10 bg-background hover:border-brand/30 group rounded-3xl border p-6 transition-colors"
                >
                  <span className="text-accent text-xs font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-brand-dark mt-8 block font-serif text-2xl font-semibold">
                    {category.name}
                  </span>
                  <span className="text-muted-foreground group-hover:text-brand-dark mt-2 block text-xs">
                    商品を見る →
                  </span>
                </Link>
              ))}
            </div>
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
      <div className="border-brand/10 border-t">
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
      <section className="relative overflow-hidden px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div
          className="bg-accent-soft/60 absolute top-8 -left-20 size-72 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="text-accent mb-5 text-xs font-bold tracking-[0.24em] uppercase">
              Tokyo · Online flower boutique
            </p>
            <h1 className="text-brand-dark font-serif text-5xl leading-[1.2] font-medium tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              暮らしに、
              <br />
              花の余白を。
            </h1>
            <p className="text-muted-foreground mt-7 max-w-xl text-base leading-8 sm:text-lg sm:leading-9">
              季節の移ろいを映す花を、あなたの日常へ。一つひとつの物語に寄り添う花をお届けします。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="bg-brand hover:bg-brand-dark inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition-colors"
              >
                商品を探す
              </Link>
              <Link
                href="#categories"
                className="border-brand/25 text-brand-dark hover:bg-brand-soft/45 inline-flex min-h-12 items-center justify-center rounded-full border bg-white px-6 text-sm font-semibold transition-colors"
              >
                カテゴリから選ぶ
              </Link>
            </div>
          </div>

          <div
            className="bg-brand-soft/70 relative mx-auto aspect-[5/6] w-full max-w-xl overflow-hidden rounded-[2.5rem] border shadow-[0_35px_90px_-45px_rgba(38,61,45,0.5)]"
            aria-label="ヒーローバナー画像は準備中です"
            role="img"
          >
            <div className="absolute inset-6 rounded-[2rem] border border-white/65" />
            <div className="bg-accent-soft absolute top-[14%] left-[16%] size-36 rounded-full sm:size-44" />
            <div className="absolute top-[24%] right-[14%] size-32 rounded-full bg-[#f7f0de]" />
            <div className="bg-accent absolute top-[40%] left-[34%] size-40 rounded-full opacity-80 sm:size-48" />
            <div className="bg-brand absolute top-[51%] left-[13%] h-40 w-24 rotate-[-28deg] rounded-[100%_0_100%_0] opacity-75" />
            <div className="bg-brand-dark absolute top-[48%] right-[13%] h-44 w-28 rotate-[30deg] rounded-[0_100%_0_100%] opacity-70" />
            <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/70 bg-white/85 p-5 text-center shadow-lg backdrop-blur">
              <p className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase">
                Hero visual placeholder
              </p>
              <p className="text-brand-dark mt-2 font-serif text-2xl">
                季節の花を、あなたへ。
              </p>
            </div>
          </div>
        </div>
      </section>

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

      <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-10">
        <div className="bg-brand-dark mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-11 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
              Seasonal promotion
            </p>
            <h2 className="mt-4 font-serif text-3xl">季節の特集を準備しています。</h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              キャンペーン情報は、実際の公開データと接続するフェーズでこちらに掲載します。
            </p>
          </div>
          <span className="mt-7 inline-flex rounded-full border border-white/15 px-5 py-3 text-xs font-semibold text-white/70 lg:mt-0">
            Promotion placeholder
          </span>
        </div>
      </section>
    </>
  );
}
