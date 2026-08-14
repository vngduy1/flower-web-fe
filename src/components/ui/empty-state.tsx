import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  code?: string;
  headingLevel?: "h1" | "h2";
}

export function EmptyState({
  action,
  className,
  code,
  description,
  headingLevel = "h1",
  title,
}: EmptyStateProps) {
  const Heading = headingLevel;

  return (
    <section
      className={cn(
        "bg-surface mx-auto flex max-w-xl flex-col items-center rounded-3xl border px-6 py-14 text-center shadow-sm",
        className,
      )}
    >
      {code ? (
        <p className="text-accent mb-4 text-xs font-bold tracking-[0.22em] uppercase">
          {code}
        </p>
      ) : null}
      <Heading className="text-foreground font-serif text-3xl font-semibold">
        {title}
      </Heading>
      <p className="text-muted-foreground mt-3 max-w-md text-sm leading-7">
        {description}
      </p>
      {action ? <div className="mt-7">{action}</div> : null}
    </section>
  );
}
