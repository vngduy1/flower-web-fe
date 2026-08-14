"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useRestoreAdminReview } from "../hooks/use-admin-reviews";

export function RestoreReviewDialog({ reviewId }: { reviewId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const mutation = useRestoreAdminReview(reviewId);
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
      const restored = await mutation.mutateAsync();
      dialogRef.current?.close();
      router.replace(
        `/admin/reviews/${encodeURIComponent(restored.review.id)}?restored=true`,
      );
    } catch {
      // Keep the normalized conflict or missing-review error visible.
    }
  }

  return (
    <div>
      <Button size="sm" variant="secondary" onClick={open}>
        このレビューを復元
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,540px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="restore-review-title"
        aria-describedby="restore-review-description"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => mutation.reset()}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Restore confirmation
          </p>
          <h2
            id="restore-review-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            レビューを復元しますか？
          </h2>
          <p
            id="restore-review-description"
            className="text-muted-foreground mt-3 text-sm break-all"
          >
            レビューID: {reviewId}
          </p>
          <Alert className="mt-5" variant="info">
            復元後も、削除前の審査状態と内容が維持されます。
          </Alert>
          {error ? (
            <Alert className="mt-5" variant="error" title="復元できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button isLoading={mutation.isPending} onClick={() => void confirm()}>
              確認して復元
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
