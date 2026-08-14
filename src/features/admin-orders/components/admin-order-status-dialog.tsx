"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { Alert, Button } from "@/components/ui";
import { getOrderStatusLabel } from "@/features/orders/utils/order-labels";
import { normalizeApiError } from "@/lib/api";

import { useUpdateAdminOrderStatus } from "../hooks/use-admin-orders";
import {
  updateAdminOrderStatusSchema,
  type UpdateAdminOrderStatusValues,
} from "../schemas/admin-order.schema";
import type { AdminOrderDetail } from "../types/admin-order";
import { getValidNextStatuses } from "../utils/admin-order";

export function AdminOrderStatusDialog({ order }: { order: AdminOrderDetail }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mutation = useUpdateAdminOrderStatus(order.id);
  const validStatuses = getValidNextStatuses(order.status, order.paymentStatus);
  const initialStatus = validStatuses[0] ?? order.status;
  const [success, setSuccess] = useState(false);
  const form = useForm<UpdateAdminOrderStatusValues>({
    resolver: zodResolver(updateAdminOrderStatusSchema),
    defaultValues: { status: initialStatus, note: "" },
  });
  const selectedStatus = useWatch({ control: form.control, name: "status" });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  function open() {
    setSuccess(false);
    mutation.reset();
    form.reset({ status: validStatuses[0] ?? order.status, note: "" });
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    mutation.reset();
    form.reset();
  }

  const submit: SubmitHandler<UpdateAdminOrderStatusValues> = async (values) => {
    const note = values.note.trim();
    try {
      await mutation.mutateAsync({
        status: values.status,
        ...(note ? { note } : {}),
      });
      dialogRef.current?.close();
      setSuccess(true);
    } catch {
      // The normalized backend error stays visible in the dialog.
    }
  };

  return (
    <div>
      {success ? (
        <Alert className="mb-4" variant="success">
          注文ステータスを更新しました。
        </Alert>
      ) : null}
      {validStatuses.length ? (
        <Button onClick={open}>ステータスを更新</Button>
      ) : (
        <p className="text-muted-foreground rounded-xl bg-slate-100 px-4 py-3 text-sm">
          この注文に更新可能な次のステータスはありません。
        </p>
      )}
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,600px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="admin-order-status-title"
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
            ステータス変更
          </p>
          <h2
            id="admin-order-status-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            注文ステータスを変更
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            現在のステータス【
            {getOrderStatusLabel(order.status)} 】
            から、変更可能なステータスのみ表示されます。
          </p>
          <label className="mt-6 grid gap-2 text-sm font-semibold">
            変更後のステータス
            <select
              className="min-h-11 rounded-xl border bg-white px-3 text-sm"
              disabled={mutation.isPending}
              {...form.register("status")}
            >
              {validStatuses.map((status) => (
                <option key={status} value={status}>
                  {getOrderStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-5 grid gap-2 text-sm font-semibold">
            変更メモ（任意）
            <textarea
              rows={5}
              maxLength={500}
              disabled={mutation.isPending}
              className="focus:border-brand rounded-xl border bg-white px-3.5 py-3 text-sm focus:outline-none"
              {...form.register("note")}
            />
            {form.formState.errors.note ? (
              <span className="text-sm text-red-700">
                {form.formState.errors.note.message}
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">
                履歴に保存されます。最大500文字。
              </span>
            )}
          </label>
          {selectedStatus === "CANCELLED" ? (
            <Alert className="mt-5" variant="warning" title="キャンセル処理">
              <p>
                キャンセルすると商品在庫が戻され、お客様へ通知とメールが送信されます。
              </p>

              {order.paymentStatus === "PAID" ? (
                <p className="mt-2 font-semibold">
                  支払い済みの注文をキャンセルしても、返金は自動で行われません。
                  必要に応じて別途返金処理を行ってください。
                </p>
              ) : null}

              {order.coupon ? (
                <p className="mt-2">
                  キャンセルしても、使用したクーポンは再利用できません。
                </p>
              ) : null}
            </Alert>
          ) : null}
          {error ? (
            <Alert
              className="mt-5"
              variant="error"
              title="ステータスを更新できませんでした"
            >
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button
              type="submit"
              variant={selectedStatus === "CANCELLED" ? "danger" : "primary"}
              isLoading={mutation.isPending}
            >
              確認して更新
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
