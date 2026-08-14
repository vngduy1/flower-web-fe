import type { Metadata } from "next";
import Link from "next/link";

import { AddressesPageContent } from "@/features/addresses/components/addresses-page-content";

export const metadata: Metadata = {
  title: "配送先",
  description: "注文で使用する配送先を管理します。",
};

export default function AddressesPage() {
  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
            Delivery addresses
          </p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold sm:text-4xl">
            配送先
          </h1>
        </div>
        <Link
          href="/checkout"
          className="border-brand/25 text-brand-dark hover:bg-brand-soft/45 inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold"
        >
          チェックアウトへ戻る
        </Link>
      </div>
      <AddressesPageContent />
    </section>
  );
}
