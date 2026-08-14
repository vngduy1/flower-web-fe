"use client";

import { Alert, Button } from "@/components/ui";

interface AuthErrorStateProps {
  message: string;
  onRetry: () => Promise<void>;
}

export function AuthErrorState({ message, onRetry }: AuthErrorStateProps) {
  return (
    <div className="mx-auto grid min-h-[55vh] max-w-xl place-items-center px-5 py-16">
      <div className="w-full">
        <Alert variant="error" title="ログイン状態を確認できませんでした">
          {message}
        </Alert>
        <Button className="mt-5" onClick={() => void onRetry()}>
          もう一度試す
        </Button>
      </div>
    </div>
  );
}
