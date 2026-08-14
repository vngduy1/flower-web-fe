import { AccountShell } from "@/components/layout/account-shell";
import { StoreFooter } from "@/components/layout/store-footer";
import { StoreHeader } from "@/components/layout/store-header";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex flex-1">
        <AuthGuard>
          <AccountShell>{children}</AccountShell>
        </AuthGuard>
      </main>
      <StoreFooter />
    </div>
  );
}
