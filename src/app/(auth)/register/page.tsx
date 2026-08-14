import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "会員登録",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
