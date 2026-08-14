import { queryOptions } from "@tanstack/react-query";

import { getAuthProfile } from "./auth.api";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export function authProfileQueryOptions() {
  return queryOptions({
    queryKey: authKeys.profile(),
    queryFn: getAuthProfile,
    staleTime: 60_000,
  });
}
