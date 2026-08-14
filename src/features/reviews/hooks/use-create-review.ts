"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationKeys } from "@/features/notifications/api/notifications.queries";

import { createReview } from "../api/reviews.api";
import { reviewKeys } from "../api/reviews.queries";
import type { MyReview } from "../types/review";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: async (review) => {
      queryClient.setQueryData<MyReview[]>(reviewKeys.my(), (current) => {
        if (!current) {
          return [review];
        }

        const remaining = current.filter((item) => item.id !== review.id);

        return [review, ...remaining];
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reviewKeys.my() }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() }),
      ]);
    },
  });
}
