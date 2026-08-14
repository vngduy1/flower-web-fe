import Link from "next/link";

const GUIDE_ITEMS = [
  {
    number: "01",
    title: "商品を選ぶ",
    description: "お気に入りの花を商品一覧からお選びください。",
  },
  {
    number: "02",
    title: "お届け先・日時を指定",
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
      className="bg-surface scroll-mt-32 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
              Shopping guide
            </p>

            <h2 className="text-brand-dark mt-3 font-serif text-4xl sm:text-5xl">
              ご利用ガイド
            </h2>

            <p className="text-muted-foreground mt-5 max-w-2xl leading-8">
              商品を選んでからお届けするまでの流れをご案内します。
            </p>
          </div>

          <Link
            href="/guide"
            className="text-brand-dark text-sm font-semibold underline-offset-4 hover:underline"
          >
            ご利用ガイドを詳しく見る →
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDE_ITEMS.map((item) => (
            <article
              key={item.number}
              className="border-brand/10 rounded-3xl border bg-white p-6"
            >
              <p className="text-accent text-xs font-bold">{item.number}</p>

              <h3 className="text-brand-dark mt-6 font-serif text-xl font-semibold">
                {item.title}
              </h3>

              <p className="text-muted-foreground mt-3 text-sm leading-7">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
