"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";
import { cn } from "@/lib/utils/cn";

import type { Order } from "../types/order";
import { getOrderStatusLabel } from "../utils/order-labels";

const progressStatuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
] as const;

type MyReview = {
  id: string;
  orderItemId: string;
  productId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export function OrderTimeline({ order }: { order: Order }) {
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    async function loadMyReviews() {
      try {
        setReviewsLoading(true);

        const response = await apiClient.get<MyReview[]>("/reviews/my");

        setMyReviews(response.data);
      } catch (error) {
        console.error("レビュー一覧の取得に失敗しました。", error);
        setMyReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    }

    void loadMyReviews();
  }, []);

  if (order.status === "CANCELLED") {
    return (
      <div>
        <div className="grid grid-cols-[24px_1fr] gap-x-3 gap-y-5">
          <span className="bg-brand mt-1 size-3 rounded-full ring-4 ring-emerald-100" />

          <div>
            <p className="font-semibold">注文受付</p>

            <p className="text-muted-foreground mt-1 text-xs">
              {formatDateTime(order.createdAt)}
            </p>
          </div>

          <span className="mt-1 size-3 rounded-full bg-slate-500 ring-4 ring-slate-100" />

          <div>
            <p className="font-semibold">{getOrderStatusLabel(order.status)}</p>

            <p className="text-muted-foreground mt-1 text-xs">
              最終更新 {formatDateTime(order.updatedAt)}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground mt-5 text-xs leading-5">
          顧客向けAPIは個別のステータス履歴日時を返さないため、
          受付日時と現在の状態のみを表示しています。
        </p>
      </div>
    );
  }

  const currentIndex = progressStatuses.indexOf(order.status);
  const canReview = order.status === "DELIVERED";

  return (
    <div>
      {/* 注文ステータス */}
      <ol className="grid gap-3 sm:grid-cols-5" aria-label="注文の進行状況">
        {progressStatuses.map((status, index) => {
          const isCurrent = index === currentIndex;
          const isReached = index <= currentIndex;

          return (
            <li key={status} className="relative">
              <div
                className={cn(
                  "h-1 rounded-full",
                  isReached ? "bg-brand" : "bg-brand-soft",
                )}
              />

              <div className="mt-3 flex items-start gap-2 sm:block">
                <span
                  className={cn(
                    "mt-0.5 block size-3 shrink-0 rounded-full sm:mb-2",
                    isCurrent
                      ? "bg-accent ring-4 ring-orange-100"
                      : isReached
                        ? "bg-brand"
                        : "bg-brand-soft",
                  )}
                  aria-hidden="true"
                />

                <span
                  className={cn(
                    "text-xs leading-5",
                    isCurrent ? "text-foreground font-semibold" : "text-muted-foreground",
                  )}
                >
                  {getOrderStatusLabel(status)}

                  {isCurrent ? <span className="sr-only">（現在）</span> : null}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* 注文日時 */}
      <div className="text-muted-foreground mt-5 flex flex-wrap justify-between gap-2 text-xs">
        <span>注文日時 {formatDateTime(order.createdAt)}</span>

        <span>最終更新 {formatDateTime(order.updatedAt)}</span>
      </div>

      <p className="text-muted-foreground mt-2 text-xs leading-5">
        現在の注文状況を表示しています。 各ステータスの変更日時は表示されません。
      </p>

      {/* 配送完了後のレビュー */}
      {canReview && order.items?.length ? (
        <section className="border-brand/10 mt-6 border-t pt-5">
          <div className="mb-4">
            <h3 className="text-brand-dark font-serif text-lg font-semibold">
              ご購入商品のレビュー
            </h3>

            <p className="text-muted-foreground mt-1 text-xs leading-5">
              お届けした商品のご感想をお聞かせください。
            </p>
          </div>

          <div className="grid gap-3">
            {order.items.map((item) => {
              const productId = item.productId;
              const productSlug = item.productSlug;

              const review = myReviews.find(
                (currentReview) => String(currentReview.orderItemId) === String(item.id),
              );

              const hasReviewed = Boolean(review);

              return (
                <div
                  key={item.id}
                  className="border-brand/10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
                >
                  <div>
                    <p className="font-semibold">{item.productName}</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      商品コード {item.productCode}
                    </p>

                    {hasReviewed && review ? (
                      <p className="text-muted-foreground mt-2 text-xs">
                        評価{" "}
                        <span className="text-amber-500">
                          {"★".repeat(review.rating)}
                        </span>
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {productSlug ? (
                      <Link
                        href={`/products/${encodeURIComponent(productSlug)}`}
                        className="border-brand/20 text-brand-dark inline-flex items-center justify-center rounded-full border bg-white px-4 py-2 text-xs font-semibold transition hover:bg-slate-50"
                      >
                        商品を見る
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400"
                      >
                        商品を見る
                      </button>
                    )}

                    {reviewsLoading ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-wait items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-500"
                      >
                        確認中...
                      </button>
                    ) : hasReviewed ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-500"
                      >
                        レビュー済み
                      </button>
                    ) : productId ? (
                      <Link
                        href={`/account/reviews/new?productId=${encodeURIComponent(
                          productId,
                        )}&orderItemId=${encodeURIComponent(item.id)}`}
                        className="bg-brand inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                      >
                        レビューを書く
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
