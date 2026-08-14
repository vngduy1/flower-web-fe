import Link from "next/link";
import { Suspense } from "react";

import { AuthNavigation } from "@/features/auth/components/auth-navigation";
import { CommerceNavigation } from "@/features/cart/components/commerce-navigation";
import { CategoryNavigation } from "@/features/categories/components/category-navigation";
import { StoreCategoryNavigation } from "@/features/categories/components/store-category-navigation";
import { NotificationBadge } from "@/features/notifications/components/notification-badge";

const navigationItems = [
  { href: "/products", label: "商品を探す" },
  { href: "/#story", label: "花織について" },
  { href: "/#promise", label: "私たちの約束" },
  { href: "/#guide", label: "ご利用案内" },
] as const;

export function StoreHeader() {
  return (
    <header className="border-brand/10 bg-background/95 relative z-20 border-b backdrop-blur">
      <div className="bg-brand px-4 py-2 text-center text-xs tracking-[0.08em] text-white/90">
        季節の花を、ていねいに束ねてお届けします
      </div>
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-md"
          aria-label="花織 ホーム"
        >
          <span
            className="border-brand/20 bg-brand-soft text-brand grid size-9 place-items-center rounded-full border font-serif text-lg transition-transform group-hover:-rotate-6"
            aria-hidden="true"
          >
            花
          </span>
          <span>
            <span className="text-brand-dark block font-serif text-xl font-semibold tracking-[0.16em]">
              花織
            </span>
            <span className="text-muted-foreground block text-[9px] tracking-[0.18em] uppercase">
              Hanaori flowers
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="メインナビゲーション"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-brand-dark text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <CommerceNavigation />
          <NotificationBadge />
          <AuthNavigation />
        </div>
      </div>
      <Suspense fallback={<CategoryNavigation categories={[]} />}>
        <StoreCategoryNavigation />
      </Suspense>
    </header>
  );
}
