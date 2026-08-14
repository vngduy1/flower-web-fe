"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { UserAvatar } from "@/features/auth/components/user-avatar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLogoutRedirect } from "@/features/auth/hooks/use-logout-redirect";
import { ADMIN_ROLES } from "@/features/auth/utils/auth-routing";

function AdminShellContent({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const handleLogout = useLogoutRedirect("/login");
  const pathname = usePathname();
  const isProducts = pathname.startsWith("/admin/products");
  const isCategories = pathname.startsWith("/admin/categories");
  const isInventories = pathname.startsWith("/admin/inventories");
  const isOrders = pathname.startsWith("/admin/orders");
  const isCoupons = pathname.startsWith("/admin/coupons");
  const isUsers = pathname.startsWith("/admin/users");
  const isReviews = pathname.startsWith("/admin/reviews");
  const isDelivery = pathname.startsWith("/admin/delivery");

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f5f2] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-brand/10 bg-brand-dark border-b px-5 py-5 text-white lg:min-h-screen lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
        <div className="flex items-center justify-between lg:block">
          <Link href="/" className="inline-flex items-center gap-3 rounded-md">
            <span className="grid size-9 place-items-center rounded-full bg-white/10 font-serif">
              花
            </span>
            <span>
              <span className="block font-serif text-lg tracking-[0.14em]">花織</span>
              <span className="block text-[9px] tracking-[0.16em] text-white/70 uppercase">
                Administration
              </span>
            </span>
          </Link>
          <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white/65 uppercase lg:mt-10 lg:block lg:w-fit">
            {user.roleCode}
          </span>
        </div>
        <nav className="mt-6" aria-label="管理画面ナビゲーション">
          <Link
            href="/admin"
            aria-current={
              !isProducts &&
              !isCategories &&
              !isInventories &&
              !isOrders &&
              !isCoupons &&
              !isUsers &&
              !isReviews &&
              !isDelivery
                ? "page"
                : undefined
            }
            className={`block rounded-xl px-4 py-3 text-sm font-semibold ${!isProducts && !isCategories && !isInventories && !isOrders && !isCoupons && !isUsers && !isReviews && !isDelivery ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            ダッシュボード
          </Link>
          <Link
            href="/admin/products"
            aria-current={isProducts ? "page" : undefined}
            className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isProducts ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            商品管理
          </Link>
          <Link
            href="/admin/categories"
            aria-current={isCategories ? "page" : undefined}
            className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isCategories ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            カテゴリ管理
          </Link>
          <Link
            href="/admin/coupons"
            aria-current={isCoupons ? "page" : undefined}
            className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isCoupons ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            クーポン管理
          </Link>
          {user.roleCode === "ADMIN" ? (
            <>
              <Link
                href="/admin/inventories"
                aria-current={isInventories ? "page" : undefined}
                className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isInventories ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                在庫管理
              </Link>
              <Link
                href="/admin/orders"
                aria-current={isOrders ? "page" : undefined}
                className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isOrders ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                注文管理
              </Link>
              <Link
                href="/admin/users"
                aria-current={isUsers ? "page" : undefined}
                className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isUsers ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                ユーザー管理
              </Link>
              <Link
                href="/admin/reviews"
                aria-current={isReviews ? "page" : undefined}
                className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isReviews ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                レビュー管理
              </Link>
              <Link
                href="/admin/delivery"
                aria-current={isDelivery ? "page" : undefined}
                className={`mt-1 block rounded-xl px-4 py-3 text-sm font-semibold ${isDelivery ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                配送管理
              </Link>
            </>
          ) : null}
          <p className="mt-5 hidden px-4 text-xs leading-6 text-white/70 lg:block">
            このページは管理者のみご利用いただけます
          </p>
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="border-brand/10 flex min-h-18 items-center justify-between gap-4 border-b bg-white px-5 sm:px-8">
          <div>
            <p className="text-muted-foreground text-xs">管理画面</p>
            <p className="text-brand-dark font-semibold">
              {isDelivery
                ? "配送管理"
                : isReviews
                  ? "レビュー管理"
                  : isUsers
                    ? "ユーザー管理"
                    : isCoupons
                      ? "クーポン管理"
                      : isOrders
                        ? "注文管理"
                        : isInventories
                          ? "在庫管理"
                          : isProducts
                            ? "商品管理"
                            : isCategories
                              ? "カテゴリ管理"
                              : "ダッシュボード"}
            </p>
          </div>
          <details className="group relative">
            <summary className="border-brand/10 flex cursor-pointer list-none items-center gap-2 rounded-full border py-1 pr-3 pl-1 [&::-webkit-details-marker]:hidden">
              <UserAvatar name={user.fullName} />
              <span className="hidden max-w-36 truncate text-sm font-semibold sm:block">
                {user.fullName}
              </span>
              <span className="text-muted-foreground text-xs" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="border-brand/10 absolute top-[calc(100%+0.6rem)] right-0 z-30 w-56 rounded-2xl border bg-white p-2 shadow-xl">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold">{user.fullName}</p>
                <p className="text-muted-foreground mt-1 truncate text-xs">
                  {user.email}
                </p>
              </div>
              <Link
                href="/account/profile"
                className="hover:bg-brand-soft/45 block rounded-xl px-3 py-2.5 text-sm"
              >
                プロフィール
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-700 hover:bg-red-50"
              >
                ログアウト
              </button>
            </div>
          </details>
        </header>
        <main className="px-5 py-8 sm:px-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={ADMIN_ROLES}>
      <AdminShellContent>{children}</AdminShellContent>
    </AuthGuard>
  );
}
