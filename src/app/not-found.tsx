import Link from "next/link";

import { EmptyState } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <EmptyState
        code="404 · Not found"
        title="このページは見つかりませんでした"
        description="URLが変更されたか、ページがまだ用意されていない可能性があります。"
        action={
          <Link
            href="/"
            className="bg-brand hover:bg-brand-dark inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition-colors"
          >
            ホームへ戻る
          </Link>
        }
      />
    </main>
  );
}
