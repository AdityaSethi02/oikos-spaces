"use client";

import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import { EmptyState } from "@/components/feedback/empty-state";
import { conversations } from "@/data/mock/conversations";

export default function MessagesPage() {
  const [filter, setFilter] = useState("All");
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

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl">Messages</h1>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface md:flex md:h-[calc(100vh-280px)] md:min-h-[400px]">
          <div className="w-full md:w-80 md:shrink-0 md:border-r md:border-border">
            {filtered.length === 0 ? (
              <EmptyState
                title="No conversations"
                description="Inquiries and booking messages will appear here."
                className="m-4 border-0"
              />
            ) : (
              <ConversationList
                conversations={filtered}
                filters={filters}
                activeFilter={filter}
                onFilterChange={setFilter}
              />
            )}
          </div>
          <div className="hidden flex-1 items-center justify-center md:flex">
            <EmptyState
              title="Select a conversation"
              description="Choose a conversation from the list to view messages."
              className="border-0 shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
