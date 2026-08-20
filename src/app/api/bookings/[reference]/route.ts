import { auth } from "@clerk/nextjs/server";
import { getGuestBookingByReference } from "@/server/services/booking-query.service";
import { getCurrentAppUser } from "@/server/policies/auth.policy";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reference: string }> };

export async function GET(_req: Request, context: RouteContext) {
  if (!isDatabaseConfigured) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getCurrentAppUser();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }

  const { reference } = await context.params;
  const booking = await getGuestBookingByReference(reference, user);
  if (!booking) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(booking);
}
