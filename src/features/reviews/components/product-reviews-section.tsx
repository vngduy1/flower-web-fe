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
    <section aria-labelledby="reviews-title">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <header>
          <p className="home-eyebrow">Customer reviews</p>

          <div className="hanaori-rule mt-5" />

          <h2
            id="reviews-title"
            className="text-brand-dark mt-7 font-serif text-3xl font-medium sm:text-4xl"
          >
            お客様のレビュー
          </h2>
        </header>

        {/* Public reviews */}
        {publicReviewsQuery.isPending ? (
          <div
            aria-busy="true"
            aria-label="レビューを読み込み中"
            className="mt-10 grid gap-5"
            role="status"
          >
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
        ) : publicReviewsQuery.error ? (
          <div className="mt-10">
            <Alert variant="error" title="レビューを読み込めませんでした">
              {normalizeApiError(publicReviewsQuery.error).message}
            </Alert>

            <Button className="mt-4" onClick={() => void publicReviewsQuery.refetch()}>
              再試行
            </Button>
          </div>
        ) : (
          <div className="mt-10">
            {publicReviewsQuery.data.reviewCount > 0 ? (
              <>
                <ReviewSummary summary={publicReviewsQuery.data} />

                <div className="mt-10">
                  {publicReviewsQuery.data.items.map((review) => (
                    <div
                      key={review.id}
                      className="border-brand/10 border-b py-8 first:pt-0"
                    >
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="border-brand/10 border-y py-14 text-center sm:py-16">
                <p className="text-brand-dark font-serif text-xl">
                  まだレビューはありません。
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-7">
                  この商品の最初のレビューをお待ちしています。
                </p>
              </div>
            )}
          </div>
        )}

        {/* Review submission */}
        <section className="border-brand/15 mt-16 border-t pt-12">
          <p className="home-eyebrow">Your review</p>

          <h3 className="text-brand-dark mt-4 font-serif text-2xl font-medium">
            この商品へのレビュー
          </h3>

          {isAuthLoading ? (
            <Skeleton className="mt-7 h-28 rounded-lg" />
          ) : !user ? (
            <div className="mt-7 max-w-xl">
              <p className="text-muted-foreground text-sm leading-7">
                配達完了した購入商品のレビューを投稿するにはログインしてください。
              </p>

              <Link
                href="/login"
                className="bg-brand-dark hover:bg-brand mt-6 inline-flex min-h-11 items-center px-6 text-sm font-semibold text-white transition-colors"
              >
                ログイン
              </Link>
            </div>
          ) : ordersQuery.isPending || myReviewsQuery.isPending ? (
            <Skeleton className="mt-7 h-40 rounded-lg" />
          ) : ordersQuery.error || myReviewsQuery.error ? (
            <Alert
              className="mt-7"
              variant="error"
              title="購入情報を確認できませんでした"
            >
              {normalizeApiError(ordersQuery.error ?? myReviewsQuery.error).message}
            </Alert>
          ) : (
            <div className="mt-8 grid gap-8">
              {submittedReview ? (
                <Alert variant="success" title="レビューを受け付けました">
                  審査中として保存されました。承認されるまで公開レビューには表示されません。
                </Alert>
              ) : null}

              {myProductReviews.length ? (
                <div>
                  <h4 className="text-brand-dark text-sm font-semibold">
                    あなたのレビュー状況
                  </h4>

                  <div className="mt-4 grid gap-4">
                    {myProductReviews.map((review) => (
                      <MyReviewStatusCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              ) : null}

              {reviewableItems.length ? (
                <div className="border-brand/10 border-t pt-8">
                  <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-7">
                    配達完了後、まだレビューを投稿していない商品が表示されます。
                    投稿時にレビュー可能な商品かどうかを確認します。
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
        </section>
      </div>
    </section>
  );
}
