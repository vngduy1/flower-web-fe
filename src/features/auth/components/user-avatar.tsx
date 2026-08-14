import { cn } from "@/lib/utils/cn";

interface UserAvatarProps {
  name: string;
  className?: string;
}

export function UserAvatar({ className, name }: UserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "花";

  return (
    <span
      className={cn(
        "bg-brand-soft text-brand-dark grid size-9 shrink-0 place-items-center rounded-full font-serif font-semibold",
        className,
      )}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
