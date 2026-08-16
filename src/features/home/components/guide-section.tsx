import Link from "next/link";

const GUIDE_ITEMS = [
  {
    number: "01",
    title: "商品を選ぶ",
    description: "お気に入りの花を商品一覧からお選びください。",
  },
  {
    number: "02",
    title: "お届け先・日時",
    description: "配送先とご希望のお届け日時を入力します。",
  },
  {
    number: "03",
    title: "お支払い",
    description: "ご注文内容を確認し、お支払い方法を選択します。",
  },
  {
    number: "04",
    title: "お届け",
    description: "大切に準備した花をご指定の住所へお届けします。",
  },
];

export function GuideSection() {
  return (
    <section
      id="guide"
      className="scroll-mt-32 border-y border-brand/10 bg-surface px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="home-eyebrow">Shopping guide</p>

            <div className="hanaori-rule mt-5" />

            <h2 className="mt-7 font-serif text-4xl text-brand-dark sm:text-5xl">
              ご利用ガイド
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground">
              商品を選んでからお届けするまでの流れをご案内します。
            </p>
          </div>

          <Link
            href="/guide"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-brand-dark"
          >
            ご利用ガイドを詳しく見る
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <div
            className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-brand/15 lg:block"
            aria-hidden="true"
          />

          {GUIDE_ITEMS.map((item, index) => (
            <li
              key={item.number}
              className="relative lg:px-6 first:lg:pl-0 last:lg:pr-0"
            >
              <div className="relative z-10 flex size-10 items-center justify-center rounded-full border border-brand/20 bg-surface font-serif text-xs text-brand-dark">
                {item.number}
              </div>

              <h3 className="mt-7 font-serif text-xl text-brand-dark">
                {item.title}
              </h3>

              <p className="mt-3 max-w-[250px] text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>

              {index < GUIDE_ITEMS.length - 1 && (
                <span
                  className="mt-7 block h-px w-12 bg-brand/15 lg:hidden"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}