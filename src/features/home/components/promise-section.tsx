export function PromiseSection() {
  return (
    <section id="promise" className="scroll-mt-32 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">
            Our promise
          </p>

          <h2 className="text-brand-dark mt-3 font-serif text-4xl sm:text-5xl">
            私たちの約束
          </h2>

          <p className="text-muted-foreground mt-5 leading-8">
            花を選ぶ時間から、お届けしたその先まで。
            花織は、一つひとつのご注文に丁寧に向き合います。
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <PromiseCard
            number="01"
            title="新鮮な花を"
            description="季節に合った新鮮な花を選び、できるだけ良い状態でお届けします。"
          />

          <PromiseCard
            number="02"
            title="ひとつひとつ丁寧に"
            description="ご注文ごとに花の表情を見ながら、丁寧に束ねてお届けします。"
          />

          <PromiseCard
            number="03"
            title="大切な日に寄り添う"
            description="誕生日や記念日、お祝いなど、想いを届けたい瞬間に寄り添います。"
          />
        </div>
      </div>
    </section>
  );
}

function PromiseCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="border-brand/10 bg-surface rounded-3xl border p-6 shadow-sm sm:p-7">
      <p className="text-accent text-xs font-bold tracking-[0.18em]">{number}</p>

      <h3 className="text-brand-dark mt-6 font-serif text-2xl">{title}</h3>

      <p className="text-muted-foreground mt-4 text-sm leading-7">{description}</p>
    </article>
  );
}
