import { formatDate } from "@/lib/format/date";

import { RatingStars } from "./rating-stars";
import type { PublicReview } from "../types/review";

export function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <article className="border-brand/10 border-b py-6 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <RatingStars rating={review.rating} />
          {review.title ? (
            <h3 className="text-foreground mt-2 font-semibold">{review.title}</h3>
          ) : null}
        </div>
        <time className="text-muted-foreground text-xs" dateTime={review.createdAt}>
          {formatDate(review.createdAt)}
        </time>
      </div>
      <p className="text-muted-foreground mt-4 text-sm leading-7 whitespace-pre-line">
        {review.comment}
      </p>
      <p className="text-muted-foreground mt-4 text-xs">
        {review.reviewer.fullName}{" "}
        <span className="ml-2 text-emerald-700">購入者レビュー</span>
      </p>
    </article>
  );
}
