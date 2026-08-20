import type { User, UserRole } from "@prisma/client";
import { hostRepository, normalizeAuthEmail } from "@/server/repositories/host.repository";
import { userRepository } from "@/server/repositories/user.repository";

export async function resolveRoleForEmail(email: string): Promise<UserRole> {
  const host = await hostRepository.findActiveByEmail(email);
  return host ? "ADMIN_HOST" : "GUEST";
}

export async function isAdminHostEmail(email: string): Promise<boolean> {
  return (await resolveRoleForEmail(email)) === "ADMIN_HOST";
}

/**
 * Sync Clerk profile into our DB and set role from the HostAccount allowlist.
 * Called after sign-in/sign-up and from the Clerk webhook.
 */
export async function syncUserSession(input: {
  clerkUserId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  source?: "clerk_sync" | "session_check" | "clerk_webhook";
}): Promise<User> {
  const normalizedEmail = normalizeAuthEmail(input.email);
  const role = await resolveRoleForEmail(normalizedEmail);

  return userRepository.upsertFromClerk({
    clerkUserId: input.clerkUserId,
    email: normalizedEmail,
    name: input.name,
    phone: input.phone,
    role,
  });
}

export type AuthSessionPayload = {
  authenticated: boolean;
  isAdminHost: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  } | null;
};

export function toAuthSessionPayload(user: User | null): AuthSessionPayload {
  if (!user) {
    return { authenticated: false, isAdminHost: false, user: null };
  }

  return {
    authenticated: true,
    isAdminHost: user.role === "ADMIN_HOST",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
