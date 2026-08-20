import { auth } from "@clerk/nextjs/server";
import { getGuestBookingByReference } from "@/server/services/booking-query.service";
import { generateBookingInvoicePdf } from "@/server/services/invoice.service";
import { getCurrentAppUser } from "@/server/policies/auth.policy";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reference: string }> };

export async function GET(_req: Request, context: RouteContext) {
  if (!isDatabaseConfigured) {
    return new Response("Database not configured", { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getCurrentAppUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { reference } = await context.params;
  const booking = await getGuestBookingByReference(reference, user);
  if (!booking) {
    return new Response("Not found", { status: 404 });
  }

  if (!["paid", "partially_refunded", "refunded"].includes(booking.paymentStatus)) {
    return new Response("Invoice is available after payment is confirmed", { status: 400 });
  }

  const pdf = await generateBookingInvoicePdf(booking);
  const filename = `oikos-invoice-${reference}.pdf`;

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
