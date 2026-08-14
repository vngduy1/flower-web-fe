"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Alert, Button, Skeleton } from "@/components/ui";
import { apiClient, normalizeApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

type MyReview = {
  id: string;

  product: {
    id: string;
    productCode: string;
    name: string;
    slug: string;
  } | null;

  orderItemId: string;

  rating: number;
  title: string | null;
  comment: string;

  status: ReviewStatus;
  adminComment: string | null;

  approvedAt: string | null;
  rejectedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: "審査中",
  APPROVED: "公開済み",
  REJECTED: "非承認",
};

function getStatusClass(status: ReviewStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700";

    case "REJECTED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`5つ星中${rating}つ星`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={
            value <= rating ? "text-xl text-amber-500" : "text-xl text-slate-300"
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadReviews() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<MyReview[]>("/reviews/my");

      setReviews(response.data);
    } catch (error) {
      setError(normalizeApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, []);

  async function deleteReview(reviewId: string) {
    const confirmed = window.confirm("このレビューを削除しますか？");

    if (!confirmed) {
      return;
    }

    setDeletingId(reviewId);
    setError(null);

    try {
      await apiClient.delete(`/api/reviews/${reviewId}`);

      setReviews((current) => current.filter((review) => review.id !== reviewId));
    } catch (error) {
      setError(normalizeApiError(error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-accent text-xs font-semibold tracking-[0.2em]">MY REVIEWS</p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-brand-dark font-serif text-3xl font-semibold">
              レビュー履歴
            </h1>

            <p className="text-muted-foreground mt-2 text-sm">
              投稿した商品レビューの確認・管理ができます。
            </p>
          </div>

          <Link
            href="/account/orders"
            className="border-brand/20 text-brand-dark hover:bg-brand-soft/30 inline-flex items-center justify-center rounded-full border bg-white px-5 py-2.5 text-sm font-semibold transition"
          >
            注文履歴を見る
          </Link>
        </div>
      </div>

      {error ? (
        <Alert variant="error" className="mb-6">
          <div>
            <p>{error}</p>

            <Button
              size="sm"
              variant="secondary"
              className="mt-3"
              onClick={() => void loadReviews()}
            >
              再試行
            </Button>
          </div>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="grid gap-5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-3xl" />
          ))}
        </div>
      ) : null}

      {!isLoading && reviews.length === 0 ? (
        <section className="border-brand/10 rounded-3xl border bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto max-w-md">
            <p className="text-4xl" aria-hidden="true">
              ☆
            </p>

            <h2 className="text-brand-dark mt-4 font-serif text-xl font-semibold">
              まだレビューはありません
            </h2>

            <p className="text-muted-foreground mt-3 text-sm leading-6">
              配送完了した商品の注文詳細からレビューを投稿できます。
            </p>

            <Link
              href="/account/orders"
              className="bg-brand mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              注文履歴を見る
            </Link>
          </div>
        </section>
      ) : null}

      {!isLoading && reviews.length > 0 ? (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="border-brand/10 rounded-3xl border bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  {review.product ? (
                    <>
                      <Link
                        href={`/products/${encodeURIComponent(review.product.slug)}`}
                        className="text-brand-dark hover:text-brand block font-serif text-lg font-semibold transition"
                      >
                        {review.product.name}
                      </Link>

                      <p className="text-muted-foreground mt-1 text-xs">
                        商品コード {review.product.productCode}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      商品情報を取得できません
                    </p>
                  )}
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                    review.status,
                  )}`}
                >
                  {REVIEW_STATUS_LABELS[review.status]}
                </span>
              </div>

              <div className="mt-5">
                <RatingStars rating={review.rating} />

                {review.title ? (
                  <h2 className="text-foreground mt-3 text-base font-semibold">
                    {review.title}
                  </h2>
                ) : null}

                <p className="text-foreground/80 mt-3 text-sm leading-7 whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>

              {review.status === "PENDING" ? (
                <div className="mt-5 rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    レビューを確認しています
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    管理者による確認後、商品ページに公開されます。
                  </p>
                </div>
              ) : null}

              {review.status === "REJECTED" ? (
                <div className="mt-5 rounded-2xl bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">
                    このレビューは公開されませんでした
                  </p>

                  {review.adminComment ? (
                    <p className="mt-2 text-sm leading-6 text-red-700">
                      理由：{review.adminComment}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {review.status === "APPROVED" ? (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-800">
                    商品ページに公開されています
                  </p>
                </div>
              ) : null}

              <div className="border-brand/10 mt-5 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                <div className="text-muted-foreground text-xs">
                  <p>投稿日時 {formatDateTime(review.createdAt)}</p>

                  {review.updatedAt !== review.createdAt ? (
                    <p className="mt-1">更新日時 {formatDateTime(review.updatedAt)}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {review.product ? (
                    <Link
                      href={`/products/${encodeURIComponent(review.product.slug)}`}
                      className="border-brand/20 text-brand-dark hover:bg-brand-soft/30 inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition"
                    >
                      商品を見る
                    </Link>
                  ) : null}

                  <Link
                    href={`/account/reviews/${review.id}/edit`}
                    className="border-brand/20 text-brand-dark inline-flex items-center justify-center rounded-full border bg-white px-4 py-2 text-xs font-semibold transition hover:bg-slate-50"
                  >
                    編集
                  </Link>

                  <Button
                    size="sm"
                    variant="ghost"
                    isLoading={deletingId === review.id}
                    disabled={deletingId !== null}
                    onClick={() => void deleteReview(review.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </main>
  );
}
