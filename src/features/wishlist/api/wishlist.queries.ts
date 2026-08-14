import { queryOptions } from "@tanstack/react-query";

import { getWishlist } from "./wishlist.api";

export const wishlistKeys = {
  all: ["wishlist"] as const,
  list: () => [...wishlistKeys.all, "list"] as const,
};

export function wishlistQueryOptions() {
  return queryOptions({
    queryKey: wishlistKeys.list(),
    queryFn: getWishlist,
    staleTime: 30_000,
  });
}
