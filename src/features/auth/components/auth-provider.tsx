"use client";

import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { authProfileQueryOptions } from "@/features/auth/api/auth.queries";
import type { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { normalizeApiError } from "@/lib/api/errors";
import {
  clearAuthSession,
  getAccessToken,
  setAccessToken,
  subscribeAuthSession,
} from "@/lib/auth/token-storage";
import type { ApiError } from "@/types/api";

interface AuthContextValue {
  user: AuthenticatedUser | null;
  error: ApiError | null;
  isLoading: boolean;
  establishSession: (accessToken: string) => Promise<AuthenticatedUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function removeSessionQueries(queryClient: QueryClient): void {
  queryClient.removeQueries();
}

function clearSessionCache(queryClient: QueryClient): void {
  queryClient.clear();
}

function subscribeToHydration(): () => void {
  return () => undefined;
}

function getServerAccessTokenSnapshot(): null {
  return null;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const isStorageReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const subscribeToAccessToken = useCallback(
    (listener: () => void) =>
      subscribeAuthSession(() => {
        clearSessionCache(queryClient);
        listener();
      }),
    [queryClient],
  );
  const accessToken = useSyncExternalStore(
    subscribeToAccessToken,
    getAccessToken,
    getServerAccessTokenSnapshot,
  );
  const hasAccessToken = Boolean(accessToken);

  const {
    data: profile,
    error: profileError,
    isFetching: isProfileFetching,
    isPending: isProfilePending,
    refetch: refetchProfile,
  } = useQuery({
    ...authProfileQueryOptions(),
    enabled: isStorageReady && hasAccessToken,
  });

  const user = hasAccessToken ? (profile ?? null) : null;
  const error = profileError ? normalizeApiError(profileError) : null;
  const isLoading =
    !isStorageReady ||
    (hasAccessToken && isProfilePending) ||
    (hasAccessToken && !user && isProfileFetching);

  const establishSession = useCallback(
    async (accessToken: string): Promise<AuthenticatedUser> => {
      removeSessionQueries(queryClient);
      setAccessToken(accessToken);

      try {
        return await queryClient.fetchQuery({
          ...authProfileQueryOptions(),
          staleTime: 0,
        });
      } catch (sessionError) {
        clearAuthSession();
        throw sessionError;
      }
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    clearSessionCache(queryClient);
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    if (!hasAccessToken) {
      return;
    }

    await refetchProfile();
  }, [hasAccessToken, refetchProfile]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      error,
      isLoading,
      establishSession,
      logout,
      refreshUser,
    }),
    [error, establishSession, isLoading, logout, refreshUser, user],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
