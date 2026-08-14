export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PublicReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  reviewer: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRatingSummary {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ProductReviewsResponse {
  productId: string;
  reviewCount: number;
  averageRating: number;
  ratingSummary: ReviewRatingSummary;
  items: PublicReview[];
}

export interface MyReview {
  id: string;
  product: {
    id: string;
    productCode: string;
    name: string;
    slug: string;
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

export interface CreateReviewRequest {
  orderItemId: string;
  rating: number;
  title?: string;
  comment: string;
}
