"use client";

import Link from "next/link";

import { Alert, Card, CardContent, CardTitle } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function AccountOverview({ forbidden }: { forbidden?: boolean }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      {forbidden ? (
        <Alert className="mb-6" variant="warning" title="アクセスできないページです">
          このアカウントには管理画面を表示する権限がありません。
        </Alert>
      ) : null}
      <p className="text-accent text-xs font-bold tracking-[0.18em] uppercase">
        My account
      </p>
      <h1 className="text-brand-dark mt-3 font-serif text-3xl sm:text-4xl">
        {user.fullName}さん、こんにちは。
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-7">
        登録情報やご注文に関する内容を、ここから確認できます。
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <CardTitle>プロフィール</CardTitle>
          <CardContent className="mt-3">
            お名前や電話番号など、現在の登録情報を確認・編集します。
          </CardContent>
          <Link
            href="/account/profile"
            className="text-brand-dark mt-6 inline-flex text-sm font-semibold underline-offset-4 hover:underline"
          >
            プロフィールを編集
          </Link>
        </Card>
        <Card>
          <CardTitle>注文履歴</CardTitle>
          <CardContent className="mt-3">
            注文情報の連携は Phase 6 で実装します。現在は保護された導線のみ利用できます。
          </CardContent>
          <Link
            href="/account/orders"
            className="text-brand-dark mt-6 inline-flex text-sm font-semibold underline-offset-4 hover:underline"
          >
            注文履歴へ
          </Link>
        </Card>
      </div>
    </div>
  );
}
