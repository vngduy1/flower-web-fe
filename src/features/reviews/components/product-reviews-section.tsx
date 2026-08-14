"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Alert, Button, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { normalizeApiError } from "@/lib/api/errors";
import { formatDate } from "@/lib/format/date";

import { MyReviewStatusCard } from "./my-review-status-card";
import { ReviewCard } from "./review-card";
import { ReviewForm, type ReviewableOrderItem } from "./review-form";
import { ReviewSummary } from "./review-summary";
import { useMyReviews } from "../hooks/use-my-reviews";
import { useProductReviews } from "../hooks/use-product-reviews";
import type { MyReview } from "../types/review";

export function ProductReviewsSection({ productId }: { productId: string }) {
  const { isLoading: isAuthLoading, user } = useAuth();
  const publicReviewsQuery = useProductReviews(productId);
  const ordersQuery = useOrders(Boolean(user));
  const myReviewsQuery = useMyReviews(Boolean(user));
  const [submittedReview, setSubmittedReview] = useState<MyReview | null>(null);

  const myProductReviews = useMemo(
    () =>
      (myReviewsQuery.data ?? []).filter((review) => review.product?.id === productId),
    [myReviewsQuery.data, productId],
  );

  const reviewableItems = useMemo<ReviewableOrderItem[]>(() => {
    if (!ordersQuery.data || !myReviewsQuery.data) {
      return [];
    }

    const reviewedOrderItems = new Set(
      myReviewsQuery.data.map((review) => review.orderItemId),
    );

    return ordersQuery.data.flatMap((order) => {
      if (order.status !== "DELIVERED") {
        return [];
      }

      return order.items
        .filter(
          (item) => item.productId === productId && !reviewedOrderItems.has(item.id),
        )
        .map((item) => ({
          orderItemId: item.id,
          orderNumber: order.orderNumber,
          deliveryDate: formatDate(order.delivery.date),
        }));
    });
  }, [myReviewsQuery.data, ordersQuery.data, productId]);

  return (
    <section
      className="border-brand/10 mt-16 border-t pt-12 sm:mt-20 sm:pt-16"
      aria-labelledby="reviews-title"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
          Customer reviews
        </p>
        <h2
          id="reviews-title"
          className="text-brand-dark mt-2 font-serif text-3xl font-semibold sm:text-4xl"
        >
          お客様のレビュー
        </h2>

        {publicReviewsQuery.isPending ? (
          <div
            aria-busy="true"
            aria-label="レビューを読み込み中"
            className="mt-8 grid gap-5"
            role="status"
          >
            <Skeleton className="h-44 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
          </div>
        ) : publicReviewsQuery.error ? (
          <div className="mt-8">
            <Alert variant="error" title="レビューを読み込めませんでした">
              {normalizeApiError(publicReviewsQuery.error).message}
            </Alert>
            <Button className="mt-4" onClick={() => void publicReviewsQuery.refetch()}>
              再試行
            </Button>
          </div>
        ) : (
          <div className="mt-8">
            <ReviewSummary summary={publicReviewsQuery.data} />
            {publicReviewsQuery.data.items.length ? (
              <div className="mt-6 rounded-3xl border bg-white px-6 sm:px-8">
                {publicReviewsQuery.data.items.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-6 rounded-3xl border bg-white px-6 py-10 text-center text-sm">
                公開済みのレビューはまだありません。
              </p>
            )}
          </div>
        )}

        <div className="bg-brand-soft/35 mt-10 rounded-3xl border p-6 sm:p-8">
          <h3 className="text-brand-dark font-serif text-2xl font-semibold">
            この商品へのレビュー
          </h3>

          {isAuthLoading ? (
            <Skeleton className="mt-6 h-32 rounded-2xl" />
          ) : !user ? (
            <div className="mt-5">
              <p className="text-muted-foreground text-sm leading-7">
                配達完了した購入商品のレビューを投稿するにはログインしてください。
              </p>
              <Link
                href="/login"
                className="bg-brand hover:bg-brand-dark mt-5 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white transition-colors"
              >
                ログイン
              </Link>
            </div>
          ) : ordersQuery.isPending || myReviewsQuery.isPending ? (
            <Skeleton className="mt-6 h-44 rounded-2xl" />
          ) : ordersQuery.error || myReviewsQuery.error ? (
            <Alert
              className="mt-5"
              variant="error"
              title="購入情報を確認できませんでした"
            >
              {normalizeApiError(ordersQuery.error ?? myReviewsQuery.error).message}
            </Alert>
          ) : (
            <div className="mt-6 grid gap-6">
              {submittedReview ? (
                <Alert variant="success" title="レビューを受け付けました">
                  審査中として保存されました。承認されるまで公開レビューには表示されません。
                </Alert>
              ) : null}

              {myProductReviews.length ? (
                <div className="grid gap-4">
                  <h4 className="text-sm font-semibold">あなたのレビュー状況</h4>
                  {myProductReviews.map((review) => (
                    <MyReviewStatusCard key={review.id} review={review} />
                  ))}
                </div>
              ) : null}

              {reviewableItems.length ? (
                <div className="border-brand/10 border-t pt-6">
                  <p className="text-muted-foreground mb-5 text-sm leading-7">
                    配達完了後、まだレビューを投稿していない商品が表示されます。投稿時にレビュー可能な商品かどうかを確認します。
                  </p>
                  <ReviewForm items={reviewableItems} onSuccess={setSubmittedReview} />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm leading-7">
                  現在レビューを送信できる配達完了済みの商品はありません。
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
