"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { isClerkConfigured } from "@/lib/clerk";

/** Syncs Clerk sign-in with our DB and resolves admin/host role from HostAccount. */
export function SessionSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isClerkConfigured || !isLoaded) return;

    if (!isSignedIn) {
      syncedRef.current = null;
      return;
    }

    if (syncedRef.current === "synced") return;
    syncedRef.current = "synced";

    fetch("/api/auth/session", { credentials: "include" }).catch(() => {
      syncedRef.current = null;
    });
  }, [isLoaded, isSignedIn]);

  return null;
}
