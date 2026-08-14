"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useRejectAdminReview } from "../hooks/use-admin-reviews";
import {
  rejectAdminReviewSchema,
  type RejectAdminReviewFormValues,
} from "../schemas/reject-review.schema";
import type { AdminReview } from "../types/admin-review";

export function RejectReviewDialog({ review }: { review: AdminReview }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [success, setSuccess] = useState(false);
  const mutation = useRejectAdminReview(review.id);
  const form = useForm<RejectAdminReviewFormValues>({
    resolver: zodResolver(rejectAdminReviewSchema),
    defaultValues: { adminComment: "" },
  });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;
  const isRejected = review.status === "REJECTED";
  const commentLength =
    useWatch({ control: form.control, name: "adminComment" })?.length ?? 0;

  function open() {
    setSuccess(false);
    mutation.reset();
    form.reset({ adminComment: "" });
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    mutation.reset();
    form.reset();
  }

  async function submit(values: RejectAdminReviewFormValues) {
    try {
      await mutation.mutateAsync(values);
      dialogRef.current?.close();
      setSuccess(true);
    } catch {
      // Keep backend validation, conflict, or authorization errors in the dialog.
    }
  }

  return (
    <div>
      {success ? (
        <Alert className="mb-4" variant="success">
          レビューを非承認に更新しました。
        </Alert>
      ) : null}
      <Button className="w-full" variant="secondary" disabled={isRejected} onClick={open}>
        非承認にする
      </Button>
      {isRejected ? (
        <p className="text-muted-foreground mt-2 text-xs leading-5">
          は非承認レビューの再拒否を競合として扱います。
        </p>
      ) : null}

      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,600px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="reject-review-title"
        aria-describedby="reject-review-description"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => {
          mutation.reset();
          form.reset();
        }}
      >
        <form
          className="p-6 sm:p-8"
          onSubmit={(event) => void form.handleSubmit(submit)(event)}
        >
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Rejection confirmation
          </p>
          <h2
            id="reject-review-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            このレビューを非承認にしますか？
          </h2>
          <p
            id="reject-review-description"
            className="text-muted-foreground mt-3 text-sm"
          >
            レビューID {review.id}。理由は顧客のレビュー情報に表示されます。
          </p>
          <label className="mt-6 grid gap-2 text-sm font-semibold">
            非承認の理由
            <textarea
              rows={6}
              maxLength={500}
              disabled={mutation.isPending}
              className="focus:border-brand rounded-xl border bg-white px-3.5 py-3 text-sm focus:outline-none"
              aria-describedby="reject-review-comment-help"
              {...form.register("adminComment")}
            />
          </label>
          <div
            id="reject-review-comment-help"
            className="mt-2 flex justify-between gap-3"
          >
            <span className="text-sm text-red-700">
              {form.formState.errors.adminComment?.message}
            </span>
            <span className="text-muted-foreground ml-auto text-xs">
              {commentLength} / 500
            </span>
          </div>
          {review.status === "APPROVED" ? (
            <Alert className="mt-5" variant="warning">
              承認日時をクリアし、非承認日時を記録します。公開一覧からも除外されます。
            </Alert>
          ) : null}
          {error ? (
            <Alert className="mt-5" variant="error" title="非承認にできませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button type="submit" variant="danger" isLoading={mutation.isPending}>
              確認して非承認
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
