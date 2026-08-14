"use client";

import { useRef } from "react";

import { Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useClearCart } from "../hooks/use-clear-cart";

export function ClearCartDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const clearMutation = useClearCart();
  const error = clearMutation.error ? normalizeApiError(clearMutation.error) : null;

  const handleClear = async () => {
    try {
      await clearMutation.mutateAsync();
      dialogRef.current?.close();
    } catch {
      // The normalized mutation error is rendered inside the dialog.
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="text-red-700 hover:bg-red-50"
        onClick={() => dialogRef.current?.showModal()}
      >
        カートを空にする
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,480px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="clear-cart-title"
        onCancel={(event) => {
          if (clearMutation.isPending) event.preventDefault();
        }}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
            Confirmation
          </p>
          <h2 id="clear-cart-title" className="text-brand-dark mt-3 font-serif text-2xl">
            カートを空にしますか？
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-7">
            カート内のすべての商品が削除されます。この操作は取り消せません。
          </p>
          {error ? (
            <p
              className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {error.message}
            </p>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
              disabled={clearMutation.isPending}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              isLoading={clearMutation.isPending}
              onClick={() => void handleClear()}
            >
              すべて削除
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
