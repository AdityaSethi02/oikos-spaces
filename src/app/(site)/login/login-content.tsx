"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/providers/toast-provider";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const next = searchParams.get("next") || "/bookings";
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login",
  );

  const continueDemo = () => {
    showToast(mode === "signup" ? "Account created (demo)" : "Signed in (demo)", "success");
    router.push(next);
  };

  return (
    <div className="section-padding">
      <div className="container-page flex justify-center">
        <Card className="w-full max-w-md text-center" padding="lg">
          <h1 className="font-serif text-3xl">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "Sign in to manage bookings, messages, and saved stays."
              : "Join to reserve stays, message the host, and save homes."}
          </p>

          <div className="mt-8 space-y-3">
            <Button variant="outline" fullWidth className="gap-3" onClick={continueDemo}>
              <Icons.Google className="h-4 w-4" />
              Continue with Google
            </Button>
            <Button variant="outline" fullWidth className="gap-3" onClick={continueDemo}>
              <Icons.Apple className="h-4 w-4" />
              Continue with Apple
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Authentication will be connected later. This is a demo sign-in.
          </p>

          <button
            type="button"
            onClick={continueDemo}
            className="mt-6 block w-full text-sm text-accent hover:underline"
          >
            Continue as demo guest →
          </button>
          <Link href="/admin" className="mt-3 block text-sm text-muted hover:text-foreground">
            Host dashboard (demo)
          </Link>

          <p className="mt-8 text-sm text-muted">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-foreground underline-offset-2 hover:underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
