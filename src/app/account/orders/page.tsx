import type { Metadata } from "next";

import { OrdersPageContent } from "@/features/orders/components/orders-page-content";

export const metadata: Metadata = {
  title: "注文履歴",
  description: "これまでの注文と配送・支払い状況を確認します。",
};

export default function OrdersPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
          Order history
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold sm:text-4xl">
          注文履歴
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-7">
          注文内容、配送予定、現在の支払い状況をご確認いただけます。
        </p>
      </div>
      <OrdersPageContent />
    </section>
  );
}
