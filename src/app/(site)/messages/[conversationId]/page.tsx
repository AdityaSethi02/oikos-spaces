"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { conversations, getConversationById } from "@/data/mock/conversations";
import { useToast } from "@/components/providers/toast-provider";
import { brand } from "@/lib/brand";
import { Icons } from "@/components/icons";

export default function ConversationPage() {
  const params = useParams();
  const { showToast } = useToast();
  const convId = params.conversationId as string;
  const conversation = getConversationById(convId);
  const [messages, setMessages] = useState(conversation?.messages || []);

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

  const handleSend = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        senderId: "buyer",
        senderName: "You",
        senderRole: "buyer" as const,
        type: "text" as const,
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
    showToast("Message sent to dealer (demo)", "success");
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col lg:h-[calc(100dvh-4.5rem)]">
      <div className="border-b border-border px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/messages"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
          >
            <Icons.ArrowLeft className="h-4 w-4" aria-hidden />
            Messages
          </Link>
          <div className="min-w-0">
            <p className="truncate font-medium">{conversation.propertyName}</p>
            <p className="truncate text-xs text-muted">
              {brand.hostName} · typically replies within 1 hr
            </p>
          </div>
          <Link
            href={`/properties/${conversation.propertySlug}`}
            className="ml-auto shrink-0 text-sm text-accent hover:underline"
          >
            View listing
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden w-80 shrink-0 border-r border-border md:block">
          <ConversationList conversations={conversations} activeId={convId} />
        </div>
        <div className="min-h-0 min-w-0 flex-1">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            placeholder="Ask about price, visit, or paperwork…"
            quickReplies={[
              "Is this still available?",
              "Can we schedule a site visit?",
              "What's the best price?",
            ]}
            onAttach={(msg) => {
              setMessages((prev) => [
                ...prev,
                { ...msg, senderRole: "buyer", senderName: "You" },
              ]);
              showToast("Attachment sent (demo)", "success");
            }}
          />
        </div>
      </div>
    </div>
  );
}
