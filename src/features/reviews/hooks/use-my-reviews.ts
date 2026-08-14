"use client";

import { useQuery } from "@tanstack/react-query";

import { myReviewsQueryOptions } from "../api/reviews.queries";

export function useMyReviews(enabled = true) {
  return useQuery({ ...myReviewsQueryOptions(), enabled });
}
