import { cn } from "@/lib/utils/cn";

export function RatingStars({
  className,
  rating,
  showValue = false,
}: {
  className?: string;
  rating: number;
  showValue?: boolean;
}) {
  const roundedRating = Math.round(rating);

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="text-accent text-sm tracking-[0.14em]"
        aria-hidden="true"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            className={
              value <= roundedRating
                ? "text-accent"
                : "text-brand-dark/20"
            }
          >
            ★
          </span>
        ))}
      </span>

      {showValue ? (
        <span className="text-brand-dark text-xs font-semibold tabular-nums">
          {rating.toFixed(1)}
        </span>
      ) : null}

      <span className="sr-only">
        5点満点中{rating}点
      </span>
    </span>
  );
}