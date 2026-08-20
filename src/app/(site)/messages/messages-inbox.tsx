"use client";

import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import type { Conversation } from "@/server/dto/domain.dto";

const filters = ["All", "Unread", "Booking inquiry", "Upcoming stay", "ID requested", "Direct payment"];

export function MessagesInbox({ conversations }: { conversations: Conversation[] }) {
  const [filter, setFilter] = useState("All");

  const filtered = conversations.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Unread") return c.unread;
    const tagMap: Record<string, string> = {
      "Booking inquiry": "booking_inquiry",
      "Upcoming stay": "upcoming_stay",
      "ID requested": "id_requested",
      "Direct payment": "direct_payment",
    };
    return c.tags.includes(tagMap[filter] as (typeof c.tags)[number]);
  });

  return (
    <div className="w-full md:w-80 md:shrink-0 md:border-r md:border-border">
      <ConversationList
        conversations={filtered}
        filters={filters}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
