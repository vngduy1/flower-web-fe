import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="border-brand/10 bg-brand-dark border-t text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-baseline gap-3 rounded-md">
            <span className="font-serif text-2xl font-semibold tracking-[0.16em]">
              花織
            </span>
            <span className="text-[10px] tracking-[0.18em] text-white/70 uppercase">
              Hanaori flowers
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            暮らしの節目にも、何気ない一日にも。季節の気配を感じる花を、心を込めてお届けします。
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            Hanaori catalog
          </p>
          <p className="mt-3 text-sm leading-7 text-white/70">
            季節の花をカテゴリやキーワードから探して、商品ごとの魅力をご覧いただけます。
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/70">
        © 2026 Hanaori Flowers
      </div>
    </footer>
  );
}
