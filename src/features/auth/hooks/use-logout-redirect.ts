"use client";

import { useCallback } from "react";

import { useAuth } from "./use-auth";

type LogoutDestination = "/" | "/login";

export function useLogoutRedirect(destination: LogoutDestination) {
  const { logout } = useAuth();

  return useCallback(() => {
    logout();
    window.location.replace(destination);
  }, [destination, logout]);
}
