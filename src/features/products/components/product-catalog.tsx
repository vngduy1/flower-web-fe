"use client";

import { usePathname } from "next/navigation";

import { Alert, Button, EmptyState } from "@/components/ui";
import { useCategories } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types/category";
import { normalizeApiError } from "@/lib/api/errors";

import { CatalogPagination } from "./catalog-pagination";
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";
import { ProductGridSkeleton } from "./product-grid-skeleton";
import { useProducts } from "../hooks/use-products";
import type { ProductImage, ProductListQuery } from "../types/product";
import { CATALOG_PAGE_SIZE, type CatalogSearchState } from "../utils/catalog-search";

interface ProductCatalogProps {
  fixedCategory?: Category;
  images?: Record<string, ProductImage | null>;
  state: CatalogSearchState;
}

interface ProductResultsProps {
  categoryId?: string;
  images: Record<string, ProductImage | null>;
  state: CatalogSearchState;
}

function ProductResults({ categoryId, images, state }: ProductResultsProps) {
  const pathname = usePathname();
  const query: ProductListQuery = {
    keyword: state.keyword || undefined,
    categoryId,
    status: "ACTIVE",
    page: state.page,
    limit: CATALOG_PAGE_SIZE,
  };
  const productsQuery = useProducts(query);

  if (productsQuery.isPending) {
    return <ProductGridSkeleton />;
  }

  if (productsQuery.error) {
    const error = normalizeApiError(productsQuery.error);

    return (
      <div>
        <Alert variant="error" title="商品を読み込めませんでした">
          {error.message}
        </Alert>
        <Button className="mt-5" onClick={() => void productsQuery.refetch()}>
          もう一度試す
        </Button>
      </div>
    );
  }

  if (productsQuery.data.items.length === 0) {
    return (
      <EmptyState
        code="No products"
        title="条件に合う商品がありません"
        description="検索キーワードやカテゴリを変更して、もう一度お試しください。"
      />
    );
  }

  return (
    <div aria-busy={productsQuery.isFetching || undefined}>
      <div className="border-brand/10 mb-8 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <p className="text-muted-foreground text-[11px] tracking-[0.06em]">
          {productsQuery.data.pagination.total} products
          <span className="text-brand-dark/20 mx-2">/</span>
          {(productsQuery.data.pagination.page - 1) *
            productsQuery.data.pagination.limit +
            1}
          –
          {Math.min(
            productsQuery.data.pagination.page * productsQuery.data.pagination.limit,
            productsQuery.data.pagination.total,
          )}
          件を表示
        </p>

        {productsQuery.isFetching ? (
          <p
            className="text-accent text-[10px] font-semibold tracking-[0.08em]"
            role="status"
          >
            更新しています…
          </p>
        ) : null}
      </div>
      <ProductGrid products={productsQuery.data.items} images={images} headingLevel={2} />
      <CatalogPagination
        pagination={productsQuery.data.pagination}
        pathname={pathname}
        state={state}
      />
    </div>
  );
}

export function ProductCatalog({
  fixedCategory,
  images = {},
  state,
}: ProductCatalogProps) {
  const categoriesQuery = useCategories();

  if (categoriesQuery.isPending) {
    return (
      <div className="grid gap-10">
        <div className="border-brand/10 border-y py-7">
          <div className="bg-surface-muted h-4 w-40 animate-pulse rounded" />
        </div>

        <ProductGridSkeleton />
      </div>
    );
  }

  if (categoriesQuery.error) {
    const error = normalizeApiError(categoriesQuery.error);

    return (
      <div>
        <Alert variant="error" title="カテゴリを読み込めませんでした">
          {error.message}
        </Alert>
        <Button className="mt-5" onClick={() => void categoriesQuery.refetch()}>
          もう一度試す
        </Button>
      </div>
    );
  }

  const categories = (categoriesQuery.data?.items ?? []).filter(
    (category) => category.isActive,
  );

  const selectedCategory = fixedCategory
    ? fixedCategory
    : categories.find((category) => category.slug === state.category);

  if (!fixedCategory && state.category && !selectedCategory) {
    return (
      <EmptyState
        code="Category not found"
        title="カテゴリが見つかりません"
        description="カテゴリ一覧から別のカテゴリを選択してください。"
      />
    );
  }

  return (
    <div className="grid gap-10">
      <ProductFilters
        key={`${state.keyword}:${state.category}:${state.sort}`}
        categories={categories}
        fixedCategory={fixedCategory}
        state={state}
      />

      <ProductResults categoryId={selectedCategory?.id} images={images} state={state} />
    </div>
  );
}
