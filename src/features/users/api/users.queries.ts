import { queryOptions } from "@tanstack/react-query";

import { getCurrentUser } from "./users.api";

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: userKeys.me(),
    queryFn: getCurrentUser,
    staleTime: 60_000,
  });
}
