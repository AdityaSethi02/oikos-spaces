import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkServerConfigured, isDatabaseConfigured } from "@/lib/env";
import {
  syncUserSession,
  toAuthSessionPayload,
} from "@/server/services/auth.service";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isClerkServerConfigured) {
    return Response.json(
      toAuthSessionPayload(null),
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return Response.json(toAuthSessionPayload(null), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!isDatabaseConfigured) {
    return Response.json(
      {
        authenticated: Boolean(userId),
        isAdminHost: false,
        user: null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return Response.json(toAuthSessionPayload(null), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return Response.json(
      {
        authenticated: true,
        isAdminHost: false,
        user: null,
        warning: "Clerk account has no email address",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const user = await syncUserSession({
      clerkUserId: userId,
      email,
      name: clerkUser.fullName ?? clerkUser.firstName,
      phone: clerkUser.primaryPhoneNumber?.phoneNumber,
      source: "session_check",
    });

    return Response.json(toAuthSessionPayload(user), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[auth/session]", error);
    return Response.json(
      { error: "Failed to resolve session" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
