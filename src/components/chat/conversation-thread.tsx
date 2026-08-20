"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatWindow } from "@/components/chat/chat-window";
import { useConversationRealtime } from "@/components/chat/use-conversation-realtime";
import { useToast } from "@/components/providers/toast-provider";
import type { ChatMessage, Conversation } from "@/server/dto/domain.dto";
import {
  loadMessagesAction,
  loadOlderMessagesAction,
  sendChatMessageAction,
} from "@/app/actions/payment.actions";
import { uploadGuestDocument } from "@/lib/upload-guest-document";

export function ConversationThread({
  conversation,
  bookingReference,
  showIdUpload = false,
}: {
  conversation: Conversation;
  bookingReference?: string;
  showIdUpload?: boolean;
}) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadingOlder, setLoadingOlder] = useState(false);

  const appendUnique = useCallback((incoming: ChatMessage) => {
    setMessages((prev) => (prev.some((item) => item.id === incoming.id) ? prev : [...prev, incoming]));
  }, []);

  useConversationRealtime(conversation.id, appendUnique);

  useEffect(() => {
    let cancelled = false;
    void loadMessagesAction(conversation.id).then((result) => {
      if (cancelled || !result.ok) return;
      setMessages(result.messages);
      setHasMore(result.hasMore);
      setCursor(result.nextCursor);
    });
    return () => {
      cancelled = true;
    };
  }, [conversation.id]);

  return (
    <ChatWindow
      messages={messages}
      hasMore={hasMore}
      loadingOlder={loadingOlder}
      showIdUpload={showIdUpload}
      onLoadOlder={async () => {
        if (!cursor || loadingOlder) return;
        setLoadingOlder(true);
        const result = await loadOlderMessagesAction({
          conversationId: conversation.id,
          cursor,
        });
        setLoadingOlder(false);
        if (!result.ok) {
          showToast(result.error, "error");
          return;
        }
        setMessages((prev) => [...result.messages, ...prev]);
        setHasMore(result.hasMore);
        setCursor(result.nextCursor);
      }}
      onSend={async (body) => {
        const result = await sendChatMessageAction({ conversationId: conversation.id, body });
        if (!result.ok) {
          showToast(result.error, "error");
          return;
        }
        appendUnique(result.message);
      }}
      onUploadFile={
        bookingReference
          ? async (file) => {
              const result = await uploadGuestDocument({
                file,
                bookingReference,
                conversationId: conversation.id,
              });
              if (!result.ok) {
                showToast(result.error, "error");
                return;
              }
              const page = await loadMessagesAction(conversation.id);
              if (page.ok) {
                setMessages(page.messages);
                setHasMore(page.hasMore);
                setCursor(page.nextCursor);
              }
            }
          : undefined
      }
    />
  );
}
