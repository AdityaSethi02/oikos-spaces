"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/data/mock/conversations";

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  basePath?: string;
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  onSelect?: (id: string) => void;
  /** buyer: show property name; dealer: show enquirer name */
  perspective?: "buyer" | "dealer";
}

export function ConversationList({
  conversations,
  activeId,
  basePath = "/messages",
  filters,
  activeFilter,
  onFilterChange,
  onSelect,
  perspective = "buyer",
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      {filters && onFilterChange && (
        <div className="flex gap-2 overflow-x-auto border-b border-border p-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-xs font-medium transition-colors min-h-11",
                activeFilter === f
                  ? "bg-foreground text-background"
                  : "bg-background text-muted hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <ul className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <li key={conv.id}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "block w-full border-b border-border px-4 py-4 text-left transition-colors hover:bg-background",
                  activeId === conv.id && "bg-accent-light/40",
                )}
              >
                <ConversationItem conv={conv} perspective={perspective} />
              </button>
            ) : (
              <Link
                href={`${basePath}/${conv.id}`}
                className={cn(
                  "block border-b border-border px-4 py-4 transition-colors hover:bg-background",
                  activeId === conv.id && "bg-accent-light/40",
                )}
              >
                <ConversationItem conv={conv} perspective={perspective} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConversationItem({
  conv,
  perspective,
}: {
  conv: Conversation;
  perspective: "buyer" | "dealer";
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-foreground">
          {perspective === "dealer" ? conv.guestName : conv.propertyName}
        </p>
        {conv.unread && (
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted">
        {perspective === "dealer" ? conv.propertyName : "Dealer Desk"}
      </p>
      <p className="mt-2 line-clamp-1 text-sm text-muted">{conv.lastMessage}</p>
    </>
  );
}
