import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  CreateReviewRequest,
  MyReview,
  ProductReviewsResponse,
} from "../types/review";

export async function getProductReviews(
  productId: string,
): Promise<ProductReviewsResponse> {
  const response = await apiClient.get<ProductReviewsResponse>(
    `/products/${toApiPathSegment(productId)}/reviews`,
  );

  return response.data;
}

export async function getMyReviews(): Promise<MyReview[]> {
  const response = await apiClient.get<MyReview[]>("/reviews/my");

  return response.data;
}

export async function createReview(request: CreateReviewRequest): Promise<MyReview> {
  const response = await apiClient.post<MyReview>("/reviews", request);

  return response.data;
}
