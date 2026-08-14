import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { CheckoutPageContent } from "@/features/checkout/components/checkout-page-content";

export const metadata: Metadata = {
  title: "チェックアウト",
  description: "配送先、配送日時、クーポンを確認して注文を作成します。",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <AuthGuard>
        <section>
          <div className="mb-8">
            <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
              Secure checkout
            </p>
            <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold sm:text-4xl">
              チェックアウト
            </h1>
          </div>
          <CheckoutPageContent />
        </section>
      </AuthGuard>
    </div>
  );
}
