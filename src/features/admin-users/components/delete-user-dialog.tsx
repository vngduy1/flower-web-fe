"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useDeleteAdminUser } from "../hooks/use-admin-users";

export function DeleteUserDialog({
  fullName,
  isSelf,
  userId,
}: {
  fullName: string;
  isSelf: boolean;
  userId: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const mutation = useDeleteAdminUser(userId);
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
      await mutation.mutateAsync();
      dialogRef.current?.close();
      router.replace(`/admin/users?deletedId=${encodeURIComponent(userId)}`);
    } catch {
      // Preserve the normalized conflict or permission message in the dialog.
    }
  }

  return (
    <div>
      <Button className="w-full" variant="danger" disabled={isSelf} onClick={open}>
        ユーザーをソフト削除
      </Button>
      {isSelf ? (
        <p className="text-muted-foreground mt-2 text-xs leading-5">
          自分自身の削除が禁止されています。
        </p>
      ) : null}

      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="delete-user-title"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => mutation.reset()}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Delete confirmation
          </p>
          <h2
            id="delete-user-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            ユーザーをソフト削除しますか？
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            {fullName} — ID {userId}
          </p>
          <Alert className="mt-5" variant="warning" title="完全削除ではありません">
            ユーザーデータは保持されますが、通常の一覧と詳細からは取得できなくなります。
          </Alert>
          {error ? (
            <Alert className="mt-5" variant="error" title="削除できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button
              variant="danger"
              isLoading={mutation.isPending}
              onClick={() => void confirm()}
            >
              確認してソフト削除
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
