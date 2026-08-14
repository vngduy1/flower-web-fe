"use client";

import { useRef, useState } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useUpdateAdminUserStatus } from "../hooks/use-admin-users";
import type { AdminUser, UserStatus } from "../types/admin-user";
import { USER_STATUSES, USER_STATUS_LABELS } from "../utils/admin-user";

function nextStatus(currentStatus: UserStatus): UserStatus {
  return USER_STATUSES.find((status) => status !== currentStatus) ?? "ACTIVE";
}

export function UpdateUserStatusDialog({
  isSelf,
  user,
}: {
  isSelf: boolean;
  user: AdminUser;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<UserStatus>(nextStatus(user.status));
  const [success, setSuccess] = useState(false);
  const mutation = useUpdateAdminUserStatus(user.id);
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  function open() {
    setSuccess(false);
    mutation.reset();
    setStatus(nextStatus(user.status));
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    mutation.reset();
  }

  async function confirm() {
    try {
      await mutation.mutateAsync({ status });
      dialogRef.current?.close();
      setSuccess(true);
    } catch {
      // Preserve the normalized conflict or permission message in the dialog.
    }
  }

  return (
    <div>
      {success ? (
        <Alert className="mb-4" variant="success">
          アカウント状態を更新しました。
        </Alert>
      ) : null}
      <Button className="w-full" variant="secondary" disabled={isSelf} onClick={open}>
        状態を変更
      </Button>
      {isSelf ? (
        <p className="text-muted-foreground mt-2 text-xs leading-5">
          自分自身の状態変更が禁止されています。
        </p>
      ) : null}

      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="update-user-status-title"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => mutation.reset()}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Status confirmation
          </p>
          <h2
            id="update-user-status-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            アカウント状態を変更しますか？
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            {user.fullName} — 現在: {USER_STATUS_LABELS[user.status]}
          </p>
          <label className="mt-6 grid gap-2 text-sm font-semibold">
            新しい状態
            <select
              className="focus:border-brand min-h-11 rounded-xl border bg-white px-3 text-sm focus:outline-none"
              value={status}
              disabled={mutation.isPending}
              onChange={(event) => setStatus(event.target.value as UserStatus)}
            >
              {USER_STATUSES.map((value) => (
                <option key={value} value={value} disabled={value === user.status}>
                  {USER_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          {status !== "ACTIVE" ? (
            <Alert className="mt-5" variant="warning">
              「有効」以外のユーザーはログインできません。
            </Alert>
          ) : null}
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
              variant={status === "ACTIVE" ? "primary" : "danger"}
              isLoading={mutation.isPending}
              onClick={() => void confirm()}
            >
              確認して変更
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
