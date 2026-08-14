import { RatingStars } from "./rating-stars";
import type { ProductReviewsResponse } from "../types/review";

export function ReviewSummary({ summary }: { summary: ProductReviewsResponse }) {
  return (
    <div className="grid gap-7 rounded-3xl border bg-white/70 p-6 sm:grid-cols-[180px_1fr] sm:p-7">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-brand-dark font-serif text-5xl font-semibold">
          {summary.averageRating.toFixed(1)}
        </p>
        <RatingStars className="mt-3" rating={summary.averageRating} />
        <p className="text-muted-foreground mt-2 text-xs">
          {summary.reviewCount}件のレビュー
        </p>
      </div>
      <div className="grid gap-2.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = summary.ratingSummary[rating as 1 | 2 | 3 | 4 | 5];
          const percentage = summary.reviewCount
            ? Math.round((count / summary.reviewCount) * 100)
            : 0;

          return (
            <div
              key={rating}
              className="grid grid-cols-[42px_1fr_34px] items-center gap-3 text-xs"
            >
              <span>{rating} ★</span>
              <span className="bg-brand-soft h-2 overflow-hidden rounded-full">
                <span
                  className="bg-accent block h-full rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </span>
              <span className="text-muted-foreground text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
