"use client";

import Link from "next/link";

import { Button, EmptyState, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api/errors";

import { OrderCard } from "./order-card";
import { useOrders } from "../hooks/use-orders";

export function OrdersPageContent() {
  const { user } = useAuth();
  const ordersQuery = useOrders(Boolean(user));

  if (ordersQuery.isPending) {
    return (
      <div
        aria-busy="true"
        aria-label="注文履歴を読み込み中"
        className="grid gap-5"
        role="status"
      >
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-56 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (ordersQuery.error) {
    const error = normalizeApiError(ordersQuery.error);

    return (
      <EmptyState
        title="注文履歴を読み込めませんでした"
        description={error.message}
        code={error.statusCode ? String(error.statusCode) : "ERROR"}
        action={<Button onClick={() => void ordersQuery.refetch()}>再試行</Button>}
      />
    );
  }

  if (!ordersQuery.data?.length) {
    return (
      <EmptyState
        title="注文履歴はまだありません"
        description="商品を選んで、最初の花を大切な方へお届けしましょう。"
        action={
          <Link
            href="/products"
            className="bg-brand hover:bg-brand-dark inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white transition-colors"
          >
            商品を見る
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-5">
      {ordersQuery.data.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
