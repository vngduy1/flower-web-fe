import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-brand-soft/75 animate-pulse rounded-xl", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
