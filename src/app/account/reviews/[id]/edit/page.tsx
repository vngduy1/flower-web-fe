"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, Button, Input, Skeleton } from "@/components/ui";
import { apiClient, normalizeApiError } from "@/lib/api";

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

export default function EditReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const reviewId = params.id;

  const [review, setReview] = useState<MyReview | null>(null);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReview() {
      if (!reviewId) {
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await apiClient.get<MyReview>(
          `/reviews/${encodeURIComponent(reviewId)}`,
        );

        const data = response.data;

        setReview(data);
        setRating(data.rating);
        setTitle(data.title ?? "");
        setComment(data.comment);
      } catch (error) {
        setLoadError(normalizeApiError(error).message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadReview();
  }, [reviewId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    setSubmitError(null);

    if (rating < 1 || rating > 5) {
      setSubmitError("評価を選択してください。");
      return;
    }

    if (!comment.trim()) {
      setSubmitError("レビュー内容を入力してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.patch(`/reviews/${encodeURIComponent(reviewId)}`, {
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      router.push("/account/reviews");
      router.refresh();
    } catch (error) {
      setSubmitError(normalizeApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-12">
        <Skeleton className="h-[620px] rounded-3xl" />
      </main>
    );
  }

  if (loadError || !review) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-12">
        <Alert variant="error">
          {loadError ?? "レビュー情報を取得できませんでした。"}
        </Alert>

        <div className="mt-5">
          <Link href="/account/reviews" className="text-brand-dark text-sm font-semibold">
            ← レビュー履歴へ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="mb-5">
        <Link href="/account/reviews" className="text-brand-dark text-sm font-semibold">
          ← レビュー履歴へ戻る
        </Link>
      </div>

      <section className="border-brand/10 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-accent text-xs font-semibold tracking-[0.2em]">EDIT REVIEW</p>

        <h1 className="text-brand-dark mt-3 font-serif text-3xl font-semibold">
          レビューを編集
        </h1>

        <p className="text-muted-foreground mt-3 text-sm">
          投稿したレビュー内容を変更できます。
        </p>

        {review.product ? (
          <div className="border-brand/10 mt-6 rounded-2xl border bg-slate-50/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-brand-dark font-semibold">{review.product.name}</p>

                <p className="text-muted-foreground mt-1 text-xs">
                  商品コード {review.product.productCode}
                </p>
              </div>

              <Link
                href={`/products/${encodeURIComponent(review.product.slug)}`}
                className="border-brand/20 text-brand-dark inline-flex items-center justify-center rounded-full border bg-white px-4 py-2 text-xs font-semibold transition hover:bg-slate-50"
              >
                商品を見る
              </Link>
            </div>
          </div>
        ) : null}

        <form className="mt-8 grid gap-6" onSubmit={submit}>
          <div>
            <p className="text-sm font-semibold">
              評価 <span className="text-red-700">*</span>
            </p>

            <div className="mt-3 flex gap-2" role="radiogroup" aria-label="評価">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value}つ星`}
                  onClick={() => setRating(value)}
                  className="text-brand-dark text-3xl transition hover:scale-110"
                >
                  {value <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>

            <p className="text-muted-foreground mt-2 text-xs">{rating} / 5</p>
          </div>

          <Input
            id="review-title"
            label="タイトル"
            value={title}
            maxLength={100}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label className="grid gap-2 text-sm font-semibold">
            <span>
              レビュー内容 <span className="text-red-700">*</span>
            </span>

            <textarea
              rows={7}
              maxLength={1000}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="border-brand/20 focus:border-brand min-h-32 w-full rounded-xl border bg-white px-4 py-3 text-sm focus:outline-none"
            />

            <span className="text-muted-foreground text-right text-xs font-normal">
              {comment.length} / 1000
            </span>
          </label>

          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              編集後は再度確認されます
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              レビュー内容を変更すると、ステータスは審査中に戻り、
              管理者による確認後に再公開されます。
            </p>
          </div>

          {submitError ? <Alert variant="error">{submitError}</Alert> : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/account/reviews"
              className="border-brand/20 text-brand-dark inline-flex min-w-28 items-center justify-center rounded-full border bg-white px-5 py-3 text-sm font-semibold transition hover:bg-slate-50"
            >
              キャンセル
            </Link>

            <Button
              type="submit"
              className="min-w-28"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              変更を保存
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
