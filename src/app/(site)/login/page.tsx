import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import LoginContent from "./login-content";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading sign in" />}>
      <LoginContent />
    </Suspense>
  );
}
