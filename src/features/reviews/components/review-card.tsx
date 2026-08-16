import { formatDate } from "@/lib/format/date";

import { RatingStars } from "./rating-stars";
import type { PublicReview } from "../types/review";

export function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <article>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <RatingStars rating={review.rating} />

          {review.title ? (
            <h3 className="mt-3 font-serif text-lg font-medium text-brand-dark">
              {review.title}
            </h3>
          ) : null}
        </div>

        <time
          className="text-[10px] tracking-[0.06em] text-muted-foreground"
          dateTime={review.createdAt}
        >
          {formatDate(review.createdAt)}
        </time>
      </div>

      <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground whitespace-pre-line">
        {review.comment}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted-foreground">
          {review.reviewer.fullName}
        </span>

        <span
          className="h-3 w-px bg-brand/15"
          aria-hidden="true"
        />

        <span className="text-[10px] font-semibold tracking-[0.08em] text-brand">
          購入者レビュー
        </span>
      </div>
    </article>
  );
}