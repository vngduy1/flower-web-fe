"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button, Input } from "@/components/ui";
import type { Category } from "@/features/categories/types/category";

import { buildCatalogHref, type CatalogSearchState } from "../utils/catalog-search";

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
    navigate({ ...state, keyword: keyword.trim(), page: 1 });
  };

  return (
    <div className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-6">
      <form
        className="grid items-end gap-4 lg:grid-cols-[1fr_220px_180px_auto]"
        onSubmit={handleSearch}
        role="search"
      >
        <Input
          id="catalog-keyword"
          label="商品を検索"
          placeholder="商品名・商品コード・スラッグ"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        {fixedCategory ? (
          <div>
            <span className="text-foreground mb-2 block text-sm font-semibold">
              カテゴリ
            </span>
            <div className="border-brand/15 bg-brand-soft/35 flex min-h-11 items-center rounded-xl border px-3 text-sm">
              {fixedCategory.name}
            </div>
          </div>
        ) : (
          <label className="block">
            <span className="text-foreground mb-2 block text-sm font-semibold">
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
              className="border-brand/20 bg-surface text-foreground focus:border-brand min-h-11 w-full rounded-xl border px-3 text-sm outline-none"
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

        <label className="block">
          <span className="text-foreground mb-2 block text-sm font-semibold">並び順</span>
          <select
            value={state.sort}
            onChange={() => navigate({ ...state, sort: "newest", page: 1 })}
            className="border-brand/20 bg-surface text-foreground focus:border-brand min-h-11 w-full rounded-xl border px-3 text-sm outline-none"
            aria-describedby="catalog-sort-note"
          >
            <option value="newest">新着順</option>
          </select>
        </label>

        <Button type="submit" className="w-full lg:w-auto">
          検索する
        </Button>
      </form>
      <p id="catalog-sort-note" className="text-muted-foreground mt-3 text-xs">
        現在の公開APIが提供する並び順は新着順です。
      </p>
    </div>
  );
}
