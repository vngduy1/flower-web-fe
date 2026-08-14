"use client";

import { useRef, useState } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useDisableAdminCoupon, useUpdateAdminCoupon } from "../hooks/use-admin-coupons";
import type { AdminCoupon } from "../types/admin-coupon";

export function DisableCouponDialog({ coupon }: { coupon: AdminCoupon }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const disableMutation = useDisableAdminCoupon(coupon.id);
  const updateMutation = useUpdateAdminCoupon(coupon.id);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const mutation = coupon.isActive ? disableMutation : updateMutation;
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  function open() {
    disableMutation.reset();
    updateMutation.reset();
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    disableMutation.reset();
    updateMutation.reset();
  }

  async function confirm() {
    try {
      if (coupon.isActive) {
        await disableMutation.mutateAsync();
        setSuccessMessage("クーポンを無効にしました。利用履歴は保持されています。");
      } else {
        await updateMutation.mutateAsync({ isActive: true });
        setSuccessMessage("クーポンを再び有効にしました。");
      }
      dialogRef.current?.close();
    } catch {
      // Keep the normalized backend error visible in the confirmation dialog.
    }
  }

  return (
    <div>
      {successMessage ? (
        <Alert className="mb-4" variant="success">
          {successMessage}
        </Alert>
      ) : null}
      <Button
        className="w-full"
        variant={coupon.isActive ? "danger" : "secondary"}
        onClick={open}
      >
        {coupon.isActive ? "クーポンを無効化" : "クーポンを有効化"}
      </Button>

      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="coupon-state-dialog-title"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => {
          disableMutation.reset();
          updateMutation.reset();
        }}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            State confirmation
          </p>
          <h2
            id="coupon-state-dialog-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            {coupon.isActive
              ? "クーポンを無効にしますか？"
              : "クーポンを有効にしますか？"}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-7">
            対象: {coupon.code} — {coupon.name}
          </p>
          {coupon.isActive ? (
            <Alert className="mt-5" variant="warning" title="完全削除ではありません">
              DELETE
              APIはisActiveをfalseへ変更するだけです。過去の利用履歴と利用数は保持されます。
            </Alert>
          ) : (
            <Alert className="mt-5" variant="info">
              PATCH
              APIのisActive更新を使用します。有効期間や利用上限によっては、有効化後も現在利用できない場合があります。
            </Alert>
          )}
          {error ? (
            <Alert className="mt-5" variant="error" title="状態を変更できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button
              variant={coupon.isActive ? "danger" : "primary"}
              isLoading={mutation.isPending}
              onClick={() => void confirm()}
            >
              {coupon.isActive ? "確認して無効化" : "確認して有効化"}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
