import type { Metadata } from "next";
import Link from "next/link";

import { UserForm } from "@/features/admin-users/components/user-form";

export const metadata: Metadata = {
  title: "ユーザー作成",
  description: "管理者権限で新しいユーザーを作成します。",
};

export default function NewAdminUserPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/users" className="text-brand text-sm font-semibold">
        ← ユーザー一覧
      </Link>
      <div className="mt-5">
        <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
          New user
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
          ユーザーを作成
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          管理者向け作成APIを使用して、ロールと初期状態を設定します。
        </p>
      </div>
      <div className="mt-7">
        <UserForm />
      </div>
    </div>
  );
}
