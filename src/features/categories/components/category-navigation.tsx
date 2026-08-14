import Link from "next/link";

import type { Category } from "../types/category";

export function CategoryNavigation({ categories }: { categories: Category[] }) {
  return (
    <div className="border-brand/10 border-t">
      <nav
        className="mx-auto hidden min-h-12 max-w-7xl items-center gap-7 overflow-x-auto px-5 sm:px-8 md:flex lg:px-10"
        aria-label="商品カテゴリ"
      >
        <Link
          href="/products"
          className="text-brand-dark shrink-0 text-xs font-bold tracking-[0.08em]"
        >
          すべての商品
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="text-muted-foreground hover:text-brand-dark shrink-0 text-xs font-medium transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <details className="group md:hidden">
        <summary className="text-brand-dark mx-auto flex min-h-12 max-w-7xl cursor-pointer list-none items-center justify-between px-5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          商品カテゴリ
          <span className="transition-transform group-open:rotate-180" aria-hidden="true">
            ▾
          </span>
        </summary>
        <nav
          className="border-brand/10 bg-surface grid gap-1 border-t px-5 py-3"
          aria-label="モバイル商品カテゴリ"
        >
          <Link href="/products" className="rounded-xl px-3 py-2.5 text-sm font-semibold">
            すべての商品
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="text-muted-foreground hover:bg-brand-soft/45 rounded-xl px-3 py-2.5 text-sm"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </details>
    </div>
  );
}
