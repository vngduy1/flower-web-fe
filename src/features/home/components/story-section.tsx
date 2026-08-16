import Image from "next/image";

export function StorySection() {
  return (
    <section
      id="story"
      className="border-brand/10 scroll-mt-32 border-y bg-[#f0f1eb]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          {/* Editorial visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-4/5 overflow-hidden">
  <Image
    src="/images/home/story.jpg"
    alt="花のある暮らしを楽しむ室内の風景"
    fill
    sizes="(max-width: 1024px) 100vw, 45vw"
    className="object-cover"
  />

  <div
    className="absolute inset-[7%] border border-white/35"
    aria-hidden="true"
  />

  <p
    className="absolute right-[7%] bottom-[8%] text-[9px] tracking-[0.22em] text-white/70 uppercase [writing-mode:vertical-rl]"
    aria-hidden="true"
  >
    Hanaori everyday flowers
  </p>
</div>

            <div className="absolute -right-4 -bottom-5 bg-background px-5 py-4 sm:-right-8 sm:px-7">
              <p className="font-serif text-sm leading-7 text-brand-dark">
                Flowers become
                <br />
                part of everyday life.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="order-1 lg:order-2">
            <p className="home-eyebrow">About Hanaori</p>

            <div className="hanaori-rule mt-5" />

            <h2 className="mt-7 font-serif text-4xl leading-[1.45] text-brand-dark sm:text-5xl lg:text-[3.4rem]">
              花のある時間を、
              <br />
              もっと日常に。
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base sm:leading-9">
              花織は、季節の花を通して、日々の暮らしに小さな彩りを届ける
              フラワーショップです。
              誕生日や記念日の贈りものはもちろん、
              何気ない一日を少し特別にする花も、
              一つひとつ丁寧にお届けします。
            </p>

            <div className="mt-12 border-t border-brand/15">
              <StoryItem
                number="01"
                title="季節を楽しむ"
                description="その季節ならではの花を取り入れた商品をご提案します。"
              />

              <StoryItem
                number="02"
                title="想いを届ける"
                description="誕生日や記念日、お祝いなど、大切な気持ちに寄り添う花をお届けします。"
              />

              <StoryItem
                number="03"
                title="暮らしに寄り添う"
                description="特別な日だけでなく、日常にも気軽に花を取り入れられる商品を揃えます。"
                last
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryItem({
  number,
  title,
  description,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <article
      className={`grid gap-3 py-6 sm:grid-cols-[52px_150px_1fr] sm:items-start ${
        last ? "" : "border-b border-brand/10"
      }`}
    >
      <p className="text-[10px] font-bold tracking-[0.18em] text-accent">
        {number}
      </p>

      <h3 className="font-serif text-xl text-brand-dark">{title}</h3>

      <p className="text-sm leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}