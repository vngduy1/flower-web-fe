"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { getDefaultAuthenticatedRoute } from "../utils/auth-routing";
import { useAuth } from "../hooks/use-auth";
import { AuthErrorState } from "./auth-error-state";
import { AuthLoading } from "./auth-loading";

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { error, isLoading, refreshUser, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !error && user) {
      router.replace(getDefaultAuthenticatedRoute(user.roleCode));
    }
  }, [error, isLoading, router, user]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (error) {
    return <AuthErrorState message={error.message} onRetry={refreshUser} />;
  }

  if (user) {
    return <AuthLoading label="ページを移動しています" />;
  }

  return children;
}
