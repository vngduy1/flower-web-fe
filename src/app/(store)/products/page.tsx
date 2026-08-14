import { dehydrate, HydrationBoundary, type QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";

import { categoriesQueryOptions } from "@/features/categories/api/categories.queries";
import { getCategoriesCached } from "@/features/categories/api/categories.server";
import type { Category } from "@/features/categories/types/category";
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

export const metadata: Metadata = {
  title: "商品一覧",
  description: "花織が選んだ季節の花を、カテゴリやキーワードから探せます。",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function seedCategories(queryClient: QueryClient): Promise<Category[] | null> {
  try {
    const response = await getCategoriesCached();

    queryClient.setQueryData(categoriesQueryOptions().queryKey, response);

    return response.items;
  } catch {
    return null;
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const state = parseCatalogSearchParams(await searchParams);
  const queryClient = createQueryClient();
  const categories = await seedCategories(queryClient);
  const selectedCategory = categories
    ?.filter((category) => category.isActive)
    .find((category) => category.slug === state.category);
  const categoryIsValid = !state.category || Boolean(selectedCategory);
  const query: ProductListQuery = {
    keyword: state.keyword || undefined,
    categoryId: selectedCategory?.id,
    status: "ACTIVE",
    page: state.page,
    limit: CATALOG_PAGE_SIZE,
  };
  let images = {};

  if (categoryIsValid) {
    const options = productsQueryOptions(query);

    await queryClient.prefetchQuery(options);

    const products = queryClient.getQueryData<ProductListResponse>(options.queryKey);
    images = products ? await getPrimaryProductImages(products.items) : {};
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="mb-9 max-w-2xl">
        <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
          Flower catalog
        </p>
        <h1 className="text-brand-dark mt-3 font-serif text-4xl sm:text-5xl">
          商品を探す
        </h1>
        <p className="text-muted-foreground mt-4 text-sm leading-7 sm:text-base">
          季節の花を、キーワードやカテゴリからお選びいただけます。
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductCatalog state={state} images={images} />
      </HydrationBoundary>
    </div>
  );
}
