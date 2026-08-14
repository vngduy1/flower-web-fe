import { cn } from "@/lib/utils/cn";

interface RatingInputProps {
  disabled?: boolean;
  error?: string;
  id: string;
  onChange: (rating: number) => void;
  value: number;
}

export function RatingInput({ disabled, error, id, onChange, value }: RatingInputProps) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="text-sm font-semibold">
        評価<span className="text-accent ml-1">*</span>
      </legend>
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label="評価">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating}点`}
            disabled={disabled}
            onClick={() => onChange(rating)}
            className={cn(
              "rounded-lg px-1.5 py-1 text-3xl leading-none text-amber-400 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50",
              rating <= value ? "opacity-100" : "opacity-35 grayscale",
            )}
          >
            ★
          </button>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
