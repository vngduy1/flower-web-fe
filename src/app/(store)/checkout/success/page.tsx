import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { OrderSuccessContent } from "@/features/orders/components/order-success-content";

export const metadata: Metadata = {
  title: "注文完了",
  description: "作成された注文と開発用モック支払いを確認します。",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <AuthGuard>
        <Suspense fallback={<Skeleton className="h-[560px] rounded-3xl" />}>
          <OrderSuccessContent />
        </Suspense>
      </AuthGuard>
    </div>
  );
}
