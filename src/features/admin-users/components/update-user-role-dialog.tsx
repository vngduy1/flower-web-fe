"use client";

import { useRef, useState } from "react";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useUpdateAdminUserRole } from "../hooks/use-admin-users";
import type { AdminUser, RoleCode } from "../types/admin-user";
import { ROLE_CODES, ROLE_LABELS } from "../utils/admin-user";

function nextRole(currentRole: RoleCode | null): RoleCode {
  return ROLE_CODES.find((roleCode) => roleCode !== currentRole) ?? "CUSTOMER";
}

export function UpdateUserRoleDialog({
  isSelf,
  user,
}: {
  isSelf: boolean;
  user: AdminUser;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const currentRole = user.role?.roleCode ?? null;
  const [roleCode, setRoleCode] = useState<RoleCode>(nextRole(currentRole));
  const [success, setSuccess] = useState(false);
  const mutation = useUpdateAdminUserRole(user.id);
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  function open() {
    setSuccess(false);
    mutation.reset();
    setRoleCode(nextRole(currentRole));
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    mutation.reset();
  }

  async function confirm() {
    try {
      await mutation.mutateAsync({ roleCode });
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
          ユーザーのロールを更新しました。
        </Alert>
      ) : null}
      <Button className="w-full" variant="secondary" disabled={isSelf} onClick={open}>
        ロールを変更
      </Button>
      {isSelf ? (
        <p className="text-muted-foreground mt-2 text-xs leading-5">
          は自分自身のロール変更が禁止されています。
        </p>
      ) : null}

      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="update-user-role-title"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => mutation.reset()}
      >
        <div className="p-6 sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Role confirmation
          </p>
          <h2
            id="update-user-role-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            ロールを変更しますか？
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            {user.fullName} — 現在: {currentRole ? ROLE_LABELS[currentRole] : "情報なし"}
          </p>
          <label className="mt-6 grid gap-2 text-sm font-semibold">
            新しいロール
            <select
              className="focus:border-brand min-h-11 rounded-xl border bg-white px-3 text-sm focus:outline-none"
              value={roleCode}
              disabled={mutation.isPending}
              onChange={(event) => setRoleCode(event.target.value as RoleCode)}
            >
              {ROLE_CODES.map((value) => (
                <option key={value} value={value} disabled={value === currentRole}>
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          {error ? (
            <Alert className="mt-5" variant="error" title="ロールを変更できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button isLoading={mutation.isPending} onClick={() => void confirm()}>
              確認して変更
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
