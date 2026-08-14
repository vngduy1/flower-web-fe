"use client";

import { useEffect, useRef } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useSetAdminDeliveryResourceActive } from "../hooks/use-admin-delivery";
import type { AdminDeliveryResourceKind } from "../types/admin-delivery";

export function DeliveryStatusDialog({
  id,
  isActive,
  kind,
  label,
  onClose,
}: {
  id: string;
  isActive: boolean;
  kind: AdminDeliveryResourceKind;
  label: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mutation = useSetAdminDeliveryResourceActive(kind, id);
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function close() {
    dialogRef.current?.close();
  }

  async function confirm() {
    try {
      await mutation.mutateAsync(!isActive);
      dialogRef.current?.close();
    } catch {
      // Keep the normalized backend error visible for retry.
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
      aria-labelledby="delivery-status-title"
      aria-describedby="delivery-status-description"
      onCancel={(event) => {
        if (mutation.isPending) event.preventDefault();
      }}
      onClose={onClose}
    >
      <div className="p-6 sm:p-8">
        <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
          Status confirmation
        </p>
        <h2
          id="delivery-status-title"
          className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
        >
          {isActive ? "無効にしますか？" : "有効にしますか？"}
        </h2>
        <p
          id="delivery-status-description"
          className="text-muted-foreground mt-3 text-sm"
        >
          対象: {label}
        </p>
        {isActive ? (
          <Alert className="mt-5" variant="warning" title="完全削除ではありません">
            無効化しても登録情報は保持されます。
          </Alert>
        ) : (
          <Alert className="mt-5">
            専用の復元APIはないため、PATCHのisActive更新で再び有効にします。
          </Alert>
        )}
        {error ? (
          <Alert className="mt-5" variant="error" title="状態を変更できませんでした">
            {error.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </Alert>
        ) : null}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
            キャンセル
          </Button>
          <Button
            variant={isActive ? "danger" : "primary"}
            isLoading={mutation.isPending}
            onClick={() => void confirm()}
          >
            {isActive ? "確認して無効化" : "確認して有効化"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
