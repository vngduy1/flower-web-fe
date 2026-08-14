import { queryOptions } from "@tanstack/react-query";

import { getCategories } from "./categories.api";
import type { AdminCategoryQuery } from "../types/category";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (query: AdminCategoryQuery) => [...categoryKeys.lists(), query] as const,
};

export function categoriesQueryOptions(query: AdminCategoryQuery = {}) {
  return queryOptions({
    queryKey: categoryKeys.list(query),
    queryFn: () => getCategories(query),
    staleTime: 5 * 60_000,
  });
}
