import type { OrderStatus } from "@/features/orders/types/order";
import type { ReviewStatus } from "@/features/reviews/types/review";

export type AdminReviewSortBy = "createdAt" | "updatedAt" | "rating" | "status";
export type AdminReviewSortOrder = "ASC" | "DESC";

export interface AdminReviewQuery {
  status?: ReviewStatus;
  keyword?: string;
  productId?: string;
  userId?: string;
  rating?: number;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: AdminReviewSortBy;
  sortOrder?: AdminReviewSortOrder;
  page?: number;
  limit?: number;
}

export interface AdminReview {
  id: string;
  product: {
    id: string;
    productCode: string;
    name: string;
    slug: string;
  } | null;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
  } | null;
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    deliveredAt: string | null;
  } | null;
  orderItemId: string;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  adminComment: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReviewListResponse {
  items: AdminReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RejectAdminReviewRequest {
  adminComment: string;
}

export interface DeleteAdminReviewResponse {
  message: string;
}

export interface RestoreAdminReviewResponse {
  message: string;
  review: AdminReview;
}

export type { ReviewStatus };
