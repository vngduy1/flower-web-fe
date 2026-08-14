"use client";

import { useQuery } from "@tanstack/react-query";

import { productReviewsQueryOptions } from "../api/reviews.queries";

export function useProductReviews(productId: string) {
  return useQuery(productReviewsQueryOptions(productId));
}
