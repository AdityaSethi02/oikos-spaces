import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { isClerkServerConfigured, isDatabaseConfigured } from "@/lib/env";
import { ForbiddenError, UnauthorizedError } from "@/server/errors";
import { syncUserSession } from "@/server/services/auth.service";

export async function getClerkAuthUserId(): Promise<string | null> {
  if (!isClerkServerConfigured) return null;
  const session = await auth();
  return session.userId;
}

export async function getCurrentAppUser(): Promise<User | null> {
  if (!isDatabaseConfigured || !isClerkServerConfigured) return null;

  const clerkUserId = await getClerkAuthUserId();
  if (!clerkUserId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) return null;

  return syncUserSession({
    clerkUserId,
    email,
    name: clerkUser.fullName ?? clerkUser.firstName,
    phone: clerkUser.primaryPhoneNumber?.phoneNumber,
    source: "clerk_sync",
  });
}

export async function requireAuthUser(): Promise<User> {
  const user = await getCurrentAppUser();
  if (!user) {
    if (!isClerkServerConfigured) {
      throw new UnauthorizedError("Authentication is not configured");
    }
    redirect("/sign-in");
  }
  return user;
}

export async function requireAuthUserOrThrow(): Promise<User> {
  const user = await getCurrentAppUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

export async function requireGuestUser(): Promise<User> {
  const user = await requireAuthUser();
  if (user.role !== "GUEST" && user.role !== "ADMIN_HOST") {
    throw new ForbiddenError();
  }
  return user;
}

export async function requireAdminHost(): Promise<User> {
  const user = await requireAuthUser();
  if (user.role !== "ADMIN_HOST") {
    redirect("/");
  }
  return user;
}

export function assertGuestOwnsResource(
  user: User,
  resourceGuestId: string,
): void {
  if (user.id !== resourceGuestId) {
    throw new ForbiddenError("You do not have access to this resource");
  }
}

export function assertAdminHost(user: User): void {
  if (user.role !== "ADMIN_HOST") {
    throw new ForbiddenError("Admin access required");
  }
}
