import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";
import { firstSearchParam } from "@/lib/utils/search-params";

export const metadata: Metadata = {
  title: "ログイン",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;

  return (
    <LoginForm
      defaultEmail={firstSearchParam(params.email)}
      verified={firstSearchParam(params.verified) === "1"}
      returnTo={firstSearchParam(params.returnTo)}
      sessionExpired={firstSearchParam(params.reason) === "session-expired"}
    />
  );
}
