export function StorySection() {
  return (
    <section
      id="story"
      className="border-brand/10 bg-brand-soft/20 scroll-mt-32 border-y"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
            About Hanaori
          </p>

          <h2 className="text-brand-dark mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            花のある時間を、
            <br />
            もっと日常に。
          </h2>

          <p className="text-muted-foreground mt-7 max-w-xl leading-8">
            花織は、季節の花を通して、日々の暮らしに小さな彩りを届ける
            フラワーショップです。誕生日や記念日の贈りものはもちろん、
            何気ない一日を少し特別にする花も、一つひとつ丁寧にお届けします。
          </p>
        </div>

        <div className="grid gap-6">
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
          />
        </div>
      </div>
    </section>
  );
}

function StoryItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="border-brand/10 border-b pb-6">
      <p className="text-accent text-xs font-bold tracking-[0.18em]">{number}</p>

      <h3 className="text-brand-dark mt-2 font-serif text-2xl">{title}</h3>

      <p className="text-muted-foreground mt-3 leading-7">{description}</p>
    </article>
  );
}
