"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChatWindow } from "@/components/chat/chat-window";
import { createEnquiryConversation } from "@/data/mock/conversations";
import { useToast } from "@/components/providers/toast-provider";
import { brand } from "@/lib/brand";
import { Icons } from "@/components/icons";

export function NewEnquiryContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("property") || "";
  const { showToast } = useToast();

  const seed = useMemo(() => createEnquiryConversation(slug), [slug]);
  const [messages, setMessages] = useState(seed?.messages || []);

  if (!seed) {
    return (
      <div className="container-page section-padding text-center">
        <p className="text-muted">We couldn&apos;t find that listing.</p>
        <Link href="/properties" className="mt-4 inline-block text-accent hover:underline">
          Browse properties
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
            <p className="truncate font-medium">{seed.propertyName}</p>
            <p className="truncate text-xs text-muted">New chat with {brand.hostName}</p>
          </div>
          <Link
            href={`/properties/${seed.propertySlug}`}
            className="ml-auto shrink-0 text-sm text-accent hover:underline"
          >
            View listing
          </Link>
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1">
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          placeholder="Ask about price, paperwork, or a site visit…"
          quickReplies={[
            "Is this still available?",
            "Can we schedule a site visit?",
            "Share more photos please",
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
  );
}
