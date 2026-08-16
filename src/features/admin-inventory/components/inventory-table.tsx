import Link from "next/link";

import { formatDateTime } from "@/lib/format/date";

import type { Inventory } from "../types/inventory";
import { InventoryProductImage } from "./inventory-product-image";
import { InventoryStatusBadge } from "./inventory-status-badge";

export function InventoryTable({ inventories }: { inventories: Inventory[] }) {
  return (
    <>
      <div className="mt-6 grid gap-3 md:hidden">
        {inventories.map((inventory) => (
          <article
            key={inventory.id}
            className="border-brand/10 rounded-2xl border bg-white p-4 shadow-sm"
          >
            <div className="flex gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                <InventoryProductImage
                  productId={inventory.product.id}
                  name={inventory.product.name}
                  size="64px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{inventory.product.name}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {inventory.product.productCode}
                </p>
                <div className="mt-2">
                  <InventoryStatusBadge status={inventory.stockStatus} />
                </div>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">在庫</dt>
                <dd className="mt-1 font-semibold">{inventory.stockQuantity}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">引当</dt>
                <dd className="mt-1 font-semibold">{inventory.reservedQuantity}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">利用可能</dt>
                <dd className="mt-1 font-semibold">
                  {inventory.availableQuantity ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">閾値</dt>
                <dd className="mt-1 font-semibold">{inventory.lowStockThreshold}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">在庫管理</dt>
                <dd className="mt-1 font-semibold">
                  {inventory.isStockManaged ? "有効" : "無効"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-muted-foreground">
                更新 {formatDateTime(inventory.updatedAt)}
              </span>
              <Link
                href={`/admin/inventories/${inventory.product.id}`}
                className="text-brand font-semibold"
              >
                詳細 →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="border-brand/10 mt-6 hidden overflow-hidden rounded-2xl border bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-left text-sm">
            <thead className="bg-brand-soft/35 text-xs">
              <tr>
                <th className="p-4">商品</th>
                <th className="p-4">在庫</th>
                <th className="p-4">引当</th>
                <th className="p-4">利用可能</th>
                <th className="p-4">閾値</th>
                <th className="p-4">管理</th>
                <th className="p-4">状態</th>
                <th className="p-4">更新日時</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inventory) => (
                <tr key={inventory.id} className="border-brand/10 border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                        <InventoryProductImage
                          productId={inventory.product.id}
                          name={inventory.product.name}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{inventory.product.name}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {inventory.product.productCode}
                          {inventory.product.category
                            ? ` · ${inventory.product.category.name}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{inventory.stockQuantity}</td>
                  <td className="p-4">{inventory.reservedQuantity}</td>
                  <td className="p-4">{inventory.availableQuantity ?? "—"}</td>
                  <td className="p-4">{inventory.lowStockThreshold}</td>
                  <td className="p-4">{inventory.isStockManaged ? "有効" : "無効"}</td>
                  <td className="p-4">
                    <InventoryStatusBadge status={inventory.stockStatus} />
                  </td>
                  <td className="p-4 text-xs">{formatDateTime(inventory.updatedAt)}</td>
                  <td className="p-4">
                    <Link
                      href={`/admin/inventories/${inventory.product.id}`}
                      className="text-brand font-semibold hover:underline"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
