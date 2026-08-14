import { queryOptions } from "@tanstack/react-query";

import { getAddresses } from "./addresses.api";

export const addressKeys = {
  all: ["addresses"] as const,
  list: () => [...addressKeys.all, "list"] as const,
};

export function addressesQueryOptions() {
  return queryOptions({
    queryKey: addressKeys.list(),
    queryFn: getAddresses,
    staleTime: 30_000,
  });
}
