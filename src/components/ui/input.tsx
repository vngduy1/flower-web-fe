import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, hint, id, label, required, ...props },
  ref,
) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="grid gap-2">
      {label ? (
        <label htmlFor={id} className="text-foreground text-sm font-semibold">
          {label}
          {required ? (
            <span className="text-accent ml-1" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={cn(
          "text-foreground placeholder:text-muted-foreground/70 focus:border-brand disabled:bg-surface-muted disabled:text-muted-foreground min-h-11 w-full rounded-xl border bg-white px-3.5 text-base shadow-sm transition-colors focus:outline-none disabled:cursor-not-allowed sm:text-sm",
          error && "border-red-500 focus:border-red-600",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-muted-foreground text-sm">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
