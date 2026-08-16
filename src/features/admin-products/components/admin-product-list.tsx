"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Alert, Button, EmptyState, Input, Skeleton } from "@/components/ui";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { CatalogImage } from "@/features/products/components/catalog-image";
import { formatYen } from "@/lib/format/currency";
import { normalizeApiError } from "@/lib/api";

import { useAdminProducts, useRestoreProduct } from "../hooks/use-admin-products";
import {
  parseAdminProductQuery,
  PRODUCT_STATUS_LABELS,
  STOCK_STATUS_LABELS,
} from "../utils/admin-product";

const selectClass =
  "min-h-11 rounded-xl border bg-white px-3 text-sm focus:border-brand focus:outline-none";

export function AdminProductList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = parseAdminProductQuery(searchParams);
  const products = useAdminProducts(query);
  const categories = useCategories();
  const restore = useRestoreProduct();
  const [keyword, setKeyword] = useState(query.keyword ?? "");

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    if (!("page" in values)) params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const pagination = products.data?.pagination;
  return (
    <div className="mx-auto max-w-375">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
            Catalog management
          </p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            商品管理
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/deleted"
            className="border-brand/20 text-brand hover:bg-brand-soft rounded-full border bg-white px-5 py-3 text-sm font-semibold"
          >
            削除済み商品一覧
          </Link>

          <Link
            href="/admin/products/new"
            className="bg-brand hover:bg-brand-dark rounded-full px-5 py-3 text-sm font-semibold text-white"
          >
            商品を登録
          </Link>
        </div>
      </div>

      <section className="border-brand/10 mt-7 rounded-2xl border bg-white p-4 shadow-sm">
        <form
          className="grid gap-3 xl:grid-cols-[minmax(220px,1.5fr)_repeat(5,minmax(130px,1fr))_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            update({ keyword: keyword.trim() || undefined });
          }}
        >
          <Input
            id="admin-product-keyword"
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
              onChange={(e) => update({ categoryId: e.target.value || undefined })}
            >
              <option value="">すべて</option>
              {categories.data?.items
                ?.filter((item) => item.isActive)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            ステータス
            <select
              className={selectClass}
              value={query.status ?? ""}
              onChange={(e) => update({ status: e.target.value || undefined })}
            >
              <option value="">すべて</option>
              {Object.entries(PRODUCT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            在庫
            <select
              className={selectClass}
              value={query.stockStatus ?? "ALL"}
              onChange={(e) =>
                update({
                  stockStatus: e.target.value === "ALL" ? undefined : e.target.value,
                })
              }
            >
              <option value="ALL">すべて</option>
              <option value="IN_STOCK">在庫あり</option>
              <option value="LOW_STOCK">残りわずか</option>
              <option value="OUT_OF_STOCK">在庫切れ</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            並び順
            <select
              className={selectClass}
              value={query.sortBy ?? "createdAt"}
              onChange={(e) => update({ sortBy: e.target.value })}
            >
              <option value="createdAt">登録日</option>
              <option value="updatedAt">更新日</option>
              <option value="name">商品名</option>
              <option value="basePrice">通常価格</option>
              <option value="salePrice">セール価格</option>
              <option value="stockQuantity">在庫数</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            方向
            <select
              className={selectClass}
              value={query.sortOrder ?? "DESC"}
              onChange={(e) => update({ sortOrder: e.target.value })}
            >
              <option value="DESC">降順</option>
              <option value="ASC">昇順</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <Button type="submit">検索</Button>
            <label className="flex min-h-11 items-center gap-2 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={query.isFeatured === true}
                onChange={(e) =>
                  update({ isFeatured: e.target.checked ? "true" : undefined })
                }
              />
              注目のみ
            </label>
          </div>
        </form>
      </section>

      {searchParams.get("deleted") ? (
        <Alert className="mt-5" variant="warning" title="商品を削除しました">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>この画面を離れる前なら、削除した商品を復元できます。</p>
            <Button
              size="sm"
              variant="secondary"
              isLoading={restore.isPending}
              onClick={async () => {
                const id = searchParams.get("deleted");
                if (!id) return;
                try {
                  await restore.mutateAsync(id);
                  update({ deleted: undefined });
                } catch {
                  return;
                }
              }}
            >
              元に戻す
            </Button>
          </div>
          {restore.error ? (
            <p className="mt-2 text-red-700">
              {normalizeApiError(restore.error).message}
            </p>
          ) : null}
        </Alert>
      ) : null}

      {products.isPending ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : null}
      {products.error ? (
        <Alert variant="error" className="mt-6" title="商品一覧を読み込めませんでした">
          <p>{normalizeApiError(products.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void products.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}
      {products.data && products.data.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="該当する商品はありません"
            description="検索条件を変更してください。"
          />
        </div>
      ) : null}
      {products.data?.items.length ? (
        <>
          <div className="mt-6 grid gap-3 md:hidden">
            {products.data.items.map((product) => (
              <article
                key={product.id}
                className="border-brand/10 rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                    <CatalogImage
                      src={product.thumbnailUrl}
                      alt={product.name}
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {product.name}
                      {product.isFeatured ? (
                        <span className="ml-2 text-amber-600">★</span>
                      ) : null}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {product.productCode} · {product.category?.name ?? "—"}
                    </p>
                    <p className="mt-2 text-sm">
                      {formatYen(product.currentPrice)} ·{" "}
                      {PRODUCT_STATUS_LABELS[product.status]}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  登録 {new Date(product.createdAt).toLocaleDateString("ja-JP")} · 更新{" "}
                  {new Date(product.updatedAt).toLocaleDateString("ja-JP")}
                </p>
                <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
                  <span>
                    {product.inventory
                      ? STOCK_STATUS_LABELS[product.inventory.stockStatus]
                      : "在庫未登録"}
                  </span>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-brand font-semibold"
                  >
                    詳細・編集 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="border-brand/10 mt-6 hidden overflow-hidden rounded-2xl border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-237.5 text-left text-sm">
                <thead className="bg-brand-soft/35 text-xs">
                  <tr>
                    <th className="p-4">商品</th>
                    <th className="p-4">カテゴリー</th>
                    <th className="p-4">価格</th>
                    <th className="p-4">状態</th>
                    <th className="p-4">在庫</th>
                    <th className="p-4">登録・更新</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.items.map((product) => (
                    <tr key={product.id} className="border-brand/10 border-t">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                            <CatalogImage
                              src={product.thumbnailUrl}
                              alt={product.name}
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {product.name}
                              {product.isFeatured ? (
                                <span className="ml-2 text-amber-600">★</span>
                              ) : null}
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {product.productCode}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{product.category?.name ?? "—"}</td>
                      <td className="p-4">
                        <p>{formatYen(product.currentPrice)}</p>
                        {product.salePrice !== null ? (
                          <p className="text-muted-foreground text-xs line-through">
                            {formatYen(product.basePrice)}
                          </p>
                        ) : null}
                      </td>
                      <td className="p-4">{PRODUCT_STATUS_LABELS[product.status]}</td>
                      <td className="p-4">
                        {product.inventory ? (
                          <>
                            <p>{STOCK_STATUS_LABELS[product.inventory.stockStatus]}</p>
                            <p className="text-muted-foreground text-xs">
                              利用可能: {product.inventory.availableQuantity ?? "—"}
                            </p>
                          </>
                        ) : (
                          "未登録"
                        )}
                      </td>
                      <td className="p-4 text-xs">
                        <p>
                          登録 {new Date(product.createdAt).toLocaleDateString("ja-JP")}
                        </p>
                        <p className="text-muted-foreground mt-1">
                          更新 {new Date(product.updatedAt).toLocaleDateString("ja-JP")}
                        </p>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-brand font-semibold hover:underline"
                        >
                          詳細・編集
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-6 flex items-center justify-center gap-3"
          aria-label="商品一覧ページ"
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
