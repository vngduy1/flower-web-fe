import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { firstSearchParam } from "@/lib/utils/search-params";

export const metadata: Metadata = {
  title: "メールアドレスの確認",
};

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  const params = await searchParams;

  const email = firstSearchParam(params.email);

  if (!email) {
    redirect("/register");
  }

  return <VerifyEmailForm email={email} />;
}
