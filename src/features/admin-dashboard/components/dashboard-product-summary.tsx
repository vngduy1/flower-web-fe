import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatYen } from "@/lib/format/currency";

import type {
  AdminDashboardSummary,
  AdminDashboardTopProducts,
} from "../types/dashboard";

interface DashboardProductSummaryProps {
  products: AdminDashboardSummary["products"];
  topProducts: AdminDashboardTopProducts;
}

export function DashboardProductSummary({
  products,
  topProducts,
}: DashboardProductSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
          Product summary
        </p>
        <CardTitle className="mt-2">商品サマリー</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["登録", products.total],
            ["販売中", products.active],
            ["残りわずか", products.lowStock],
            ["在庫切れ", products.outOfStock],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-4 text-center">
              <dt className="text-xs">{label}</dt>
              <dd className="text-brand-dark mt-1 font-serif text-2xl font-semibold">
                {Number(value).toLocaleString("ja-JP")}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h2 className="text-foreground text-sm font-semibold">販売数上位商品</h2>
          {topProducts.items.length ? (
            <div className="mt-3 divide-y rounded-2xl border bg-white px-4">
              {topProducts.items.map((product, index) => (
                <div
                  key={`${product.productCode}-${index}`}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {product.productName}
                    </p>
                    <p className="mt-1 text-xs">
                      {product.quantitySold.toLocaleString("ja-JP")}点 /{" "}
                      {product.orderCount.toLocaleString("ja-JP")}注文
                    </p>
                  </div>
                  <p className="text-foreground shrink-0 text-sm font-semibold">
                    {formatYen(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-2xl border bg-white px-4 py-6 text-center text-sm">
              支払い済み注文の商品集計はまだありません。
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
