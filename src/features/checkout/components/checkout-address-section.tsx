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
    <section className="border-brand/15 border-t pt-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="home-eyebrow">Step 01</p>
          <h2 className="text-brand-dark mt-4 font-serif text-2xl font-medium">
            お届け先
          </h2>
        </div>

        <Link
          href="/account/addresses?returnTo=/checkout"
          className="group text-brand-dark inline-flex items-center gap-2 text-sm font-semibold"
        >
          住所を追加・編集
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {addresses.length ? (
        <fieldset className="mt-7 grid gap-0">
          <legend className="sr-only">配送先を選択</legend>

          {addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;

            return (
              <label
                key={address.id}
                className={cn(
                  "border-brand/10 cursor-pointer border-b py-5 transition-colors focus-within:outline-none",
                  isSelected ? "bg-brand-soft/30" : "hover:bg-brand-soft/15",
                )}
              >
                <div className="flex items-start gap-4 px-3">
                  <input
                    type="radio"
                    name="checkout-address"
                    value={address.id}
                    checked={isSelected}
                    onChange={() => onSelect(address.id)}
                    className="accent-brand mt-1 size-4"
                  />

                  <span className="min-w-0 text-sm leading-7">
                    <span className="text-brand-dark flex flex-wrap items-center gap-2 font-semibold">
                      {address.label ?? address.recipientName}

                      {address.isDefault ? (
                        <span className="text-brand text-[10px] font-semibold tracking-[0.08em]">
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
        <div className="border-brand/10 mt-7 border-y py-8">
          <p className="text-brand-dark font-semibold">配送先がありません</p>
          <p className="text-muted-foreground mt-2 text-sm leading-7">
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
