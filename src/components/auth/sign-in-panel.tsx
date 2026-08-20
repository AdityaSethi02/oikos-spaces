"use client";

import { SignIn } from "@clerk/nextjs";
import {
  clerkAfterSignInUrl,
  clerkAppearance,
  clerkSignUpUrl,
  isClerkConfigured,
} from "@/lib/clerk";

export function SignInPanel() {
  if (!isClerkConfigured) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
        <p className="font-serif text-xl text-foreground">Sign-in unavailable</p>
        <p className="mt-2 text-sm text-muted">
          Authentication requires Clerk. Add your publishable and secret keys to{" "}
          <code className="text-xs">.env.local</code> to enable sign-in.
        </p>
      </div>
    );
  }

  return (
    <SignIn
      routing="hash"
      signUpUrl={clerkSignUpUrl}
      fallbackRedirectUrl={clerkAfterSignInUrl}
      appearance={clerkAppearance}
    />
  );
}
