import { EmptyState } from "@/components/feedback/empty-state";
import { MessagesPageSkeleton } from "@/components/feedback/data-skeletons";
import { MessagesInbox } from "./messages-inbox";
import { requireAuthUser } from "@/server/policies/auth.policy";
import { listConversationsForUser } from "@/server/services/chat.service";
import { isDatabaseConfigured } from "@/lib/env";

export default async function MessagesPage() {
  if (!isDatabaseConfigured) {
    return <MessagesPageSkeleton />;
  }

  const user = await requireAuthUser();
  const conversations = await listConversationsForUser(user);
  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl">Messages</h1>
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface md:flex md:h-[calc(100vh-280px)] md:min-h-[400px]">
          {conversations.length === 0 ? (
            <EmptyState
              title="No conversations"
              description="Inquiries and booking messages will appear here."
              className="m-4 border-0"
            />
          ) : (
            <MessagesInbox conversations={conversations} />
          )}
          {conversations.length > 0 && (
            <div className="hidden flex-1 items-center justify-center md:flex">
              <EmptyState
                title="Select a conversation"
                description="Choose a conversation from the list to view messages."
                className="border-0 shadow-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
