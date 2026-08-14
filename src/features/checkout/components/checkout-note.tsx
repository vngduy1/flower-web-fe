import type { UseFormRegisterReturn } from "react-hook-form";

interface CheckoutNoteProps {
  disabled?: boolean;
  error?: string;
  registration: UseFormRegisterReturn<"note">;
}

export function CheckoutNote({
  disabled = false,
  error,
  registration,
}: CheckoutNoteProps) {
  return (
    <section className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-7">
      <label
        htmlFor="checkout-note"
        className="text-brand-dark font-serif text-2xl font-semibold"
      >
        ご要望・備考
      </label>
      <p className="text-muted-foreground mt-2 text-sm">上限は1000文字までです。</p>
      <textarea
        id="checkout-note"
        rows={5}
        maxLength={1000}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className="focus:border-brand mt-5 w-full resize-y rounded-2xl border bg-white px-4 py-3 text-base leading-7 focus:outline-none disabled:cursor-not-allowed disabled:opacity-55 sm:text-sm"
        {...registration}
      />
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
