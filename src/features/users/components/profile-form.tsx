"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Alert,
  Button,
  Card,
  CardContent,
  CardTitle,
  Input,
  Skeleton,
} from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useCurrentUser } from "../hooks/use-current-user";
import { useUpdateProfile } from "../hooks/use-update-profile";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "../schemas/profile.schema";

export function ProfileForm() {
  const currentUserQuery = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (currentUserQuery.data) {
      reset({
        fullName: currentUserQuery.data.fullName,
        phone: currentUserQuery.data.phone ?? "",
      });
    }
  }, [currentUserQuery.data, reset]);

  if (currentUserQuery.isPending) {
    return (
      <Card className="max-w-2xl space-y-5">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  if (currentUserQuery.error) {
    const error = normalizeApiError(currentUserQuery.error);

    return (
      <div className="max-w-2xl">
        <Alert variant="error" title="プロフィールを読み込めませんでした">
          {error.message}
        </Alert>
        <Button className="mt-5" onClick={() => void currentUserQuery.refetch()}>
          もう一度試す
        </Button>
      </div>
    );
  }

  const user = currentUserQuery.data;
  const backendError = updateProfileMutation.error
    ? normalizeApiError(updateProfileMutation.error)
    : null;
  const onSubmit = handleSubmit(async (values) => {
    try {
      const updatedUser = await updateProfileMutation.mutateAsync(values);
      reset({
        fullName: updatedUser.fullName,
        phone: updatedUser.phone ?? "",
      });
    } catch {
      // The normalized backend error remains visible above the form.
    }
  });

  return (
    <div className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_280px]">
      <Card>
        <CardTitle>基本情報</CardTitle>
        <CardContent className="mt-2">
          お届けやご連絡に使用する情報を編集できます。
        </CardContent>

        {updateProfileMutation.isSuccess ? (
          <Alert className="mt-6" variant="success">
            プロフィールを更新しました。
          </Alert>
        ) : null}
        {backendError ? (
          <Alert className="mt-6" variant="error" title="更新できませんでした">
            {backendError.message}
          </Alert>
        ) : null}

        <form className="mt-7 grid gap-5" onSubmit={onSubmit} noValidate>
          <Input
            id="profile-full-name"
            label="お名前"
            autoComplete="name"
            required
            error={errors.fullName?.message}
            disabled={updateProfileMutation.isPending}
            {...register("fullName")}
          />
          <Input
            id="profile-email"
            type="email"
            label="メールアドレス"
            value={user.email}
            disabled
            readOnly
            hint="メールアドレスは変更できません。"
          />
          <Input
            id="profile-phone"
            type="tel"
            inputMode="tel"
            label="電話番号"
            autoComplete="tel"
            hint="変更する場合は8〜20文字で入力してください。空欄の場合は変更されません。"
            error={errors.phone?.message}
            disabled={updateProfileMutation.isPending}
            {...register("phone")}
          />
          <div>
            <Button
              type="submit"
              isLoading={updateProfileMutation.isPending}
              disabled={!isDirty}
            >
              変更を保存
            </Button>
          </div>
        </form>
      </Card>

      <Card className="bg-brand-dark h-fit text-white">
        <p className="text-xs font-bold tracking-[0.15em] text-white/70 uppercase">
          Account status
        </p>
        <dl className="mt-6 grid gap-5 text-sm">
          <div>
            <dt className="text-white/70">ステータス</dt>
            <dd className="mt-1 font-semibold">{user.status}</dd>
          </div>
          <div>
            <dt className="text-white/70">ロール</dt>
            <dd className="mt-1 font-semibold">{user.role.roleName}</dd>
          </div>
          <div>
            <dt className="text-white/70">登録日</dt>
            <dd className="mt-1 font-semibold">
              {new Intl.DateTimeFormat("ja-JP").format(new Date(user.createdAt))}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
