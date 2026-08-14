import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ご利用ガイド",
  description:
    "花織での商品選びからご注文、お支払い、配送、キャンセルまでのご利用方法をご案内します。",
};

const GUIDE_SECTIONS = [
  {
    number: "01",
    title: "商品を選ぶ",
    description:
      "商品一覧やカテゴリから、お好みの花をお選びください。商品ページでは価格、販売状態、商品説明などをご確認いただけます。",
  },
  {
    number: "02",
    title: "カートに追加",
    description:
      "購入したい商品が決まりましたら、数量をご確認のうえカートに追加してください。カート内では商品内容や数量を確認できます。",
  },
  {
    number: "03",
    title: "お届け先を指定",
    description:
      "ご注文手続きでは、お名前、住所、電話番号などのお届け先情報をご指定ください。登録済みの住所がある場合は、そちらから選択できます。",
  },
  {
    number: "04",
    title: "お届け日時を選ぶ",
    description:
      "選択可能な配送日時の中から、ご希望のお届け日と時間帯を指定してください。商品によっては準備に日数が必要な場合があります。",
  },
  {
    number: "05",
    title: "お支払い",
    description:
      "ご注文内容とお支払い情報をご確認ください。利用可能なお支払い方法は、ご注文画面に表示される内容をご確認ください。",
  },
  {
    number: "06",
    title: "ご注文完了",
    description:
      "ご注文が完了すると注文情報が登録されます。マイページから注文内容や現在の状態をご確認いただけます。",
  },
];

const INFORMATION_SECTIONS = [
  {
    title: "配送について",
    items: [
      "配送可能な日時は、商品や配送状況によって異なります。",
      "配送先情報に誤りがないか、ご注文確定前に必ずご確認ください。",
      "天候や交通事情などにより、お届け時間が前後する場合があります。",
    ],
  },
  {
    title: "商品について",
    items: [
      "生花は季節や入荷状況により、写真と花材・色合い・咲き方が多少異なる場合があります。",
      "できる限り商品のイメージを保ちながら、状態の良い花を選んでお届けします。",
      "販売期間が設定されている商品は、期間外に購入できない場合があります。",
    ],
  },
  {
    title: "キャンセル・変更について",
    items: [
      "注文状態によっては、キャンセルや内容変更を行えない場合があります。",
      "決済済みのご注文については、返金処理が必要になる場合があります。",
      "注文内容を変更したい場合は、できるだけ早めにご確認ください。",
    ],
  },
  {
    title: "商品到着後について",
    items: [
      "商品が届きましたら、できるだけ早く梱包を開けて花の状態をご確認ください。",
      "茎の切り口を整え、清潔な花瓶と水をご使用ください。",
      "直射日光や冷暖房の風が直接当たる場所はできるだけ避けてください。",
    ],
  },
];

export default function GuidePage() {
  return (
    <div>
      <section className="border-brand/10 bg-surface border-b px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
            Shopping guide
          </p>

          <h1 className="text-brand-dark mt-4 font-serif text-4xl sm:text-5xl">
            ご利用ガイド
          </h1>

          <p className="text-muted-foreground mt-6 max-w-2xl text-sm leading-8 sm:text-base">
            花織で商品をお選びいただいてから、お届けするまでの流れや、
            ご注文時にご確認いただきたい内容をご案内します。
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="text-accent text-xs font-bold tracking-[0.18em] uppercase">
              Order flow
            </p>

            <h2 className="text-brand-dark mt-3 font-serif text-3xl">ご注文の流れ</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {GUIDE_SECTIONS.map((item) => (
              <article
                key={item.number}
                className="border-brand/10 rounded-3xl border bg-white p-6 shadow-sm sm:p-7"
              >
                <p className="text-accent text-xs font-bold tracking-[0.18em]">
                  STEP {item.number}
                </p>

                <h3 className="text-brand-dark mt-5 font-serif text-2xl">{item.title}</h3>

                <p className="text-muted-foreground mt-4 text-sm leading-7">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft/20 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="text-accent text-xs font-bold tracking-[0.18em] uppercase">
              Before ordering
            </p>

            <h2 className="text-brand-dark mt-3 font-serif text-3xl">
              ご注文前にご確認ください
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {INFORMATION_SECTIONS.map((section) => (
              <article
                key={section.title}
                className="border-brand/10 rounded-3xl border bg-white p-6 sm:p-8"
              >
                <h3 className="text-brand-dark font-serif text-2xl">{section.title}</h3>

                <ul className="text-muted-foreground mt-5 grid gap-3 text-sm leading-7">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="bg-accent mt-[0.7em] size-1.5 shrink-0 rounded-full"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="bg-brand-dark mx-auto max-w-7xl rounded-[2rem] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-white/65 uppercase">
              Start shopping
            </p>

            <h2 className="mt-4 font-serif text-3xl">
              お気に入りの花を探してみませんか。
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              季節の花や贈りものにおすすめの商品をご用意しています。
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 lg:mt-0">
            <Link
              href="/products"
              className="text-brand-dark inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              商品を見る
            </Link>

            <Link
              href="/#guide"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white"
            >
              トップへ戻る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
