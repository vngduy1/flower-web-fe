import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import { buildCatalogHref, type CatalogSearchState } from "../utils/catalog-search";
import type { ProductPagination } from "../types/product";

interface CatalogPaginationProps {
  pagination: ProductPagination;
  pathname: string;
  state: CatalogSearchState;
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);

  return Array.from(
    { length: Math.max(lastPage - firstPage + 1, 0) },
    (_, index) => firstPage + index,
  );
}

export function CatalogPagination({
  pagination,
  pathname,
  state,
}: CatalogPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(pagination.page, pagination.totalPages);
  const linkClassName =
    "border-brand/15 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border bg-white px-3 text-sm font-semibold transition-colors hover:border-brand/35 hover:bg-brand-soft/45";

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="商品ページ"
    >
      {pagination.page > 1 ? (
        <Link
          href={buildCatalogHref(pathname, {
            ...state,
            page: pagination.page - 1,
          })}
          className={linkClassName}
        >
          前へ
        </Link>
      ) : null}

      {pages.map((page) => {
        const isCurrent = page === pagination.page;

        return (
          <Link
            key={page}
            href={buildCatalogHref(pathname, { ...state, page })}
            className={cn(
              linkClassName,
              isCurrent && "bg-brand border-brand hover:bg-brand-dark text-white",
            )}
            aria-current={isCurrent ? "page" : undefined}
          >
            {page}
          </Link>
        );
      })}

      {pagination.page < pagination.totalPages ? (
        <Link
          href={buildCatalogHref(pathname, {
            ...state,
            page: pagination.page + 1,
          })}
          className={linkClassName}
        >
          次へ
        </Link>
      ) : null}
    </nav>
  );
}
