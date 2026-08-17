"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useResendVerification } from "../hooks/use-resend-verification";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { verifyEmailSchema, type VerifyEmailFormValues } from "../schemas/auth.schemas";

interface VerifyEmailFormProps {
  email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const router = useRouter();

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const verifyError = verifyMutation.error
    ? normalizeApiError(verifyMutation.error)
    : null;

  const resendError = resendMutation.error
    ? normalizeApiError(resendMutation.error)
    : null;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await verifyMutation.mutateAsync({
        email,
        code: values.code,
      });

      const query = new URLSearchParams({
        verified: "1",
        email,
      });

      router.replace(`/login?${query.toString()}`);
    } catch {
      // Error is displayed above the form.
    }
  });

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync(email);
    } catch {
      // Error is displayed below.
    }
  };

  const isPending = verifyMutation.isPending || resendMutation.isPending;

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
          Verify your email
        </p>

        <h1 className="text-brand-dark mt-3 font-serif text-4xl">メールアドレスの確認</h1>

        <p className="text-muted-foreground mt-3 text-sm leading-7">
          ご登録のメールアドレスに6桁の確認コードを送信しました。
        </p>
      </div>

      <Alert className="mb-6" variant="success" title="確認コードを送信しました">
        {email}
      </Alert>

      {verifyError ? (
        <Alert className="mb-6" variant="error" title="確認できませんでした">
          {verifyError.message}
        </Alert>
      ) : null}

      {resendMutation.isSuccess ? (
        <Alert className="mb-6" variant="success" title="確認コードを再送しました">
          新しい確認コードをご確認ください。
        </Alert>
      ) : null}

      {resendError ? (
        <Alert className="mb-6" variant="error" title="再送できませんでした">
          {resendError.message}
        </Alert>
      ) : null}

      <form className="grid gap-5" onSubmit={onSubmit} noValidate>
        <Input
          id="verification-code"
          label="確認コード"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          maxLength={6}
          required
          error={errors.code?.message}
          disabled={isPending}
          {...register("code")}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={verifyMutation.isPending}
          disabled={resendMutation.isPending}
        >
          メールアドレスを確認する
        </Button>
      </form>

      <div className="mt-7 text-center">
        <p className="text-muted-foreground text-sm">確認コードが届きませんか？</p>

        <Button
          type="button"
          variant="ghost"
          className="mt-2"
          onClick={handleResend}
          disabled={isPending}
          isLoading={resendMutation.isPending}
        >
          確認コードを再送する
        </Button>
      </div>

      <p className="text-muted-foreground mt-7 text-center text-sm">
        <Link
          href="/login"
          className="text-brand-dark font-semibold underline-offset-4 hover:underline"
        >
          ログイン画面に戻る
        </Link>
      </p>
    </div>
  );
}
