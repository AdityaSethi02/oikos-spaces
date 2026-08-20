"use client";

import { ClerkProvider } from "@clerk/nextjs";
import {
  clerkAppearance,
  clerkPublishableKey,
  isClerkConfigured,
} from "@/lib/clerk";
import { SessionSync } from "@/components/providers/session-sync";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured) {
    return children;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance}>
      <SessionSync />
      {children}
    </ClerkProvider>
  );
}
