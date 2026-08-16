import { BackToTop } from "@/components/layout/back-to-top";
import { StoreFooter } from "@/components/layout/store-footer";
import { StoreHeader } from "@/components/layout/store-header";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="text-brand sr-only z-50 rounded-md bg-white px-4 py-3 font-semibold shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        本文へ移動
      </a>

      <StoreHeader />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <StoreFooter />
      <BackToTop />
    </div>
  );
}