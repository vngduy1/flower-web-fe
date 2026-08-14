"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui";

import { useAuth } from "../hooks/use-auth";
import { useLogoutRedirect } from "../hooks/use-logout-redirect";
import { isAdminRole } from "../utils/auth-routing";
import { UserAvatar } from "./user-avatar";

export function AuthNavigation() {
  const { isLoading, user } = useAuth();
  const handleLogout = useLogoutRedirect("/");

  const notificationHref =
    user?.roleCode === "ADMIN" ? "/admin/notifications" : "/account/notifications";

  if (isLoading) {
    return <Skeleton className="h-10 w-28 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-brand-dark hover:bg-brand-soft/55 inline-flex min-h-10 items-center rounded-full px-3 text-xs font-semibold transition-colors sm:px-4 sm:text-sm"
        >
          ログイン
        </Link>
        <Link
          href="/register"
          className="bg-brand hover:bg-brand-dark inline-flex min-h-10 items-center rounded-full px-3 text-xs font-semibold text-white transition-colors sm:px-4 sm:text-sm"
        >
          会員登録
        </Link>
      </div>
    );
  }

  return (
    <details className="group relative">
      <summary className="border-brand/15 hover:border-brand/30 flex cursor-pointer list-none items-center gap-2 rounded-full border bg-white py-1 pr-3 pl-1 shadow-sm transition-colors [&::-webkit-details-marker]:hidden">
        <UserAvatar name={user.fullName} />
        <span className="text-brand-dark hidden max-w-28 truncate text-sm font-semibold sm:block">
          {user.fullName}
        </span>
        <span
          className="text-muted-foreground text-xs transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>
      <div className="border-brand/10 absolute top-[calc(100%+0.65rem)] right-0 z-40 w-64 rounded-2xl border bg-white p-2 shadow-[0_24px_70px_-30px_rgba(24,45,32,0.5)]">
        <div className="border-brand/10 border-b px-3 py-3">
          <p className="text-foreground truncate text-sm font-semibold">
            {user.fullName}
          </p>
          <p className="text-muted-foreground mt-1 truncate text-xs">{user.email}</p>
        </div>
        <nav className="grid gap-1 py-2" aria-label="アカウントメニュー">
          <Link
            href="/account/profile"
            className="text-foreground hover:bg-brand-soft/45 rounded-xl px-3 py-2.5 text-sm transition-colors"
          >
            プロフィール
          </Link>
          <Link
            href="/account/orders"
            className="text-foreground hover:bg-brand-soft/45 rounded-xl px-3 py-2.5 text-sm transition-colors"
          >
            注文履歴
          </Link>
          <Link
            href="/account/wishlist"
            className="text-foreground hover:bg-brand-soft/45 rounded-xl px-3 py-2.5 text-sm transition-colors"
          >
            お気に入り
          </Link>
          <Link
            href={notificationHref}
            className="text-foreground hover:bg-brand-soft/45 rounded-xl px-3 py-2.5 text-sm transition-colors"
          >
            通知
          </Link>
          {isAdminRole(user.roleCode) ? (
            <Link
              href="/admin"
              className="text-brand-dark hover:bg-brand-soft/45 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
            >
              ダッシュボード
            </Link>
          ) : null}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="border-brand/10 w-full rounded-xl border-t px-3 py-2.5 text-left text-sm text-red-700 transition-colors hover:bg-red-50"
        >
          ログアウト
        </button>
      </div>
    </details>
  );
}
