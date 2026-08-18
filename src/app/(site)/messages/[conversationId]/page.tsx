"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { conversations, getConversationById } from "@/data/mock/conversations";
import { useToast } from "@/components/providers/toast-provider";

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
        senderId: "guest",
        senderName: "You",
        senderRole: "guest" as const,
        type: "text" as const,
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
    showToast("Message sent (demo)", "success");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-5rem)]">
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
          <ConversationList conversations={conversations} activeId={convId} />
        </div>
        <div className="min-h-0 min-w-0 flex-1">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            showIdUpload
            onAttach={(msg) => {
              setMessages((prev) => [...prev, msg]);
              showToast("Attachment added (demo)", "success");
            }}
          />
        </div>
      </div>
    </div>
  );
}
