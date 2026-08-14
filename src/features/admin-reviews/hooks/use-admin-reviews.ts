"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { adminDashboardKeys } from "@/features/admin-dashboard/api/admin-dashboard.queries";
import { notificationKeys } from "@/features/notifications/api/notifications.queries";
import { reviewKeys } from "@/features/reviews/api/reviews.queries";

import {
  approveAdminReview,
  deleteAdminReview,
  rejectAdminReview,
  restoreAdminReview,
} from "../api/admin-reviews.api";
import {
  adminReviewKeys,
  adminReviewQueryOptions,
  adminReviewsQueryOptions,
} from "../api/admin-reviews.queries";
import type {
  AdminReview,
  AdminReviewQuery,
  RejectAdminReviewRequest,
} from "../types/admin-review";

export const useAdminReviews = (query: AdminReviewQuery) =>
  useQuery(adminReviewsQueryOptions(query));

export const useAdminReview = (id: string) => useQuery(adminReviewQueryOptions(id));

async function invalidateReviewSurfaces(queryClient: QueryClient, id?: string) {
  const invalidations = [
    queryClient.invalidateQueries({ queryKey: adminReviewKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
    queryClient.invalidateQueries({ queryKey: adminDashboardKeys.summary() }),
    queryClient.invalidateQueries({
      queryKey: [...adminDashboardKeys.all, "top-products"],
    }),
  ];

  if (id) {
    invalidations.push(
      queryClient.invalidateQueries({ queryKey: adminReviewKeys.detail(id) }),
    );
  }

  await Promise.all(invalidations);
}

async function invalidateModerationNotifications(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    queryClient.invalidateQueries({
      queryKey: [...adminDashboardKeys.all, "recent-notifications"],
    }),
  ]);
}

function updateReviewDetail(queryClient: QueryClient, id: string, review: AdminReview) {
  queryClient.setQueryData(adminReviewKeys.detail(id), review);
}

export function useApproveAdminReview(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveAdminReview(id),
    onSuccess: async (review) => {
      updateReviewDetail(queryClient, id, review);
      await Promise.all([
        invalidateReviewSurfaces(queryClient, id),
        invalidateModerationNotifications(queryClient),
      ]);
    },
  });
}

export function useRejectAdminReview(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RejectAdminReviewRequest) => rejectAdminReview(id, request),
    onSuccess: async (review) => {
      updateReviewDetail(queryClient, id, review);
      await Promise.all([
        invalidateReviewSurfaces(queryClient, id),
        invalidateModerationNotifications(queryClient),
      ]);
    },
  });
}

export function useDeleteAdminReview(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAdminReview(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: adminReviewKeys.detail(id) });
      await invalidateReviewSurfaces(queryClient);
    },
  });
}

export function useRestoreAdminReview(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => restoreAdminReview(id),
    onSuccess: async ({ review }) => {
      updateReviewDetail(queryClient, review.id, review);
      await invalidateReviewSurfaces(queryClient, review.id);
    },
  });
}
