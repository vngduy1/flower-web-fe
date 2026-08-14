"use client";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const apiError = normalizeApiError(error);

  return (
    <div className="mx-auto grid min-h-[55vh] w-full max-w-2xl place-items-center px-5 py-16">
      <div className="w-full">
        <Alert variant="error" title="商品情報を読み込めませんでした">
          {apiError.message}
        </Alert>
        <Button className="mt-5" onClick={reset}>
          もう一度試す
        </Button>
      </div>
    </div>
  );
}
