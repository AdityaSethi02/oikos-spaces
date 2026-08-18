"use client";

import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { Button } from "@/components/ui/button";
import { conversations } from "@/data/mock/conversations";
import { useToast } from "@/components/providers/toast-provider";
import { brand } from "@/lib/brand";

export default function AdminMessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [filter, setFilter] = useState("All");
  const [messages, setMessages] = useState(conversations[0]?.messages || []);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const { showToast } = useToast();

  const filters = ["All", "Unread", "Booking inquiry", "Upcoming stay", "ID requested", "Direct payment"];

  const filtered = conversations.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Unread") return c.unread;
    const tagMap: Record<string, string> = {
      "Booking inquiry": "booking_inquiry",
      "Upcoming stay": "upcoming_stay",
      "ID requested": "id_requested",
      "Direct payment": "direct_payment",
    };
    return c.tags.includes(tagMap[filter] as typeof c.tags[number]);
  });

  const active = conversations.find((c) => c.id === activeId);

  const handleSelect = (id: string) => {
    setActiveId(id);
    const conv = conversations.find((c) => c.id === id);
    setMessages(conv?.messages || []);
    setMobileShowChat(true);
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Messages</h1>

      <div className="relative mt-6 flex h-[calc(100vh-180px)] min-h-[440px] overflow-hidden rounded-xl border border-border bg-surface">
        <div className={`w-full shrink-0 border-r border-border md:block md:w-80 ${mobileShowChat ? "hidden md:block" : "block"}`}>
          <ConversationList
            conversations={filtered}
            activeId={activeId}
            filters={filters}
            activeFilter={filter}
            onFilterChange={setFilter}
            onSelect={handleSelect}
          />
        </div>

        <div className={`min-w-0 flex-1 flex-col ${mobileShowChat ? "flex" : "hidden md:flex"}`}>
          {active ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="mb-1 text-sm text-muted hover:text-foreground md:hidden"
                  >
                    ← Conversations
                  </button>
                  <p className="truncate font-medium">{active.guestName}</p>
                  <p className="truncate text-xs text-muted">{active.propertyName}</p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => showToast("ID requested (demo)", "info")}>
                    Request ID
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => showToast("Booking details sent (demo)", "success")}>
                    Send booking info
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => showToast("Payment confirmed (demo)", "success")}>
                    Confirm payment
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => showToast("Dates blocked (demo)", "info")}>
                    Block dates
                  </Button>
                </div>
              </div>
              <div className="min-h-0 flex-1">
                <ChatWindow
                  messages={messages}
                  showIdUpload
                  onAttach={(msg) => setMessages((prev) => [...prev, msg])}
                  onSend={(content) => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `new-${Date.now()}`,
                        senderId: "host",
                        senderName: brand.hostName,
                        senderRole: "host",
                        type: "text",
                        content,
                        timestamp: new Date().toISOString(),
                      },
                    ]);
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
