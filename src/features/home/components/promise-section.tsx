export function PromiseSection() {
  return (
    <section
      id="promise"
      className="scroll-mt-32 px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="home-eyebrow">Our promise</p>

            <div className="hanaori-rule mt-5" />

            <h2 className="mt-7 font-serif text-4xl text-brand-dark sm:text-5xl">
              私たちの約束
            </h2>

            <p className="mt-6 max-w-md text-sm leading-8 text-muted-foreground">
              花を選ぶ時間から、お届けしたその先まで。
              花織は、一つひとつのご注文に丁寧に向き合います。
            </p>
          </div>

          <div className="border-t border-brand/15">
            <PromiseItem
              number="01"
              title="新鮮な花を"
              description="季節に合った新鮮な花を選び、できるだけ良い状態でお届けします。"
            />

            <PromiseItem
              number="02"
              title="ひとつひとつ丁寧に"
              description="ご注文ごとに花の表情を見ながら、丁寧に束ねてお届けします。"
            />

            <PromiseItem
              number="03"
              title="大切な日に寄り添う"
              description="誕生日や記念日、お祝いなど、想いを届けたい瞬間に寄り添います。"
              last
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PromiseItem({
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
      className={`group grid gap-4 py-8 sm:grid-cols-[70px_220px_1fr] sm:items-center ${
        last ? "" : "border-b border-brand/10"
      }`}
    >
      <span className="font-serif text-sm italic text-accent/80">
        {number}
      </span>

      <h3 className="font-serif text-2xl text-brand-dark transition-transform duration-300 group-hover:translate-x-1">
        {title}
      </h3>

      <p className="text-sm leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}