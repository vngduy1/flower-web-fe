"use client";

import Link from "next/link";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

import { useInventory } from "../hooks/use-inventory";
import { InventoryAdjustmentDialog } from "./inventory-adjustment-dialog";
import { InventoryHistoryTable } from "./inventory-history-table";
import { InventoryProductImage } from "./inventory-product-image";
import { InventoryStatusBadge } from "./inventory-status-badge";
import { StockManagedEditor } from "./stock-managed-editor";
import { ThresholdEditor } from "./threshold-editor";

export function InventoryDetail({ productId }: { productId: string }) {
  const inventory = useInventory(productId);

  if (inventory.isPending) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }
  if (inventory.error || !inventory.data) {
    return (
      <EmptyState
        title="在庫情報を読み込めませんでした"
        description={normalizeApiError(inventory.error).message}
        action={<Button onClick={() => void inventory.refetch()}>再試行</Button>}
      />
    );
  }

  const data = inventory.data;
  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/inventories" className="text-brand text-sm font-semibold">
        ← 在庫一覧
      </Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
            <InventoryProductImage
              productId={data.product.id}
              name={data.product.name}
              size="80px"
            />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{data.product.productCode}</p>
            <h1 className="text-brand-dark mt-1 font-serif text-3xl font-semibold">
              {data.product.name}
            </h1>
            <div className="mt-2">
              <InventoryStatusBadge status={data.stockStatus} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="#inventory-history"
            className="border-brand/25 text-brand-dark rounded-full border bg-white px-4 py-2.5 text-sm font-semibold"
          >
            履歴を見る
          </Link>
          <Link
            href={`/admin/products/${data.product.id}`}
            className="border-brand/25 text-brand-dark rounded-full border bg-white px-4 py-2.5 text-sm font-semibold"
          >
            商品詳細
          </Link>
          <InventoryAdjustmentDialog inventory={data} />
        </div>
      </div>

      {!data.isStockManaged ? (
        <Alert className="mt-6" variant="warning" title="在庫管理は無効です">
          利用可能数を取得できませんでした。在庫調整を行うには在庫管理を有効にしてください。
        </Alert>
      ) : null}

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-muted-foreground text-xs">現在庫</p>
          <p className="text-brand-dark mt-2 text-3xl font-semibold">
            {data.stockQuantity}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-muted-foreground text-xs">引当済み</p>
          <p className="text-brand-dark mt-2 text-3xl font-semibold">
            {data.reservedQuantity}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-muted-foreground text-xs">利用可能</p>
          <p className="text-brand-dark mt-2 text-3xl font-semibold">
            {data.availableQuantity ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-muted-foreground text-xs">低在庫の閾値</p>
          <p className="text-brand-dark mt-2 text-3xl font-semibold">
            {data.lowStockThreshold}
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ThresholdEditor productId={productId} value={data.lowStockThreshold} />
        <StockManagedEditor productId={productId} value={data.isStockManaged} />
      </div>

      <section className="border-brand/10 mt-6 rounded-2xl border bg-white p-5 text-sm shadow-sm">
        <h2 className="font-serif text-xl font-semibold">在庫メタデータ</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">在庫ID</dt>
            <dd className="mt-1 break-all">{data.id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">カテゴリー</dt>
            <dd className="mt-1">{data.product.category?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">登録日時</dt>
            <dd className="mt-1">{formatDateTime(data.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">更新日時</dt>
            <dd className="mt-1">{formatDateTime(data.updatedAt)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-6">
        <InventoryHistoryTable productId={productId} />
      </div>
    </div>
  );
}
