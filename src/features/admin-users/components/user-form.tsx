"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useCreateAdminUser } from "../hooks/use-admin-users";
import {
  adminUserFormSchema,
  type AdminUserFormValues,
} from "../schemas/admin-user.schema";
import { toCreateAdminUserRequest } from "../utils/admin-user";
import {
  ROLE_CODES,
  ROLE_LABELS,
  USER_STATUSES,
  USER_STATUS_LABELS,
} from "../utils/admin-user";

const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";
const selectClass =
  "focus:border-brand min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm shadow-sm focus:outline-none";

export function UserForm() {
  const router = useRouter();
  const mutation = useCreateAdminUser();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      roleCode: "CUSTOMER",
      status: "ACTIVE",
    },
  });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  const submit: SubmitHandler<AdminUserFormValues> = async (values) => {
    try {
      const created = await mutation.mutateAsync(toCreateAdminUserRequest(values));
      router.push(`/admin/users/${encodeURIComponent(created.id)}?created=true`);
    } catch {
      // The normalized backend error remains visible above the form.
    }
  };

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => void form.handleSubmit(submit)(event)}
      noValidate
    >
      {error ? (
        <Alert variant="error" title="ユーザーを作成できませんでした">
          {error.messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </Alert>
      ) : null}

      <section className={sectionClass}>
        <h2 className="text-brand-dark font-serif text-xl font-semibold">基本情報</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Input
            id="admin-user-full-name"
            label="氏名"
            maxLength={100}
            autoComplete="name"
            required
            disabled={mutation.isPending}
            error={form.formState.errors.fullName?.message}
            {...form.register("fullName")}
          />
          <Input
            id="admin-user-email"
            label="メールアドレス"
            type="email"
            minLength={5}
            maxLength={255}
            autoComplete="off"
            required
            disabled={mutation.isPending}
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <Input
            id="admin-user-phone"
            label="電話番号（任意）"
            type="tel"
            minLength={8}
            maxLength={20}
            autoComplete="off"
            hint="数字、+、-、空白、丸括弧を使用できます。"
            disabled={mutation.isPending}
            error={form.formState.errors.phone?.message}
            {...form.register("phone")}
          />
          <div className="grid content-start gap-2">
            <Input
              id="admin-user-password"
              label="初期パスワード"
              type={showPassword ? "text" : "password"}
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              required
              hint="8〜72文字。パスワードは保存後に再表示されません。"
              disabled={mutation.isPending}
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />
            <button
              type="button"
              className="text-brand w-fit text-xs font-semibold"
              aria-pressed={showPassword}
              disabled={mutation.isPending}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              パスワードを{showPassword ? "隠す" : "表示"}
            </button>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-brand-dark font-serif text-xl font-semibold">ロールと状態</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            ロール
            <select
              className={selectClass}
              disabled={mutation.isPending}
              {...form.register("roleCode")}
            >
              {ROLE_CODES.map((roleCode) => (
                <option key={roleCode} value={roleCode}>
                  {ROLE_LABELS[roleCode]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            アカウント状態
            <select
              className={selectClass}
              disabled={mutation.isPending}
              {...form.register("status")}
            >
              {USER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {USER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          variant="secondary"
          disabled={mutation.isPending}
          onClick={() => {
            if (
              !form.formState.isDirty ||
              window.confirm("入力した内容を破棄しますか？")
            ) {
              router.push("/admin/users");
            }
          }}
        >
          キャンセル
        </Button>
        <Button type="submit" isLoading={mutation.isPending}>
          ユーザーを作成
        </Button>
      </div>
    </form>
  );
}
