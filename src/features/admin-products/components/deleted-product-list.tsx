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
import { parseAdminProductQuery, PRODUCT_STATUS_LABELS } from "../utils/admin-product";

const selectClass =
  "min-h-11 rounded-xl border bg-white px-3 text-sm focus:border-brand focus:outline-none";

export function DeletedProductList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const parsedQuery = parseAdminProductQuery(searchParams);

  const query = {
    ...parsedQuery,
    deletedOnly: true,
  };

  const products = useAdminProducts(query);
  const categories = useCategories();
  const restore = useRestoreProduct();

  const [keyword, setKeyword] = useState(query.keyword ?? "");

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );

    if (!("page" in values)) {
      params.delete("page");
    }

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
            削除済み商品一覧
          </h1>
        </div>

        <Link
          href="/admin/products"
          className="border-brand/20 text-brand hover:bg-brand-soft rounded-full border bg-white px-5 py-3 text-sm font-semibold"
        >
          商品一覧に戻る
        </Link>
      </div>

      <section className="border-brand/10 mt-7 rounded-2xl border bg-white p-4 shadow-sm">
        <form
          className="grid gap-3 xl:grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(130px,1fr)_auto]"
          onSubmit={(event) => {
            event.preventDefault();

            update({
              keyword: keyword.trim() || undefined,
            });
          }}
        >
          <Input
            id="deleted-product-keyword"
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
                update({
                  categoryId: event.target.value || undefined,
                })
              }
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
              onChange={(event) =>
                update({
                  status: event.target.value || undefined,
                })
              }
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
            方向
            <select
              className={selectClass}
              value={query.sortOrder ?? "DESC"}
              onChange={(event) =>
                update({
                  sortOrder: event.target.value,
                })
              }
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

      {restore.error ? (
        <Alert className="mt-5" variant="error" title="商品の復元に失敗しました">
          <p>{normalizeApiError(restore.error).message}</p>
        </Alert>
      ) : null}

      {products.isPending ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : null}

      {products.error ? (
        <Alert
          variant="error"
          className="mt-6"
          title="削除済み商品一覧を読み込めませんでした"
        >
          <p>{normalizeApiError(products.error).message}</p>

          <Button className="mt-3" size="sm" onClick={() => void products.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}

      {products.data && products.data.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="削除済みの商品はありません"
            description="削除された商品がある場合、ここに表示されます。"
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
                    <p className="truncate font-semibold">{product.name}</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {product.productCode} · {product.category?.name ?? "—"}
                    </p>

                    <p className="mt-2 text-sm">{formatYen(product.currentPrice)}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-3 text-xs">
                  削除{" "}
                  {product.deletedAt
                    ? new Date(product.deletedAt).toLocaleDateString("ja-JP")
                    : "—"}
                </p>

                <div className="mt-3 flex items-center justify-end border-t pt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    isLoading={restore.isPending}
                    onClick={() => void restore.mutateAsync(product.id)}
                  >
                    復元
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="border-brand/10 mt-6 hidden overflow-hidden rounded-2xl border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-brand-soft/35 text-xs">
                  <tr>
                    <th className="p-4">商品</th>
                    <th className="p-4">カテゴリー</th>
                    <th className="p-4">価格</th>
                    <th className="p-4">状態</th>
                    <th className="p-4">削除日時</th>
                    <th className="p-4">操作</th>
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
                            <p className="font-semibold">{product.name}</p>

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

                      <td className="p-4 text-xs">
                        {product.deletedAt
                          ? new Date(product.deletedAt).toLocaleString("ja-JP")
                          : "—"}
                      </td>

                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          isLoading={restore.isPending}
                          onClick={async () => {
                            try {
                              await restore.mutateAsync(product.id);
                            } catch {
                              return;
                            }
                          }}
                        >
                          復元
                        </Button>
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
          aria-label="削除済み商品一覧ページ"
        >
          <Button
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() =>
              update({
                page: String(pagination.page - 1),
              })
            }
          >
            前へ
          </Button>

          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>

          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() =>
              update({
                page: String(pagination.page + 1),
              })
            }
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
