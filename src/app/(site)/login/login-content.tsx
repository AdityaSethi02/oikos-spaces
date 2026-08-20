"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clerkSignInUrl, clerkSignUpUrl, isClerkConfigured } from "@/lib/clerk";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/bookings";
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

  useEffect(() => {
    if (isClerkConfigured) {
      const base = mode === "signup" ? clerkSignUpUrl : clerkSignInUrl;
      const url = next ? `${base}?redirect_url=${encodeURIComponent(next)}` : base;
      window.location.replace(url);
    }
  }, [mode, next]);

  const signInHref = next
    ? `${clerkSignInUrl}?redirect_url=${encodeURIComponent(next)}`
    : clerkSignInUrl;
  const signUpHref = next
    ? `${clerkSignUpUrl}?redirect_url=${encodeURIComponent(next)}`
    : clerkSignUpUrl;

  return (
    <div className="section-padding">
      <div className="container-page flex justify-center">
        <Card className="w-full max-w-md text-center" padding="lg">
          <h1 className="font-serif text-3xl">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          {isClerkConfigured ? (
            <p className="mt-4 text-muted">Redirecting to secure sign-in…</p>
          ) : (
            <>
              <p className="mt-4 text-muted">
                Authentication is not configured yet. Set Clerk environment variables to enable sign-in.
              </p>
              <div className="mt-8 space-y-3">
                <ButtonLink href={signInHref} fullWidth>
                  Sign in (Clerk)
                </ButtonLink>
                <ButtonLink href={signUpHref} variant="outline" fullWidth>
                  Create account
                </ButtonLink>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
