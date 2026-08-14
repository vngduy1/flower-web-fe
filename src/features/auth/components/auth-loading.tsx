export function AuthLoading({
  label = "ログイン状態を確認しています",
}: {
  label?: string;
}) {
  return (
    <div className="grid min-h-[55vh] place-items-center px-5 py-16" role="status">
      <div className="text-center">
        <span
          className="border-brand-soft border-r-brand mx-auto block size-9 animate-spin rounded-full border-2"
          aria-hidden="true"
        />
        <p className="text-muted-foreground mt-4 text-sm">{label}</p>
      </div>
    </div>
  );
}
