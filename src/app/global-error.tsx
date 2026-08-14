"use client";

import { Button } from "@/components/ui";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="ja">
      <body className="grid min-h-screen place-items-center bg-[#f8f7f2] px-5 text-[#253129]">
        <main className="w-full max-w-xl rounded-3xl border border-[#d9ddd4] bg-[#fffdfa] px-6 py-14 text-center shadow-sm">
          <p className="text-xs font-bold tracking-[0.2em] text-[#b56568] uppercase">
            Something went wrong
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold">
            ページを表示できませんでした
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#667169]">
            一時的な問題が発生しています。時間をおいて、もう一度お試しください。
          </p>
          <Button className="mt-7" onClick={retry}>
            もう一度試す
          </Button>
        </main>
      </body>
    </html>
  );
}
