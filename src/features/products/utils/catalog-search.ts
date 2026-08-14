import { firstSearchParam } from "@/lib/utils/search-params";

export const CATALOG_PAGE_SIZE = 12;

export type CatalogSort = "newest";

export interface CatalogSearchState {
  keyword: string;
  category: string;
  sort: CatalogSort;
  page: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

function parsePage(value: string | undefined): number {
  if (!value || !/^\d+$/.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}

export function parseCatalogSearchParams(params: SearchParams): CatalogSearchState {
  return {
    keyword: firstSearchParam(params.keyword)?.trim() ?? "",
    category: firstSearchParam(params.category)?.trim() ?? "",
    sort: "newest",
    page: parsePage(firstSearchParam(params.page)),
  };
}

export function buildCatalogHref(pathname: string, state: CatalogSearchState): string {
  const params = new URLSearchParams();

  if (state.keyword) {
    params.set("keyword", state.keyword);
  }

  if (state.category) {
    params.set("category", state.category);
  }

  params.set("sort", state.sort);

  if (state.page > 1) {
    params.set("page", String(state.page));
  }

  return `${pathname}?${params.toString()}`;
}
