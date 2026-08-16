import Link from "next/link";

const shopLinks = [
  { href: "/products", label: "すべての商品" },
  { href: "/#categories", label: "シーンから選ぶ" },
  { href: "/#featured", label: "おすすめの花" },
  { href: "/#new-arrivals", label: "新着商品" },
] as const;

const guideLinks = [
  { href: "/guide", label: "ご利用ガイド" },
  { href: "/#story", label: "花織について" },
  { href: "/#promise", label: "私たちの約束" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export function StoreFooter() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.6fr_0.6fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-md"
            >
              <span className="grid size-10 place-items-center rounded-full border border-white/20 font-serif text-lg">
                花
              </span>

              <span>
                <span className="block font-serif text-2xl font-semibold tracking-[0.18em]">
                  花織
                </span>

                <span className="mt-1 block text-[9px] tracking-[0.22em] text-white/50 uppercase">
                  Hanaori Flowers
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-8 text-white/60">
              暮らしの節目にも、何気ない一日にも。
              <br className="hidden sm:block" />
              季節の気配を感じる花を、心を込めてお届けします。
            </p>

            <p className="mt-8 font-serif text-lg leading-8 text-white/85">
              季節の花を、
              <br />
              あなたの暮らしへ。
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase">
              Shop
            </p>

            <ul className="mt-5 space-y-3">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guide */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase">
              Information
            </p>

            <ul className="mt-5 space-y-3">
              {guideLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-[10px] tracking-[0.08em] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© 2026 Hanaori Flowers</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">
              プライバシーポリシー
            </Link>

            <Link href="/terms" className="transition-colors hover:text-white">
              利用規約
            </Link>

            <Link href="/legal" className="transition-colors hover:text-white">
              特定商取引法に基づく表記
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}