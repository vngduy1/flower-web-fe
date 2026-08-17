"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useRegister } from "../hooks/use-register";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schemas";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const backendError = registerMutation.error
    ? normalizeApiError(registerMutation.error)
    : null;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const registeredUser = await registerMutation.mutateAsync(values);

      const query = new URLSearchParams({
        email: registeredUser.email,
      });

      router.push(`/verify-email?${query.toString()}`);
    } catch {
      // The normalized registration error remains visible above the form.
    }
  });

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
          Join Hanaori
        </p>
        <h1 className="text-brand-dark mt-3 font-serif text-4xl">会員登録</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-7">
          お届け先やご注文履歴をスムーズに管理できる、無料の会員登録です。
        </p>
      </div>

      {backendError ? (
        <Alert className="mb-6" variant="error" title="会員登録できませんでした">
          {backendError.message}
        </Alert>
      ) : null}

      <form className="grid gap-5" onSubmit={onSubmit} noValidate>
        <Input
          id="register-full-name"
          label="お名前"
          autoComplete="name"
          placeholder="花織 さくら"
          required
          error={errors.fullName?.message}
          disabled={registerMutation.isPending}
          {...register("fullName")}
        />
        <Input
          id="register-email"
          type="email"
          label="メールアドレス"
          autoComplete="email"
          placeholder="customer@example.com"
          required
          error={errors.email?.message}
          disabled={registerMutation.isPending}
          {...register("email")}
        />
        <Input
          id="register-phone"
          type="tel"
          inputMode="tel"
          label="電話番号（任意）"
          autoComplete="tel"
          placeholder="09012345678"
          hint="数字、+、-、空白、括弧が使用できます。"
          error={errors.phone?.message}
          disabled={registerMutation.isPending}
          {...register("phone")}
        />
        <Input
          id="register-password"
          type="password"
          label="パスワード"
          autoComplete="new-password"
          hint="8〜100文字で入力してください。"
          required
          error={errors.password?.message}
          disabled={registerMutation.isPending}
          {...register("password")}
        />
        <Input
          id="register-password-confirmation"
          type="password"
          label="パスワード（確認）"
          autoComplete="new-password"
          required
          error={errors.passwordConfirmation?.message}
          disabled={registerMutation.isPending}
          {...register("passwordConfirmation")}
        />

        <p className="text-muted-foreground text-xs leading-6">
          登録ボタンを押すことで、サービスの利用条件とプライバシー方針に同意したものとみなされます。
        </p>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={registerMutation.isPending}
        >
          会員登録する
        </Button>
      </form>

      <p className="text-muted-foreground mt-7 text-center text-sm">
        すでにアカウントをお持ちの方は&nbsp;
        <Link
          href="/login"
          className="text-brand-dark font-semibold underline-offset-4 hover:underline"
        >
          ログイン
        </Link>
      </p>
    </div>
  );
}
