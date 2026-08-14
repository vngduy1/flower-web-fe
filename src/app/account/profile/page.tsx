import type { Metadata } from "next";

import { ProfileForm } from "@/features/users/components/profile-form";

export const metadata: Metadata = {
  title: "プロフィール",
};

export default function ProfilePage() {
  return (
    <div>
      <p className="text-accent text-xs font-bold tracking-[0.18em] uppercase">Profile</p>
      <h1 className="text-brand-dark mt-3 font-serif text-3xl sm:text-4xl">
        プロフィール
      </h1>
      <p className="text-muted-foreground mt-4 text-sm leading-7">
        お客様情報は、実際のユーザーAPIから取得・更新されます。
      </p>
      <div className="mt-8">
        <ProfileForm />
      </div>
    </div>
  );
}
