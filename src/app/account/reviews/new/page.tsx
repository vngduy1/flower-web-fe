"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Alert, Button, Input } from "@/components/ui";
import { apiClient, normalizeApiError } from "@/lib/api";

export default function NewReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const orderItemId = searchParams.get("orderItemId");

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    setError(null);

    if (!productId || !orderItemId) {
      setError("レビュー対象の商品情報を確認できませんでした。");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("評価を選択してください。");
      return;
    }

    if (!comment.trim()) {
      setError("レビュー内容を入力してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post("/reviews", {
        orderItemId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });

      router.push("/account/reviews");
    } catch (error) {
      setError(normalizeApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!productId || !orderItemId) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-12">
        <Alert variant="error">レビュー対象の商品情報を確認できませんでした。</Alert>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="border-brand/10 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-accent text-xs font-semibold tracking-[0.2em]">REVIEW</p>

        <h1 className="text-brand-dark mt-3 font-serif text-3xl font-semibold">
          商品レビューを書く
        </h1>

        <p className="text-muted-foreground mt-3 text-sm">
          お届けした商品のご感想をお聞かせください。
        </p>

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

            {rating > 0 ? (
              <p className="text-muted-foreground mt-2 text-xs">{rating} / 5</p>
            ) : null}
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

          {error ? <Alert variant="error">{error}</Alert> : null}

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            レビューを投稿
          </Button>
        </form>
      </div>
    </main>
  );
}
