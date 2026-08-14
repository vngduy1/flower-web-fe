"use client";

import { useRef } from "react";

import { Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useDeleteAddress } from "../hooks/use-delete-address";
import type { Address } from "../types/address";

export function DeleteAddressDialog({ address }: { address: Address }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteMutation = useDeleteAddress();
  const error = deleteMutation.error ? normalizeApiError(deleteMutation.error) : null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(address.id);
      dialogRef.current?.close();
    } catch {
      // The normalized mutation error remains visible in the dialog.
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-700 hover:bg-red-50"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`${address.label ?? address.recipientName}を削除`}
      >
        削除
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,480px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby={`delete-address-${address.id}-title`}
        onCancel={(event) => {
          if (deleteMutation.isPending) event.preventDefault();
        }}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
            Confirmation
          </p>
          <h2
            id={`delete-address-${address.id}-title`}
            className="text-brand-dark mt-3 font-serif text-2xl"
          >
            この配送先を削除しますか？
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-7">
            {address.label ?? address.recipientName}{" "}
            を住所一覧から削除します。標準住所の場合は、残っている最新の住所が自動的に標準になります。
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
              disabled={deleteMutation.isPending}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => void handleDelete()}
            >
              削除する
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
