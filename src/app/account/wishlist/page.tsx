import type { Metadata } from "next";

import { WishlistPageContent } from "@/features/wishlist/components/wishlist-page-content";

export const metadata: Metadata = {
  title: "お気に入り",
  description: "保存したお気に入り商品を確認できます。",
};

export default function WishlistPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
          Wishlist
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold sm:text-4xl">
          お気に入り
        </h1>
      </div>
      <WishlistPageContent />
    </section>
  );
}
