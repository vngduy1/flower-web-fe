import { WishlistItemCard } from "./wishlist-item-card";
import type { WishlistItem } from "../types/wishlist";

export function WishlistGrid({ items }: { items: WishlistItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <WishlistItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
