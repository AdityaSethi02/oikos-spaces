import { requireAdminHost } from "@/server/policies/auth.policy";
import { listConversationsForUser, getLinkedBookingReference } from "@/server/services/chat.service";
import { MessagesPageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminMessagesClient } from "./messages-client";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  if (!isDatabaseConfigured) {
    return <MessagesPageSkeleton />;
  }

  const admin = await requireAdminHost();
  const conversations = await listConversationsForUser(admin);
  const bookingRefs: Record<string, string> = {};
  await Promise.all(
    conversations.map(async (conversation) => {
      const reference = await getLinkedBookingReference(admin, conversation.id);
      if (reference) bookingRefs[conversation.id] = reference;
    }),
  );
  return <AdminMessagesClient conversations={conversations} bookingRefs={bookingRefs} />;
}
