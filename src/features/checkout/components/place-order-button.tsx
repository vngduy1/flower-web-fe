"use client";

import { useRef } from "react";

import { Button } from "@/components/ui";

interface PlaceOrderButtonProps {
  disabled: boolean;
  isPending: boolean;
  onConfirm: () => Promise<void>;
  validate: () => Promise<boolean>;
}

export function PlaceOrderButton({
  disabled,
  isPending,
  onConfirm,
  validate,
}: PlaceOrderButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const requestConfirmation = async () => {
    if (await validate()) {
      dialogRef.current?.showModal();
    }
  };

  const confirmOrder = async () => {
    try {
      await onConfirm();
    } catch {
      dialogRef.current?.close();
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full"
        disabled={disabled}
        isLoading={isPending}
        onClick={() => void requestConfirmation()}
      >
        注文内容を確定する
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,500px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="place-order-title"
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
            Final confirmation
          </p>
          <h2 id="place-order-title" className="text-brand-dark mt-3 font-serif text-2xl">
            この内容で注文しますか？
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-7">
            配送先、配送日時、ご注文内容にお間違いがないか、 最後にご確認ください。
          </p>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() => dialogRef.current?.close()}
            >
              内容を確認する
            </Button>
            <Button isLoading={isPending} onClick={() => void confirmOrder()}>
              注文を確定
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
