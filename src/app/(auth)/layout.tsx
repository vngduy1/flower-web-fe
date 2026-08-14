import Link from "next/link";

import { GuestOnly } from "@/features/auth/components/guest-only";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestOnly>
      <main className="bg-surface grid min-h-screen lg:grid-cols-[0.88fr_1.12fr]">
        <section className="bg-brand-dark relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="bg-accent/25 absolute -top-28 -left-20 size-96 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <Link
            href="/"
            className="relative inline-flex w-fit items-center gap-3 rounded-md"
          >
            <span className="grid size-10 place-items-center rounded-full bg-white/10 font-serif text-lg">
              花
            </span>
            <span className="font-serif text-2xl tracking-[0.16em]">花織</span>
          </Link>
          <div className="relative max-w-lg pb-8">
            <p className="text-xs font-bold tracking-[0.22em] text-white/70 uppercase">
              Flowers for every story
            </p>
            <p className="mt-5 font-serif text-4xl leading-[1.45]">
              花のある時間を、
              <br />
              もっとあなたらしく。
            </p>
            <p className="mt-5 max-w-md text-sm leading-8 text-white/60">
              季節の花と、大切な人を想う気持ち。花織がていねいにつなぎます。
            </p>
          </div>
        </section>
        <section className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 lg:px-12 lg:py-14">
          <Link
            href="/"
            className="border-brand/15 text-brand-dark absolute top-5 left-5 rounded-full border bg-white px-4 py-2 text-xs font-semibold lg:hidden"
          >
            花織へ戻る
          </Link>
          {children}
        </section>
      </main>
    </GuestOnly>
  );
}
