import { RatingStars } from "./rating-stars";
import type { ProductReviewsResponse } from "../types/review";

export function ReviewSummary({
  summary,
}: {
  summary: ProductReviewsResponse;
}) {
  return (
    <div className="grid gap-10 border-y border-brand/15 py-8 sm:grid-cols-[180px_1fr] sm:items-center sm:py-10">
      {/* Average rating */}
      <div className="sm:border-r sm:border-brand/10 sm:pr-8">
        <p className="font-serif text-5xl font-medium text-brand-dark">
          {summary.averageRating.toFixed(1)}
        </p>

        <RatingStars
          className="mt-3"
          rating={summary.averageRating}
        />

        <p className="mt-3 text-xs text-muted-foreground">
          {summary.reviewCount}件のレビュー
        </p>
      </div>

      {/* Distribution */}
      <div className="grid gap-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            summary.ratingSummary[rating as 1 | 2 | 3 | 4 | 5];

          const percentage = summary.reviewCount
            ? Math.round((count / summary.reviewCount) * 100)
            : 0;

          return (
            <div
              key={rating}
              className="grid grid-cols-[38px_1fr_34px] items-center gap-3 text-xs"
            >
              <span className="text-brand-dark">
                {rating}
                <span className="ml-1 text-accent">★</span>
              </span>

              <div className="h-px bg-brand/15">
                <div
                  className="h-px bg-accent"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="text-right text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}