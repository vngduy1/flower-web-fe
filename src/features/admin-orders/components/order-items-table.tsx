import Link from "next/link";

import { CatalogImage } from "@/features/products/components/catalog-image";
import { formatYen } from "@/lib/format/currency";

import type { AdminOrderItem } from "../types/admin-order";

export function OrderItemsTable({ items }: { items: AdminOrderItem[] }) {
  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-serif text-xl font-semibold">注文商品</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-brand-soft/30 text-xs">
            <tr>
              <th className="p-3">商品スナップショット</th>
              <th className="p-3">単価</th>
              <th className="p-3">数量</th>
              <th className="p-3 text-right">小計</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-brand/10 border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                      <CatalogImage
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        sizes="56px"
                      />
                    </div>
                    <div>
                      {item.productId ? (
                        <Link
                          href={`/admin/products/${item.productId}`}
                          className="font-semibold hover:underline"
                        >
                          {item.productName}
                        </Link>
                      ) : (
                        <p className="font-semibold">{item.productName}</p>
                      )}
                      <p className="text-muted-foreground mt-1 text-xs">
                        {item.productCode}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{formatYen(item.unitPrice)}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3 text-right font-semibold">
                  {formatYen(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
