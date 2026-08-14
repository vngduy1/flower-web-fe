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
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="tracking-[0.12em] text-amber-500" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((value) => (value <= roundedRating ? "★" : "☆"))}
      </span>
      {showValue ? (
        <span className="text-foreground font-semibold">{rating.toFixed(1)}</span>
      ) : null}
      <span className="sr-only">5点満点中{rating}点</span>
    </span>
  );
}
