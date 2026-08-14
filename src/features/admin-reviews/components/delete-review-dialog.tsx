"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useDeleteAdminReview } from "../hooks/use-admin-reviews";

export function DeleteReviewDialog({ reviewId }: { reviewId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const mutation = useDeleteAdminReview(reviewId);
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  function open() {
    mutation.reset();
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    mutation.reset();
  }

  async function confirm() {
    try {
      await mutation.mutateAsync();
      dialogRef.current?.close();
      router.replace(`/admin/reviews?deletedId=${encodeURIComponent(reviewId)}`);
    } catch {
      // Keep the normalized backend error visible for retry.
    }
  }

  return (
    <div>
      <Button className="w-full" variant="danger" onClick={open}>
        レビューをソフト削除
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="delete-review-title"
        aria-describedby="delete-review-description"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => mutation.reset()}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Delete confirmation
          </p>
          <h2
            id="delete-review-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            レビューをソフト削除しますか？
          </h2>
          <p
            id="delete-review-description"
            className="text-muted-foreground mt-3 text-sm"
          >
            レビューID {reviewId}
          </p>
          <Alert className="mt-5" variant="warning" title="完全削除ではありません">
            通常の管理一覧、顧客のレビュー一覧、公開商品レビューから取得できなくなります。復元APIは利用できます。
          </Alert>
          {error ? (
            <Alert className="mt-5" variant="error" title="削除できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button
              variant="danger"
              isLoading={mutation.isPending}
              onClick={() => void confirm()}
            >
              確認してソフト削除
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
