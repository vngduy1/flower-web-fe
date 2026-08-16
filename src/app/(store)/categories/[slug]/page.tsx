import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { categoriesQueryOptions } from "@/features/categories/api/categories.queries";
import {
  getCategoriesCached,
  getCategoryBySlugCached,
} from "@/features/categories/api/categories.server";
import { productsQueryOptions } from "@/features/products/api/products.queries";
import { getPrimaryProductImages } from "@/features/products/api/products.server";
import { ProductCatalog } from "@/features/products/components/product-catalog";
import type {
  ProductListQuery,
  ProductListResponse,
} from "@/features/products/types/product";
import {
  CATALOG_PAGE_SIZE,
  parseCatalogSearchParams,
} from "@/features/products/utils/catalog-search";
import { createQueryClient } from "@/lib/query/query-client";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const category = await getCategoryBySlugCached(slug);

    if (!category) {
      return { title: "カテゴリが見つかりません" };
    }

    return {
      title: `${category.name}の花`,
      description: `${category.name}カテゴリの商品を新着順でご覧いただけます。`,
    };
  } catch {
    return { title: "商品カテゴリ" };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlugCached(slug);

  if (!category) {
    notFound();
  }

  const parsedState = parseCatalogSearchParams(rawSearchParams);
  const state = { ...parsedState, category: "" };
  const query: ProductListQuery = {
    keyword: state.keyword || undefined,
    categoryId: category.id,
    status: "ACTIVE",
    page: state.page,
    limit: CATALOG_PAGE_SIZE,
  };
  const queryClient = createQueryClient();
  const categories = await getCategoriesCached();

  queryClient.setQueryData(categoriesQueryOptions().queryKey, categories);

  const options = productsQueryOptions(query);

  await queryClient.prefetchQuery(options);

  const products = queryClient.getQueryData<ProductListResponse>(options.queryKey);
  const images = products ? await getPrimaryProductImages(products.items) : {};

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
      {/* Breadcrumb */}
      <nav
        className="text-muted-foreground mb-10 flex items-center gap-2 text-[11px] tracking-[0.04em]"
        aria-label="パンくず"
      >
        <Link href="/" className="hover:text-brand-dark transition-colors">
          ホーム
        </Link>

        <span className="text-brand-dark/25" aria-hidden="true">
          /
        </span>

        <Link href="/products" className="hover:text-brand-dark transition-colors">
          商品一覧
        </Link>

        <span className="text-brand-dark/25" aria-hidden="true">
          /
        </span>

        <span className="text-brand-dark" aria-current="page">
          {category.name}
        </span>
      </nav>

      {/* Category intro */}
      <header className="border-brand/15 mb-14 border-b pb-10 sm:mb-16 sm:pb-12">
        <p className="home-eyebrow">Category</p>

        <div className="hanaori-rule mt-5" />

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <h1 className="text-brand-dark font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>

          <p className="text-muted-foreground max-w-md text-sm leading-8 lg:justify-self-end">
            {category.name}カテゴリの商品を、新着順でご紹介します。
          </p>
        </div>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductCatalog fixedCategory={category} state={state} images={images} />
      </HydrationBoundary>
    </div>
  );
}
