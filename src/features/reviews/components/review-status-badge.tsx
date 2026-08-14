import { cn } from "@/lib/utils/cn";

import type { ReviewStatus } from "../types/review";

const labels: Record<ReviewStatus, string> = {
  PENDING: "審査中",
  APPROVED: "公開済み",
  REJECTED: "非承認",
};

const classes: Record<ReviewStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REJECTED: "border-red-200 bg-red-50 text-red-800",
};

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        classes[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
