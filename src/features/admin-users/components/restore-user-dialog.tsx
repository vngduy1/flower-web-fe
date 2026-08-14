"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useRestoreAdminUser } from "../hooks/use-admin-users";

export function RestoreUserDialog({ userId }: { userId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const mutation = useRestoreAdminUser(userId);
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  function open() {
    mutation.reset();
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    mutation.reset();
  }

  async function confirm() {
    try {
      const restored = await mutation.mutateAsync();
      dialogRef.current?.close();
      router.replace(
        `/admin/users/${encodeURIComponent(restored.user.id)}?restored=true`,
      );
    } catch {
      // Preserve the normalized conflict or missing-user message in the dialog.
    }
  }

  return (
    <div>
      <Button size="sm" variant="secondary" onClick={open}>
        このユーザーを復元
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,540px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="restore-user-title"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => mutation.reset()}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Restore confirmation
          </p>
          <h2
            id="restore-user-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            ユーザーを復元しますか？
          </h2>
          <p className="text-muted-foreground mt-3 text-sm break-all">
            ユーザーID: {userId}
          </p>
          <Alert className="mt-5" variant="info">
            復元後も、削除前のロールとアカウント状態が維持されます。
          </Alert>
          {error ? (
            <Alert className="mt-5" variant="error" title="復元できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button isLoading={mutation.isPending} onClick={() => void confirm()}>
              確認して復元
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
