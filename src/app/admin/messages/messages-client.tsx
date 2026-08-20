"use client";

import { useState } from "react";
import { ConversationList } from "@/components/chat/conversation-list";
import { ConversationThread } from "@/components/chat/conversation-thread";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/server/dto/domain.dto";
import { useToast } from "@/components/providers/toast-provider";
import {
  confirmDirectFromConversationAction,
  requestGuestIdAction,
  sendBookingInfoAction,
} from "@/app/actions/payment.actions";
import { useRouter } from "next/navigation";

const filters = ["All", "Unread", "Booking inquiry", "Upcoming stay", "ID requested", "Direct payment"];

export function AdminMessagesClient({
  conversations,
  bookingRefs,
}: {
  conversations: Conversation[];
  bookingRefs: Record<string, string>;
}) {
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [filter, setFilter] = useState("All");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

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

  const active = conversations.find((c) => c.id === activeId);

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
            onSelect={(id) => {
              setActiveId(id);
              setMobileShowChat(true);
            }}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const result = await requestGuestIdAction(active.id);
                      if (result.ok) {
                        showToast("ID requested", "info");
                        router.refresh();
                      } else {
                        showToast(result.error, "error");
                      }
                    }}
                  >
                    Request ID
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const result = await sendBookingInfoAction(active.id);
                      if (result.ok) {
                        showToast("Booking details sent", "success");
                      } else {
                        showToast(result.error, "error");
                      }
                    }}
                  >
                    Send booking info
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const result = await confirmDirectFromConversationAction(active.id);
                      if (result.ok) {
                        showToast("Payment confirmed", "success");
                        router.refresh();
                      } else {
                        showToast(result.error, "error");
                      }
                    }}
                  >
                    Confirm payment
                  </Button>
                </div>
              </div>
              <div className="min-h-0 flex-1">
                <ConversationThread
                  key={active.id}
                  conversation={active}
                  bookingReference={bookingRefs[active.id]}
                  showIdUpload
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
