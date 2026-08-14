import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdminReview,
  AdminReviewListResponse,
  AdminReviewQuery,
  DeleteAdminReviewResponse,
  RejectAdminReviewRequest,
  RestoreAdminReviewResponse,
} from "../types/admin-review";

function getAdminReviewPath(id: string): string {
  return `/admin/reviews/${toApiPathSegment(id)}`;
}

export async function getAdminReviews(
  query: AdminReviewQuery,
): Promise<AdminReviewListResponse> {
  const response = await apiClient.get<AdminReviewListResponse>("/admin/reviews", {
    params: query,
  });

  return response.data;
}

export async function getAdminReview(id: string): Promise<AdminReview> {
  const response = await apiClient.get<AdminReview>(getAdminReviewPath(id));

  return response.data;
}

export async function approveAdminReview(id: string): Promise<AdminReview> {
  const response = await apiClient.patch<AdminReview>(
    `${getAdminReviewPath(id)}/approve`,
  );

  return response.data;
}

export async function rejectAdminReview(
  id: string,
  request: RejectAdminReviewRequest,
): Promise<AdminReview> {
  const response = await apiClient.patch<AdminReview>(
    `${getAdminReviewPath(id)}/reject`,
    request,
  );

  return response.data;
}

export async function deleteAdminReview(id: string): Promise<DeleteAdminReviewResponse> {
  const response = await apiClient.delete<DeleteAdminReviewResponse>(
    getAdminReviewPath(id),
  );

  return response.data;
}

export async function restoreAdminReview(
  id: string,
): Promise<RestoreAdminReviewResponse> {
  const response = await apiClient.patch<RestoreAdminReviewResponse>(
    `${getAdminReviewPath(id)}/restore`,
  );

  return response.data;
}
