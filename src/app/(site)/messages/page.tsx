"use client";

import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import { EmptyState } from "@/components/feedback/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { conversations } from "@/data/mock/conversations";

export default function MessagesPage() {
  const [filter, setFilter] = useState("All");
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

  return (
    <div className="section-padding">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl">Messages</h1>
            <p className="mt-2 text-muted">
              Chat with our dealers about listings you&apos;re interested in.
            </p>
          </div>
          <ButtonLink href="/properties" variant="outline" size="sm">
            Browse properties
          </ButtonLink>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface md:flex md:h-[calc(100vh-280px)] md:min-h-[400px]">
          <div className="w-full md:w-80 md:shrink-0 md:border-r md:border-border">
            {filtered.length === 0 ? (
              <EmptyState
                title="No conversations yet"
                description="Open a listing and tap Message dealer to start a chat."
                actionLabel="Browse properties"
                actionHref="/properties"
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
              description="Choose a chat to continue with the dealer."
              className="border-0 shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
