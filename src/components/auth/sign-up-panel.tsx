"use client";

import { SignUp } from "@clerk/nextjs";
import {
  clerkAfterSignUpUrl,
  clerkAppearance,
  clerkSignInUrl,
  isClerkConfigured,
} from "@/lib/clerk";

export function SignUpPanel() {
  if (!isClerkConfigured) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
        <p className="font-serif text-xl text-foreground">Sign-up unavailable</p>
        <p className="mt-2 text-sm text-muted">
          Account creation requires Clerk. Add your publishable and secret keys to{" "}
          <code className="text-xs">.env.local</code> to enable registration.
        </p>
      </div>
    );
  }

  return (
    <SignUp
      routing="hash"
      signInUrl={clerkSignInUrl}
      fallbackRedirectUrl={clerkAfterSignUpUrl}
      appearance={clerkAppearance}
    />
  );
}
