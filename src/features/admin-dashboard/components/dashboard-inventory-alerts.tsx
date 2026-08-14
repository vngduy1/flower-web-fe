import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CatalogImage } from "@/features/products/components/catalog-image";

import type { AdminDashboardLowStockProducts } from "../types/dashboard";

export function DashboardInventoryAlerts({
  inventory,
}: {
  inventory: AdminDashboardLowStockProducts;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
          Inventory alerts
        </p>
        <CardTitle className="mt-2">在庫アラート</CardTitle>
      </CardHeader>
      <CardContent>
        {inventory.items.length ? (
          <div className="grid gap-3">
            {inventory.items.map((item) => (
              <article
                key={item.inventoryId}
                className="grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-2xl border bg-white p-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border">
                  <CatalogImage
                    src={item.product.thumbnailUrl}
                    alt={item.product.name}
                    sizes="52px"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-foreground hover:text-brand truncate text-sm font-semibold"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-xs">
                    在庫 {item.stockQuantity} / 引当 {item.reservedQuantity} / 基準{" "}
                    {item.lowStockThreshold}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={
                      item.stockStatus === "OUT_OF_STOCK"
                        ? "font-semibold text-red-700"
                        : "font-semibold text-amber-700"
                    }
                  >
                    {item.availableQuantity}
                  </p>
                  <p className="mt-1 text-[10px]">
                    {item.stockStatus === "OUT_OF_STOCK" ? "在庫切れ" : "残りわずか"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border bg-white px-4 py-8 text-center text-sm">
            低在庫・在庫切れの商品はありません。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
