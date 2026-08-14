import { Alert } from "@/components/ui";
import { formatDateTime } from "@/lib/format/date";

import { RatingStars } from "./rating-stars";
import { ReviewStatusBadge } from "./review-status-badge";
import type { MyReview } from "../types/review";

export function MyReviewStatusCard({ review }: { review: MyReview }) {
  return (
    <article className="rounded-2xl border bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <RatingStars rating={review.rating} />
          {review.title ? <h4 className="mt-2 font-semibold">{review.title}</h4> : null}
        </div>
        <ReviewStatusBadge status={review.status} />
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-7 whitespace-pre-line">
        {review.comment}
      </p>
      <p className="text-muted-foreground mt-3 text-xs">
        送信日時 {formatDateTime(review.createdAt)}
      </p>
      {review.status === "REJECTED" && review.adminComment ? (
        <Alert className="mt-4" variant="error" title="管理者コメント">
          {review.adminComment}
        </Alert>
      ) : null}
    </article>
  );
}
