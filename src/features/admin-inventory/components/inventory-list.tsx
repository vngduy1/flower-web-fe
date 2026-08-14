"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Alert, Button, EmptyState, Input, Skeleton } from "@/components/ui";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { normalizeApiError } from "@/lib/api";

import { useInventories } from "../hooks/use-inventory";
import { parseInventoryQuery } from "../utils/inventory";
import { InventoryTable } from "./inventory-table";

const selectClass =
  "min-h-11 rounded-xl border bg-white px-3 text-sm focus:border-brand focus:outline-none";

export function InventoryList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = parseInventoryQuery(searchParams);
  const inventories = useInventories(query);
  const categories = useCategories();
  const [keyword, setKeyword] = useState(query.keyword ?? "");

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    if (!("page" in values)) params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const pagination = inventories.data?.pagination;
  return (
    <div className="mx-auto max-w-375">
      <div>
        <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
          Inventory management
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
          在庫管理
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          在庫数、引当数、販売可能数と警告状態を確認します。
        </p>
      </div>

      <section className="border-brand/10 mt-7 rounded-2xl border bg-white p-4 shadow-sm">
        <form
          className="grid gap-3 xl:grid-cols-[minmax(220px,1.5fr)_repeat(4,minmax(140px,1fr))_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            update({ keyword: keyword.trim() || undefined });
          }}
        >
          <Input
            id="inventory-keyword"
            label="検索"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="商品名・コード・スラッグ"
          />
          <label className="grid gap-2 text-sm font-semibold">
            カテゴリー
            <select
              className={selectClass}
              value={query.categoryId ?? ""}
              onChange={(event) =>
                update({ categoryId: event.target.value || undefined })
              }
            >
              <option value="">すべて</option>
              {categories.data?.items.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            在庫状態
            <select
              className={selectClass}
              value={query.stockStatus ?? "ALL"}
              onChange={(event) =>
                update({
                  stockStatus:
                    event.target.value === "ALL" ? undefined : event.target.value,
                })
              }
            >
              <option value="ALL">すべて</option>
              <option value="IN_STOCK">在庫あり</option>
              <option value="LOW_STOCK">残りわずか</option>
              <option value="OUT_OF_STOCK">在庫切れ</option>
              <option value="NOT_MANAGED">在庫管理なし</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            並び順
            <select
              className={selectClass}
              value={query.sortBy ?? "updatedAt"}
              onChange={(event) => update({ sortBy: event.target.value })}
            >
              <option value="updatedAt">更新日時</option>
              <option value="productName">商品名</option>
              <option value="stockQuantity">在庫数</option>
              <option value="availableQuantity">利用可能数</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            方向
            <select
              className={selectClass}
              value={query.sortOrder ?? "DESC"}
              onChange={(event) => update({ sortOrder: event.target.value })}
            >
              <option value="DESC">降順</option>
              <option value="ASC">昇順</option>
            </select>
          </label>
          <div className="flex items-end">
            <Button type="submit">検索</Button>
          </div>
        </form>
      </section>

      {inventories.isPending ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : null}
      {inventories.error ? (
        <Alert className="mt-6" variant="error" title="在庫一覧を読み込めませんでした">
          <p>{normalizeApiError(inventories.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void inventories.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}
      {inventories.data?.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="該当する在庫はありません"
            description="検索条件を変更してください。商品に在庫レコードがない場合も一覧には表示されません。"
          />
        </div>
      ) : null}
      {inventories.data?.items.length ? (
        <InventoryTable inventories={inventories.data.items} />
      ) : null}
      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-6 flex items-center justify-center gap-3"
          aria-label="在庫一覧ページ"
        >
          <Button
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() => update({ page: String(pagination.page - 1) })}
          >
            前へ
          </Button>
          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => update({ page: String(pagination.page + 1) })}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
