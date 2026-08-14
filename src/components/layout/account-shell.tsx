"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { UserAvatar } from "@/features/auth/components/user-avatar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils/cn";

const accountNavigation = [
  { href: "/account", label: "アカウント概要" },
  { href: "/account/profile", label: "プロフィール" },
  { href: "/account/addresses", label: "配送先" },
  { href: "/account/wishlist", label: "お気に入り" },
  { href: "/account/orders", label: "注文履歴" },
  { href: "/account/reviews", label: "レビュー履歴" },
  { href: "/account/notifications", label: "通知" },
] as const;

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[240px_1fr] lg:px-10 lg:py-14">
      <aside>
        <div className="border-brand/10 bg-surface rounded-3xl border p-5 shadow-sm">
          <div className="border-brand/10 flex items-center gap-3 border-b pb-5">
            <UserAvatar name={user.fullName} className="size-11" />
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">
                {user.fullName}
              </p>
              <p className="text-muted-foreground mt-1 truncate text-xs">{user.email}</p>
            </div>
          </div>
          <nav className="mt-4 grid gap-1" aria-label="アカウントナビゲーション">
            {accountNavigation.map((item) => {
              const isActive =
                item.href === "/account"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-brand-soft text-brand-dark font-semibold"
                      : "text-muted-foreground hover:bg-brand-soft/45 hover:text-brand-dark",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
