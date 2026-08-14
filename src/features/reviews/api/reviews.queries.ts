import { queryOptions } from "@tanstack/react-query";

import { getMyReviews, getProductReviews } from "./reviews.api";

export const reviewKeys = {
  all: ["reviews"] as const,
  products: () => [...reviewKeys.all, "product"] as const,
  product: (productId: string) => [...reviewKeys.products(), productId] as const,
  my: () => [...reviewKeys.all, "my"] as const,
};

export function productReviewsQueryOptions(productId: string) {
  return queryOptions({
    queryKey: reviewKeys.product(productId),
    queryFn: () => getProductReviews(productId),
    staleTime: 60_000,
  });
}

export function myReviewsQueryOptions() {
  return queryOptions({
    queryKey: reviewKeys.my(),
    queryFn: getMyReviews,
    staleTime: 15_000,
  });
}
