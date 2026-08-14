import Link from "next/link";

import type { Address } from "@/features/addresses/types/address";
import { cn } from "@/lib/utils/cn";

interface CheckoutAddressSectionProps {
  addresses: Address[];
  error?: string;
  onSelect: (addressId: string) => void;
  selectedAddressId: string;
}

export function CheckoutAddressSection({
  addresses,
  error,
  onSelect,
  selectedAddressId,
}: CheckoutAddressSectionProps) {
  return (
    <section className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-accent text-xs font-bold tracking-[0.15em] uppercase">
            Step 1
          </p>
          <h2 className="text-brand-dark mt-2 font-serif text-2xl font-semibold">
            配送先
          </h2>
        </div>
        <Link
          href="/account/addresses?returnTo=/checkout"
          className="border-brand/25 text-brand-dark hover:bg-brand-soft/45 inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold"
        >
          住所を追加・編集
        </Link>
      </div>

      {addresses.length ? (
        <fieldset className="mt-6 grid gap-3">
          <legend className="sr-only">配送先を選択</legend>
          {addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;

            return (
              <label
                key={address.id}
                className={cn(
                  "focus-within:ring-brand cursor-pointer rounded-2xl border p-4 transition-colors focus-within:ring-2",
                  isSelected
                    ? "border-brand bg-brand-soft/45"
                    : "hover:border-brand/35 bg-white",
                )}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="checkout-address"
                    value={address.id}
                    checked={isSelected}
                    onChange={() => onSelect(address.id)}
                    className="accent-brand mt-1 size-4"
                  />
                  <span className="min-w-0 text-sm leading-6">
                    <span className="flex flex-wrap items-center gap-2 font-semibold">
                      {address.label ?? address.recipientName}
                      {address.isDefault ? (
                        <span className="bg-brand-soft text-brand-dark rounded-full px-2 py-0.5 text-[10px]">
                          標準
                        </span>
                      ) : null}
                    </span>
                    <span className="text-muted-foreground mt-1 block">
                      〒{address.postalCode} {address.prefecture}
                      {address.city}
                      {address.addressLine1}
                      {address.addressLine2 ? ` ${address.addressLine2}` : ""}
                    </span>
                    <span className="text-muted-foreground block">
                      {address.recipientName} / {address.recipientPhone}
                    </span>
                  </span>
                </div>
              </label>
            );
          })}
        </fieldset>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed p-5 text-sm">
          <p className="font-semibold">配送先がありません</p>
          <p className="text-muted-foreground mt-2 leading-6">
            注文を続けるには配送先を登録してください。
          </p>
        </div>
      )}

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
