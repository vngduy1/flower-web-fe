import type { Metadata } from "next";

import { NotificationsPageContent } from "@/features/notifications/components/notifications-page-content";

export const metadata: Metadata = {
  title: "通知",
  description: "注文・支払い・レビューに関する通知を確認します。",
};

export default function NotificationsPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
          Notifications
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold sm:text-4xl">
          通知
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-7">
          注文、支払い、レビュー審査に関する最新のお知らせです。
        </p>
      </div>
      <NotificationsPageContent />
    </section>
  );
}
