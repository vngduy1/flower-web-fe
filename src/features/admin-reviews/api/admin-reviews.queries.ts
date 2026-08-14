import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getAdminReview, getAdminReviews } from "./admin-reviews.api";
import type { AdminReviewQuery } from "../types/admin-review";

export const adminReviewKeys = {
  all: ["admin-reviews"] as const,
  lists: () => [...adminReviewKeys.all, "list"] as const,
  list: (query: AdminReviewQuery) => [...adminReviewKeys.lists(), query] as const,
  details: () => [...adminReviewKeys.all, "detail"] as const,
  detail: (id: string) => [...adminReviewKeys.details(), id] as const,
};

export const adminReviewsQueryOptions = (query: AdminReviewQuery) =>
  queryOptions({
    queryKey: adminReviewKeys.list(query),
    queryFn: () => getAdminReviews(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const adminReviewQueryOptions = (id: string) =>
  queryOptions({
    queryKey: adminReviewKeys.detail(id),
    queryFn: () => getAdminReview(id),
    staleTime: 15_000,
  });
