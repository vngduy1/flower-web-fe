import type {
  AdminReviewQuery,
  AdminReviewSortBy,
  ReviewStatus,
} from "../types/admin-review";

export const REVIEW_STATUSES: ReviewStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: "審査中",
  APPROVED: "公開済み",
  REJECTED: "非承認",
};

export const ADMIN_REVIEW_SORT_FIELDS: AdminReviewSortBy[] = [
  "createdAt",
  "updatedAt",
  "rating",
  "status",
];

export const ADMIN_REVIEW_SORT_LABELS: Record<AdminReviewSortBy, string> = {
  createdAt: "作成日時",
  updatedAt: "更新日時",
  rating: "評価",
  status: "審査状態",
};

function parseDate(value: string | null): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
    ? value
    : undefined;
}

export function parseAdminReviewId(value: string | null): string | null {
  return value && /^\d+$/.test(value) ? value : null;
}

export function parseAdminReviewQuery(params: URLSearchParams): AdminReviewQuery {
  const page = Number(params.get("page"));
  const rating = Number(params.get("rating"));
  const status = params.get("status");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");

  return {
    status: REVIEW_STATUSES.find((value) => value === status),
    keyword: params.get("keyword")?.trim() || undefined,
    productId: params.get("productId")?.trim() || undefined,
    userId: params.get("userId")?.trim() || undefined,
    rating:
      Number.isSafeInteger(rating) && rating >= 1 && rating <= 5 ? rating : undefined,
    createdFrom: parseDate(params.get("createdFrom")),
    createdTo: parseDate(params.get("createdTo")),
    sortBy: ADMIN_REVIEW_SORT_FIELDS.find((value) => value === sortBy),
    sortOrder: sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : undefined,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: 20,
  };
}
