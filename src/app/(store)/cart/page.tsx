import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { CartPageContent } from "@/features/cart/components/cart-page-content";

export const metadata: Metadata = {
  title: "ショッピングカート",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
      <div className="mb-12 border-b border-brand/15 pb-8 sm:mb-14 sm:pb-10">
        <p className="home-eyebrow">Shopping cart</p>

        <div className="hanaori-rule mt-5" />

        <h1 className="mt-7 font-serif text-4xl text-brand-dark sm:text-5xl">
          カート
        </h1>
      </div>

      <AuthGuard>
        <CartPageContent />
      </AuthGuard>
    </div>
  );
}