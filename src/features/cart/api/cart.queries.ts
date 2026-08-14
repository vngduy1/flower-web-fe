import { queryOptions } from "@tanstack/react-query";

import { getCart } from "./cart.api";

export const cartKeys = {
  all: ["cart"] as const,
  current: () => [...cartKeys.all, "current"] as const,
};

export function cartQueryOptions() {
  return queryOptions({
    queryKey: cartKeys.current(),
    queryFn: getCart,
    staleTime: 30_000,
  });
}
