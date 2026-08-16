import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { CheckoutPageContent } from "@/features/checkout/components/checkout-page-content";

export const metadata: Metadata = {
  title: "チェックアウト",
  description: "配送先、配送日時、クーポンを確認して注文を作成します。",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
      <AuthGuard>
        <section>
          <header className="mb-12 border-b border-brand/15 pb-8 sm:mb-14 sm:pb-10">
            <p className="home-eyebrow">
              Secure checkout
            </p>

            <div className="hanaori-rule mt-5" />

            <h1 className="mt-7 font-serif text-4xl text-brand-dark sm:text-5xl">
              ご注文手続き
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground">
              お届け先と配送日時をご確認のうえ、ご注文内容を確定してください。
            </p>
          </header>

          <CheckoutPageContent />
        </section>
      </AuthGuard>
    </div>
  );
}