"use client";

import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { Button } from "@/components/ui/button";
import { conversations } from "@/data/mock/conversations";
import { useToast } from "@/components/providers/toast-provider";
import { brand } from "@/lib/brand";
import { Icons } from "@/components/icons";

export default function AdminMessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [filter, setFilter] = useState("All");
  const [messages, setMessages] = useState(conversations[0]?.messages || []);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const { showToast } = useToast();

  const filters = ["All", "Unread", "Buying", "Rentals", "Site visits"];

  const filtered = conversations.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Unread") return c.unread;
    const tagMap: Record<string, string> = {
      Buying: "buying_enquiry",
      Rentals: "rental_enquiry",
      "Site visits": "site_visit",
    };
    return c.tags.includes(tagMap[filter] as (typeof c.tags)[number]);
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
      <h1 className="font-serif text-2xl sm:text-3xl">Dealer inbox</h1>
      <p className="mt-1 text-sm text-muted">
        Enquiries from buyers and tenants across your listings.
      </p>

      <div className="relative mt-6 flex h-[calc(100vh-180px)] min-h-[440px] overflow-hidden rounded-xl border border-border bg-surface">
        <div
          className={`w-full shrink-0 border-r border-border md:block md:w-80 ${mobileShowChat ? "hidden md:block" : "block"}`}
        >
          <ConversationList
            conversations={filtered}
            activeId={activeId}
            filters={filters}
            activeFilter={filter}
            onFilterChange={setFilter}
            onSelect={handleSelect}
            perspective="dealer"
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
                    className="mb-1 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground md:hidden"
                  >
                    <Icons.ArrowLeft className="h-4 w-4" aria-hidden />
                    Conversations
                  </button>
                  <p className="truncate font-medium">{active.guestName}</p>
                  <p className="truncate text-xs text-muted">{active.propertyName}</p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("Site visit proposed (demo)", "info")}
                  >
                    Propose visit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("Brochure shared (demo)", "success")}
                  >
                    Share brochure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("Docs requested (demo)", "info")}
                  >
                    Request docs
                  </Button>
                </div>
              </div>
              <div className="min-h-0 flex-1">
                <ChatWindow
                  messages={messages}
                  placeholder="Reply as dealer…"
                  onAttach={(msg) =>
                    setMessages((prev) => [
                      ...prev,
                      {
                        ...msg,
                        senderId: "dealer",
                        senderName: brand.hostName,
                        senderRole: "dealer",
                      },
                    ])
                  }
                  onSend={(content) => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `new-${Date.now()}`,
                        senderId: "dealer",
                        senderName: brand.hostName,
                        senderRole: "dealer",
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
