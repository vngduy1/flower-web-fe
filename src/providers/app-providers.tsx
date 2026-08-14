import type { ReactNode } from "react";

import { AuthProvider } from "@/features/auth/components/auth-provider";

import { QueryProvider } from "./query-provider";
import { UnauthorizedRedirect } from "./unauthorized-redirect";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <UnauthorizedRedirect />
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
