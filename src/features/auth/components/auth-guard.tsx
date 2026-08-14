"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import type { RoleCode } from "../types/auth.types";
import { getLoginRoute } from "../utils/auth-routing";
import { AuthErrorState } from "./auth-error-state";
import { AuthLoading } from "./auth-loading";
import { useAuth } from "../hooks/use-auth";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: readonly RoleCode[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { error, isLoading, refreshUser, user } = useAuth();
  const hasRequiredRole =
    !allowedRoles || (user ? allowedRoles.includes(user.roleCode) : false);

  useEffect(() => {
    if (isLoading || error) {
      return;
    }

    if (!user) {
      const returnTo = `${pathname}${window.location.search}${window.location.hash}`;
      router.replace(getLoginRoute(returnTo));
      return;
    }

    if (!hasRequiredRole) {
      router.replace("/account?reason=forbidden");
    }
  }, [error, hasRequiredRole, isLoading, pathname, router, user]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (error) {
    return <AuthErrorState message={error.message} onRetry={refreshUser} />;
  }

  if (!user || !hasRequiredRole) {
    return <AuthLoading label="ページを移動しています" />;
  }

  return children;
}
