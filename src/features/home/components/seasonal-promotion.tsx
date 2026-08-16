import Link from "next/link";
import Image from "next/image";

export function SeasonalPromotion() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10 lg:pb-32">
  <div className="mx-auto max-w-7xl">
    <div className="relative overflow-hidden bg-brand-dark">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Image */}
        <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
          <Image
            src="/images/home/seasonal.jpg"
            alt="季節の花を束ねたアレンジメント"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex items-center px-7 py-12 text-white sm:px-10 sm:py-16 lg:px-14">
          <div className="max-w-md">
            <p className="text-[10px] font-bold tracking-[0.22em] text-white/55 uppercase">
              Seasonal story
            </p>

            <div className="mt-5 h-px w-10 bg-white/30" />

            <h2 className="mt-7 font-serif text-3xl leading-[1.45] sm:text-4xl lg:text-5xl">
              季節の花を、
              <br />
              暮らしの中へ。
            </h2>

            <p className="mt-6 text-sm leading-8 text-white/65">
              その季節にしか出会えない花を、
              暮らしの中に取り入れてみませんか。
              花織が季節ごとのおすすめをお届けします。
            </p>

            <Link
              href="/products"
              className="group mt-9 inline-flex items-center gap-4 text-sm font-semibold"
            >
              季節の花を見る
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <p
        className="absolute right-5 bottom-5 hidden text-[9px] tracking-[0.22em] text-white/25 uppercase lg:block [writing-mode:vertical-rl]"
        aria-hidden="true"
      >
        Hanaori seasonal collection
      </p>
    </div>
  </div>
</section>
  );
}