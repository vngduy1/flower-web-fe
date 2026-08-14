"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useCancelOrder } from "../hooks/use-cancel-order";
import {
  cancelOrderSchema,
  type CancelOrderFormValues,
} from "../schemas/cancel-order.schema";
import type { Order } from "../types/order";

export function CancelOrderDialog({ order }: { order: Order }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelMutation = useCancelOrder();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CancelOrderFormValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: { reason: "" },
  });
  const error = cancelMutation.error ? normalizeApiError(cancelMutation.error) : null;
  const isPaid = order.paymentStatus === "PAID";

  const closeDialog = () => {
    dialogRef.current?.close();
    cancelMutation.reset();
    reset();
  };

  const submitCancellation: SubmitHandler<CancelOrderFormValues> = async (values) => {
    if (isPaid) return;

    const reason = values.reason.trim();

    try {
      await cancelMutation.mutateAsync({
        orderId: order.id,
        request: reason ? { reason } : {},
      });
      dialogRef.current?.close();
      cancelMutation.reset();
      reset();
    } catch {
      // The normalized backend error remains visible in the dialog.
    }
  };

  return (
    <>
      <Button
        variant="danger"
        className="mt-5"
        onClick={() => dialogRef.current?.showModal()}
      >
        注文をキャンセル
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby={`cancel-order-${order.id}-title`}
        onCancel={(event) => {
          if (cancelMutation.isPending) event.preventDefault();
        }}
        onClose={() => {
          cancelMutation.reset();
          reset();
        }}
      >
        <form
          className="p-6 sm:p-8"
          onSubmit={(event) => void handleSubmit(submitCancellation)(event)}
        >
          <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
            Cancel order
          </p>
          <h2
            id={`cancel-order-${order.id}-title`}
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            この注文をキャンセルしますか？
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-7">
            注文番号 {order.orderNumber} をキャンセルします。この操作は取り消せません。
          </p>

          {isPaid ? (
            <Alert className="mt-5" variant="warning" title="キャンセルできません">
              返金処理にはまだ対応していないため、支払い済みの注文はキャンセルできません。
            </Alert>
          ) : null}

          <div className="mt-6 grid gap-2">
            <label
              htmlFor={`cancel-order-${order.id}-reason`}
              className="text-sm font-semibold"
            >
              キャンセル理由（任意）
            </label>
            <textarea
              id={`cancel-order-${order.id}-reason`}
              rows={5}
              maxLength={500}
              disabled={cancelMutation.isPending}
              className="focus:border-brand min-h-28 w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-base shadow-sm focus:outline-none sm:text-sm"
              aria-invalid={Boolean(errors.reason)}
              aria-describedby={
                errors.reason ? `cancel-order-${order.id}-reason-error` : undefined
              }
              {...register("reason")}
            />
            {errors.reason ? (
              <p
                id={`cancel-order-${order.id}-reason-error`}
                className="text-sm text-red-700"
                role="alert"
              >
                {errors.reason.message}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">最大500文字</p>
            )}
          </div>

          {error ? (
            <Alert className="mt-5" variant="error" title="キャンセルできませんでした">
              {error.message}
            </Alert>
          ) : null}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={closeDialog}
              disabled={cancelMutation.isPending}
            >
              戻る
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={cancelMutation.isPending}
              disabled={isPaid || cancelMutation.isPending}
            >
              キャンセルを確定
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
