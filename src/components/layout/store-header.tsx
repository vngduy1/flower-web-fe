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
  { href: "/guide", label: "ご利用ガイド" },
] as const;

export function StoreHeader() {
  return (
    <header className="border-brand/10 bg-background/95 sticky top-0 z-40 border-b backdrop-blur-xl">
      {/* Announcement */}
      <div className="bg-brand-dark text-white">
        <div className="mx-auto flex min-h-8 max-w-7xl items-center justify-center px-5">
          <p className="text-[10px] tracking-[0.16em] text-white/80 sm:text-[11px]">
            季節の花を、ていねいに束ねてお届けします
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto grid min-h-22 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <div className="justify-self-start">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-md"
            aria-label="花織 ホーム"
          >
            <span
              className="border-brand/20 bg-brand-soft text-brand-dark grid size-10 place-items-center rounded-full border font-serif text-lg transition duration-300 group-hover:-rotate-6 group-hover:scale-105"
              aria-hidden="true"
            >
              花
            </span>

            <span className="leading-none">
              <span className="text-brand-dark block font-serif text-[22px] font-semibold tracking-[0.18em]">
                花織
              </span>

              <span className="text-muted-foreground mt-1 block text-[8px] tracking-[0.24em] uppercase">
                Hanaori Flowers
              </span>
            </span>
          </Link>
        </div>

        {/* Main navigation */}
        <nav
          className="hidden items-center gap-9 md:flex"
          aria-label="メインナビゲーション"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group text-muted-foreground hover:text-brand-dark relative py-2 text-[13px] font-medium transition-colors"
            >
              {item.label}

              <span className="bg-brand absolute right-0 bottom-0 left-0 h-px origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Commerce / account */}
        <div className="flex items-center justify-self-end gap-1.5 sm:gap-2">
          <CommerceNavigation />
          <NotificationBadge />
          <AuthNavigation />
        </div>
      </div>

      {/* Category navigation */}
      <div className="border-brand/10 border-t bg-white/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Suspense fallback={<CategoryNavigation categories={[]} />}>
            <StoreCategoryNavigation />
          </Suspense>
        </div>
      </div>
    </header>
  );
}