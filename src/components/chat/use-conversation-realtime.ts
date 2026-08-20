"use client";

import { useEffect, useRef } from "react";
import { loadMessagesAction } from "@/app/actions/payment.actions";
import type { ChatMessage } from "@/server/dto/domain.dto";

/** Polls for new messages over authenticated server actions (no public Realtime). */
export function useConversationRealtime(
  conversationId: string,
  onMessage: (message: ChatMessage) => void,
) {
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!conversationId) return;

    const poll = async () => {
      const page = await loadMessagesAction(conversationId);
      if (!page.ok) return;
      for (const message of page.messages) {
        if (!seenRef.current.has(message.id)) {
          seenRef.current.add(message.id);
          if (seenRef.current.size > 1) {
            onMessage(message);
          }
        }
      }
      if (seenRef.current.size === 0) {
        for (const message of page.messages) {
          seenRef.current.add(message.id);
        }
      }
    };

    void poll();
    const id = window.setInterval(poll, 5000);
    return () => window.clearInterval(id);
  }, [conversationId, onMessage]);
}
