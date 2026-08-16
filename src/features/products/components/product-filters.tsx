"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button, Input } from "@/components/ui";
import type { Category } from "@/features/categories/types/category";

import {
  buildCatalogHref,
  type CatalogSearchState,
} from "../utils/catalog-search";

interface ProductFiltersProps {
  categories: Category[];
  fixedCategory?: Category;
  state: CatalogSearchState;
}

export function ProductFilters({
  categories,
  fixedCategory,
  state,
}: ProductFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [keyword, setKeyword] = useState(state.keyword);

  const navigate = (nextState: CatalogSearchState) => {
    router.push(buildCatalogHref(pathname, nextState));
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    navigate({
      ...state,
      keyword: keyword.trim(),
      page: 1,
    });
  };

  return (
    <section
      className="border-y border-brand/15 py-7 sm:py-8"
      aria-label="商品絞り込み"
    >
      <form
        className="grid items-end gap-5 lg:grid-cols-[1fr_210px_160px_auto]"
        onSubmit={handleSearch}
        role="search"
      >
        {/* Keyword */}
        <div>
          <Input
            id="catalog-keyword"
            label="商品を検索"
            placeholder="商品名・商品コード・スラッグ"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        {/* Category */}
        {fixedCategory ? (
          <div>
            <span className="mb-2 block text-xs font-semibold tracking-[0.04em] text-foreground">
              カテゴリ
            </span>

            <div className="flex min-h-11 items-center border-b border-brand/20 px-1 text-sm text-brand-dark">
              {fixedCategory.name}
            </div>
          </div>
        ) : (
          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.04em] text-foreground">
              カテゴリ
            </span>

            <select
              value={state.category}
              onChange={(event) =>
                navigate({
                  ...state,
                  category: event.target.value,
                  page: 1,
                })
              }
              className="min-h-11 w-full border-b border-brand/20 bg-transparent px-1 text-sm text-foreground outline-none transition-colors focus:border-brand"
            >
              <option value="">すべてのカテゴリ</option>

              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Sort */}
        <label className="block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.04em] text-foreground">
            並び順
          </span>

          <select
            value={state.sort}
            onChange={() =>
              navigate({
                ...state,
                sort: "newest",
                page: 1,
              })
            }
            className="min-h-11 w-full border-b border-brand/20 bg-transparent px-1 text-sm text-foreground outline-none transition-colors focus:border-brand"
            aria-describedby="catalog-sort-note"
          >
            <option value="newest">新着順</option>
          </select>
        </label>

        {/* Search */}
        <Button
          type="submit"
          className="min-h-11 w-full px-7 lg:w-auto"
        >
          検索する
        </Button>
      </form>

      <p
        id="catalog-sort-note"
        className="mt-4 text-[11px] leading-6 text-muted-foreground"
      >
        現在の公開APIが提供する並び順は新着順です。
      </p>
    </section>
  );
}