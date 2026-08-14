"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AUTH_UNAUTHORIZED_EVENT } from "@/lib/auth/events";
import { getLoginRoute } from "@/features/auth/utils/auth-routing";

export function UnauthorizedRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectToLogin = () => {
      const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      router.replace(getLoginRoute(returnTo, "session-expired"));
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, redirectToLogin);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, redirectToLogin);
    };
  }, [router]);

  return null;
}
