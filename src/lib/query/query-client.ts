import { QueryClient } from "@tanstack/react-query";

import { normalizeApiError } from "@/lib/api/errors";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const normalizedError = normalizeApiError(error);

          if (
            normalizedError.statusCode !== null &&
            normalizedError.statusCode >= 400 &&
            normalizedError.statusCode < 500
          ) {
            return false;
          }

          return failureCount < 1;
        },
      },
      mutations: {
        gcTime: 30_000,
        retry: false,
      },
    },
  });
}
