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
        注文内容を確認する
      </Button>

      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,500px)] border border-brand/10 p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="place-order-title"
        onCancel={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
      >
        <div className="p-6 sm:p-8">
          <p className="home-eyebrow">
            Final confirmation
          </p>

          <div className="hanaori-rule mt-5" />

          <h2
            id="place-order-title"
            className="text-brand-dark mt-6 font-serif text-2xl font-medium"
          >
            この内容で注文しますか？
          </h2>

          <p className="text-muted-foreground mt-4 text-sm leading-8">
            お届け先、お届け日時、ご注文内容にお間違いがないか、
            最後にご確認ください。
          </p>

          <div className="border-brand/10 mt-7 border-t pt-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                disabled={isPending}
                onClick={() => dialogRef.current?.close()}
              >
                戻って確認する
              </Button>

              <Button
                isLoading={isPending}
                onClick={() => void confirmOrder()}
              >
                注文を確定する
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}