import prisma from "@/lib/prisma";
import { requireDatabase } from "@/server/lib/require-config";
import { enqueueNotification } from "@/server/services/notification.service";
import { brand } from "@/lib/brand";

export async function submitContactInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  requireDatabase();
  const inquiry = await prisma.contactInquiry.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    },
  });

  await enqueueNotification({
    channel: "EMAIL",
    template: "CONTACT_INQUIRY",
    recipient: brand.contact.email,
    idempotencyKey: `contact:${inquiry.id}`,
    payload: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      message: input.message,
    },
  });

  return inquiry;
}
