"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schemas";
import { getSafeReturnTo } from "../utils/auth-routing";

interface LoginFormProps {
  defaultEmail?: string;
  registered?: boolean;
  returnTo?: string;
  sessionExpired?: boolean;
}

export function LoginForm({
  defaultEmail = "",
  registered,
  returnTo,
  sessionExpired,
}: LoginFormProps) {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: "",
    },
  });

  const backendError = loginMutation.error
    ? normalizeApiError(loginMutation.error)
    : null;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await loginMutation.mutateAsync(values);
      router.replace(getSafeReturnTo(returnTo ?? null, user.roleCode));
    } catch {
      // The normalized authentication error remains visible above the form.
    }
  });

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
          Welcome back
        </p>
        <h1 className="text-brand-dark mt-3 font-serif text-4xl">ログイン</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-7">
          ご登録のメールアドレスとパスワードを入力してください。
        </p>
      </div>

      {registered ? (
        <Alert className="mb-6" variant="success" title="会員登録が完了しました">
          続けてログインしてください。
        </Alert>
      ) : null}

      {sessionExpired ? (
        <Alert
          className="mb-6"
          variant="warning"
          title="セッションの有効期限が切れました"
        >
          安全のため、もう一度ログインしてください。
        </Alert>
      ) : null}

      {backendError ? (
        <Alert className="mb-6" variant="error" title="ログインできませんでした">
          {backendError.message}
        </Alert>
      ) : null}

      <form className="grid gap-5" onSubmit={onSubmit} noValidate>
        <Input
          id="login-email"
          type="email"
          label="メールアドレス"
          autoComplete="email"
          placeholder="customer@example.com"
          required
          error={errors.email?.message}
          disabled={loginMutation.isPending}
          {...register("email")}
        />
        <Input
          id="login-password"
          type="password"
          label="パスワード"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          disabled={loginMutation.isPending}
          {...register("password")}
        />
        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          isLoading={loginMutation.isPending}
        >
          ログイン
        </Button>
      </form>

      <p className="text-muted-foreground mt-7 text-center text-sm">
        はじめてご利用の方は&nbsp;
        <Link
          href="/register"
          className="text-brand-dark font-semibold underline-offset-4 hover:underline"
        >
          会員登録
        </Link>
      </p>
    </div>
  );
}
