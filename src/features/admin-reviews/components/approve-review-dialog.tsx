"use client";

import { useRef, useState } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useApproveAdminReview } from "../hooks/use-admin-reviews";
import type { AdminReview } from "../types/admin-review";

export function ApproveReviewDialog({ review }: { review: AdminReview }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [success, setSuccess] = useState(false);
  const mutation = useApproveAdminReview(review.id);
  const error = mutation.error ? normalizeApiError(mutation.error) : null;
  const isApproved = review.status === "APPROVED";

  function open() {
    setSuccess(false);
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
      setSuccess(true);
    } catch {
      // Keep the normalized backend error visible for retry.
    }
  }

  return (
    <div>
      {success ? (
        <Alert className="mb-4" variant="success">
          レビューを公開済みに更新しました。
        </Alert>
      ) : null}
      <Button className="w-full" disabled={isApproved} onClick={open}>
        公開を承認
      </Button>
      {isApproved ? (
        <p className="text-muted-foreground mt-2 text-xs leading-5">
          公開済みレビューの再承認を競合として扱います。
        </p>
      ) : null}

      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="approve-review-title"
        aria-describedby="approve-review-description"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => mutation.reset()}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Approval confirmation
          </p>
          <h2
            id="approve-review-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            このレビューを公開しますか？
          </h2>
          <p
            id="approve-review-description"
            className="text-muted-foreground mt-3 text-sm"
          >
            レビューID {review.id} を公開済みに変更します。
          </p>
          {review.status === "REJECTED" ? (
            <Alert className="mt-5" variant="warning">
              非承認理由と非承認日時をクリアし、承認日時を記録します。
            </Alert>
          ) : null}
          {error ? (
            <Alert className="mt-5" variant="error" title="承認できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button isLoading={mutation.isPending} onClick={() => void confirm()}>
              確認して公開
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
