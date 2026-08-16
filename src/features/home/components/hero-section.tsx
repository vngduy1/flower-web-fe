import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        {/* Left content */}
        <div className="relative z-10 max-w-xl">
          <p className="home-eyebrow">Tokyo · Online flower boutique</p>

          <div className="hanaori-rule mt-5" />

          <h1 className="mt-7 font-serif text-5xl leading-[1.25] font-medium tracking-[-0.035em] text-brand-dark sm:text-6xl lg:text-[4.6rem] lg:leading-[1.18]">
            暮らしに、
            <br />
            花の余白を。
          </h1>

          <p className="mt-8 max-w-lg text-sm leading-8 text-muted-foreground sm:text-base sm:leading-9">
            季節の移ろいを映す花を、あなたの日常へ。
            <br className="hidden sm:block" />
            大切な日にも、何気ない一日にも、
            <br className="hidden sm:block" />
            心に残る花をお届けします。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/products"
              className="bg-brand-dark inline-flex min-h-12 items-center justify-center px-7 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand"
            >
              商品を探す
            </Link>

            <Link
              href="#story"
              className="group inline-flex items-center gap-3 text-sm font-semibold text-brand-dark"
            >
              花織について
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          {/* Small editorial note */}
          <div className="mt-14 hidden items-center gap-4 border-t border-brand/15 pt-5 sm:flex">
            <span className="font-serif text-xs italic text-accent">01</span>

            <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Seasonal flowers · Tokyo
            </p>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative">
          <div className="relative ml-auto aspect-[4/5] w-full max-w-[620px] overflow-hidden bg-surface-muted">
            <Image
              src="/images/home/hero.jpg"
              alt="季節の花を束ねた花織のブーケ"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />

            {/* subtle overlay chỉ để chữ/caption dễ hòa vào ảnh */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Caption */}
          <div className="mt-5 flex items-start justify-between gap-6">
            <div>
              <p className="font-serif text-base text-brand-dark">
                季節の花を、あなたへ。
              </p>

              <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Seasonal arrangement
              </p>
            </div>

            <p className="text-right text-[10px] leading-5 tracking-[0.12em] text-muted-foreground uppercase">
              Tokyo
              <br />
              Hanaori
            </p>
          </div>

          {/* Decorative vertical text */}
          <p
            className="absolute -right-8 top-0 hidden text-[9px] tracking-[0.22em] text-brand-dark/40 uppercase xl:block [writing-mode:vertical-rl]"
            aria-hidden="true"
          >
            Flowers for everyday life
          </p>
        </div>
      </div>
    </section>
  );
}