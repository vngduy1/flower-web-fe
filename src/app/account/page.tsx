import type { Metadata } from "next";

import { AccountOverview } from "@/features/users/components/account-overview";
import { firstSearchParam } from "@/lib/utils/search-params";

export const metadata: Metadata = {
  title: "マイアカウント",
};

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const params = await searchParams;

  return <AccountOverview forbidden={firstSearchParam(params.reason) === "forbidden"} />;
}
