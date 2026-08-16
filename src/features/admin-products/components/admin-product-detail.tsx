"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api";
import { formatYen } from "@/lib/format/currency";

import {
  useAdminProduct,
  useDeleteProduct,
  useUpdateProductStatus,
} from "../hooks/use-admin-products";
import type { ProductStatus } from "../types/admin-product";
import {
  PRODUCT_STATUS_LABELS,
  STOCK_STATUS_LABELS,
} from "../utils/admin-product";
import { ProductForm } from "./product-form";
import { ProductImageManager } from "./product-image-manager";

export function AdminProductDetail({ id }: { id: string }) {
  const detail = useAdminProduct(id);
  const statusMutation = useUpdateProductStatus(id);
  const deleteMutation = useDeleteProduct();

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [status, setStatus] = useState<ProductStatus | null>(null);

  if (detail.isPending) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <EmptyState
        title="商品を読み込めませんでした"
        description={normalizeApiError(detail.error).message}
        action={
          <Button onClick={() => void detail.refetch()}>
            再試行
          </Button>
        }
      />
    );
  }

  const { summary, product } = detail.data;
  const inventory = summary.inventory;

  const selectedStatus = status ?? summary.status;

  const mutationError =
    statusMutation.error ?? deleteMutation.error;

  async function changeStatus() {
    if (selectedStatus === summary.status) {
      return;
    }

    const confirmed = window.confirm(
      `ステータスを「${PRODUCT_STATUS_LABELS[selectedStatus]}」へ変更しますか？`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await statusMutation.mutateAsync(selectedStatus);

      // 最新のサーバー値を利用するため、
      // ローカルの選択状態を解除する
      setStatus(null);
    } catch {
      return;
    }
  }

  async function remove() {
    const confirmed = window.confirm(
      "この商品を削除しますか？商品一覧から非表示になります。",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      router.push(`/admin/products?deleted=${id}`);
    } catch {
      return;
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/products"
        className="text-brand text-sm font-semibold"
      >
        ← 商品一覧
      </Link>

      {searchParams.get("created") === "true" ? (
        <Alert
          className="mt-5"
          variant="success"
        >
          商品を登録しました。画像や在庫情報を続けて確認できます。
        </Alert>
      ) : null}

      {mutationError ? (
        <Alert
          className="mt-5"
          variant="error"
        >
          {normalizeApiError(mutationError).message}
        </Alert>
      ) : null}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs">
            {summary.productCode}
          </p>

          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            {summary.name}
          </h1>

          <p className="mt-2 text-sm">
            {PRODUCT_STATUS_LABELS[summary.status]} ·{" "}
            {summary.category?.name ?? "カテゴリーなし"} ·{" "}
            {formatYen(summary.currentPrice)}
          </p>
        </div>

        <Link
          href={`/products/${summary.slug}`}
          className="border-brand/25 rounded-full border bg-white px-4 py-2 text-sm font-semibold"
        >
          公開ページを確認
        </Link>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_320px]">
        <ProductForm product={product} />

        <aside className="grid content-start gap-6">
          {/* ステータス */}
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">
              ステータス
            </h2>

            <select
              className="mt-4 min-h-11 w-full rounded-xl border px-3"
              value={selectedStatus}
              onChange={(event) =>
                setStatus(event.target.value as ProductStatus)
              }
            >
              {Object.entries(PRODUCT_STATUS_LABELS).map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ),
              )}
            </select>

            <Button
              className="mt-3 w-full"
              isLoading={statusMutation.isPending}
              disabled={selectedStatus === summary.status}
              onClick={() => void changeStatus()}
            >
              確認して変更
            </Button>
          </section>

          {/* 提供期間 */}
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">
              提供期間
            </h2>

            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">
                  開始
                </dt>

                <dd>
                  {summary.availableFrom
                    ? new Date(
                        summary.availableFrom,
                      ).toLocaleString("ja-JP")
                    : "指定なし"}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  終了
                </dt>

                <dd>
                  {summary.availableUntil
                    ? new Date(
                        summary.availableUntil,
                      ).toLocaleString("ja-JP")
                    : "指定なし"}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  準備日数
                </dt>

                <dd>
                  {product.preparationDays}日
                </dd>
              </div>
            </dl>
          </section>

          {/* 在庫 */}
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">
              在庫サマリー
            </h2>

            {inventory ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">
                    状態
                  </dt>

                  <dd className="font-semibold">
                    {
                      STOCK_STATUS_LABELS[
                        inventory.stockStatus
                      ]
                    }
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">
                    在庫数
                  </dt>

                  <dd>
                    {inventory.stockQuantity}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">
                    引当数
                  </dt>

                  <dd>
                    {inventory.reservedQuantity}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">
                    利用可能
                  </dt>

                  <dd>
                    {inventory.availableQuantity ?? "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">
                    閾値
                  </dt>

                  <dd>
                    {inventory.lowStockThreshold}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-muted-foreground mt-4 text-sm">
                在庫情報は未登録です。
              </p>
            )}

            {inventory &&
            user?.roleCode === "ADMIN" ? (
              <Link
                href={`/admin/inventories/${id}`}
                className="text-brand mt-5 inline-block text-sm font-semibold"
              >
                この商品の在庫管理へ →
              </Link>
            ) : null}
          </section>

          {/* メタデータ */}
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">
              メタデータ
            </h2>

            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">
                  ID
                </dt>

                <dd className="break-all">
                  {summary.id}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  スラッグ
                </dt>

                <dd>
                  {summary.slug}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  登録日時
                </dt>

                <dd>
                  {new Date(
                    summary.createdAt,
                  ).toLocaleString("ja-JP")}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  更新日時
                </dt>

                <dd>
                  {new Date(
                    summary.updatedAt,
                  ).toLocaleString("ja-JP")}
                </dd>
              </div>
            </dl>
          </section>

          {/* 削除 */}
          <section className="rounded-2xl border border-red-200 bg-white p-5">
            <h2 className="font-semibold text-red-800">
              商品を削除
            </h2>

            <p className="text-muted-foreground mt-2 text-xs leading-5">
              削除すると、この商品は商品一覧に表示されなくなります。
            </p>

            <Button
              className="mt-4 w-full"
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => void remove()}
            >
              確認して削除
            </Button>
          </section>
        </aside>
      </div>

      <div className="mt-6">
        <ProductImageManager productId={id} />
      </div>
    </div>
  );
}