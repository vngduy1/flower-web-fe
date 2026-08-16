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
    <section className="border-brand/15 border-t pt-8">
      <p className="home-eyebrow">Step 04</p>

      <label
        htmlFor="checkout-note"
        className="text-brand-dark mt-4 block font-serif text-2xl font-medium"
      >
        ご要望・備考
      </label>

      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-7">
        お届けに関するご希望などがございましたらご記入ください。
        1000文字まで入力できます。
      </p>

      <textarea
        id="checkout-note"
        rows={5}
        maxLength={1000}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className="border-brand/20 focus:border-brand mt-6 w-full resize-y border bg-transparent px-4 py-3 text-base leading-7 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-55 sm:text-sm"
        {...registration}
      />

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}