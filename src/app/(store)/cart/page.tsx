import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { CartPageContent } from "@/features/cart/components/cart-page-content";

export const metadata: Metadata = {
  title: "ショッピングカート",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="mb-9">
        <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
          Shopping cart
        </p>
        <h1 className="text-brand-dark mt-3 font-serif text-4xl sm:text-5xl">カート</h1>
      </div>
      <AuthGuard>
        <CartPageContent />
      </AuthGuard>
    </div>
  );
}
