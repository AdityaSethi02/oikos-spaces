import Link from "next/link";
import { ConversationList } from "@/components/chat/conversation-list";
import { ConversationThread } from "@/components/chat/conversation-thread";
import { MessagesPageSkeleton } from "@/components/feedback/data-skeletons";
import { requireAuthUser } from "@/server/policies/auth.policy";
import {
  getConversationForUser,
  getLinkedBookingReference,
  listConversationsForUser,
} from "@/server/services/chat.service";
import { isDatabaseConfigured } from "@/lib/env";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  if (!isDatabaseConfigured) {
    return <MessagesPageSkeleton />;
  }

  const { conversationId } = await params;
  const user = await requireAuthUser();
  const conversations = await listConversationsForUser(user);

  try {
    await getConversationForUser(user, conversationId);
  } catch {
    return (
      <div className="container-page section-padding text-center">
        <p>Conversation not found</p>
        <Link href="/messages" className="mt-4 inline-block text-accent hover:underline">
          Back to messages
        </Link>
      </div>
    );
  }

  const conversation = conversations.find((item) => item.id === conversationId);
  if (!conversation) {
    return (
      <div className="container-page section-padding text-center">
        <p>Conversation not found</p>
        <Link href="/messages" className="mt-4 inline-block text-accent hover:underline">
          Back to messages
        </Link>
      </div>
    );
  }
  const bookingReference = await getLinkedBookingReference(user, conversationId);

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col lg:h-[calc(100dvh-4.5rem)]">
      <div className="border-b border-border px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="text-sm text-muted hover:text-foreground">
            ← Messages
          </Link>
          <div className="min-w-0">
            <p className="truncate font-medium">{conversation.propertyName}</p>
            <p className="truncate text-xs text-muted">Conversation with host</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden w-80 shrink-0 border-r border-border md:block">
          <ConversationList conversations={conversations} activeId={conversationId} />
        </div>
        <div className="min-h-0 min-w-0 flex-1">
          <ConversationThread
            conversation={conversation}
            bookingReference={bookingReference}
            showIdUpload
          />
        </div>
      </div>
    </div>
  );
}
