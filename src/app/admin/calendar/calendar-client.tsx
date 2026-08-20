"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import type { CalendarEvent } from "@/server/services/calendar-events.service";
import type { PublicPropertyDto } from "@/server/dto/public.dto";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";
import { blockDatesAction, unblockDatesAction } from "@/app/actions/booking.actions";

type View = "month" | "week" | "list";
type EventType = CalendarEvent["type"];

const typeColors: Record<EventType, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  blocked: "bg-stone-200 text-stone-700",
  external: "bg-slate-200 text-slate-700",
  checkin: "bg-blue-100 text-blue-800",
  checkout: "bg-purple-100 text-purple-800",
};

function inRange(date: string, start: string, end: string) {
  return date >= start && date < end;
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isManualBlock(event: CalendarEvent) {
  return event.type === "blocked" && event.id.startsWith("block-");
}

function blockIdFromEvent(event: CalendarEvent) {
  return event.id.replace(/^block-/, "");
}

export function AdminCalendarClient({
  events,
  properties,
}: {
  events: CalendarEvent[];
  properties: PublicPropertyDto[];
}) {
  const [view, setView] = useState<View>("month");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [blockModal, setBlockModal] = useState(false);
  const [anchor] = useState(() => new Date());
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const filtered = useMemo(
    () => events.filter((e) => propertyFilter === "all" || e.propertyId === propertyFilter),
    [events, propertyFilter],
  );

  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const monthLabel = anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const weekDays = useMemo(() => {
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - anchor.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [anchor]);

  const eventsForDateKey = (dateKey: string) =>
    filtered.filter((e) =>
      e.type === "checkin" || e.type === "checkout"
        ? e.start === dateKey
        : inRange(dateKey, e.start, e.end) || e.start === dateKey,
    );

  const handleUnblock = async (event: CalendarEvent) => {
    const blockId = blockIdFromEvent(event);
    setUnblockingId(blockId);
    const result = await unblockDatesAction(blockId);
    setUnblockingId(null);
    if (result.ok) {
      showToast("Block removed", "success");
      router.refresh();
    } else {
      showToast(result.error, "error");
    }
  };

  const weekLabel = `${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm text-muted">{monthLabel} · bookings and blocks</p>
        </div>
        <Button onClick={() => setBlockModal(true)}>Block dates</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-border">
          {(["month", "week", "list"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-2 text-sm capitalize transition-colors",
                view === v ? "bg-foreground text-background" : "text-muted hover:text-foreground",
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="search-input w-auto"
        >
          <option value="all">All properties</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {view === "list" && (
        <div className="mt-6 space-y-3">
          {filtered.length === 0 && (
            <p className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted">
              No calendar events for this filter.
            </p>
          )}
          {filtered.map((event) => (
            <div
              key={event.id}
              className={cn(
                "flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between",
                typeColors[event.type],
              )}
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm opacity-80">
                  {event.start} → {event.end}
                  {event.notes ? ` · ${event.notes}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isManualBlock(event) && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={unblockingId === blockIdFromEvent(event)}
                    onClick={() => handleUnblock(event)}
                  >
                    Unblock
                  </Button>
                )}
                <span className="text-xs font-medium uppercase">{event.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "month" && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-3 sm:p-6">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2 font-medium">{d}</div>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const evs = eventsForDateKey(dateKey);
              return (
                <div key={day} className="min-h-16 rounded-lg border border-transparent p-1 text-left sm:min-h-24">
                  <p className="text-xs font-medium">{day}</p>
                  {evs.slice(0, 2).map((e) => (
                    <p key={e.id} className={cn("mt-0.5 truncate rounded px-1 py-0.5 text-[10px]", typeColors[e.type])}>
                      {e.title}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-3 sm:p-6">
          <p className="mb-4 text-center text-sm text-muted">Week of {weekLabel}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
            {weekDays.map((day) => {
              const dateKey = formatDateKey(day);
              const dayEvents = eventsForDateKey(dateKey);
              return (
                <div key={dateKey} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">
                    {day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <div className="mt-2 space-y-1">
                    {dayEvents.length === 0 && <p className="text-xs text-muted">Open</p>}
                    {dayEvents.map((e) => (
                      <div key={e.id} className="space-y-1">
                        <p className={cn("rounded px-2 py-1 text-xs", typeColors[e.type])}>{e.title}</p>
                        {isManualBlock(e) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-full text-xs"
                            disabled={unblockingId === blockIdFromEvent(e)}
                            onClick={() => handleUnblock(e)}
                          >
                            Unblock
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {Object.entries(typeColors).map(([type, color]) => (
          <span key={type} className={cn("rounded-md px-2 py-1 capitalize", color)}>{type}</span>
        ))}
      </div>

      <Modal open={blockModal} onClose={() => setBlockModal(false)} title="Block dates">
        <form
          className="space-y-4"
          action={async (formData) => {
            const result = await blockDatesAction(formData);
            if (result.ok) {
              showToast("Dates blocked", "success");
              setBlockModal(false);
              router.refresh();
            } else {
              showToast(result.error, "error");
            }
          }}
        >
          <div>
            <label className="text-sm font-medium" htmlFor="block-property">Property</label>
            <select id="block-property" name="propertyId" className="search-input mt-1" required>
              {properties.length === 0 && <option value="">No properties</option>}
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start date" name="start" type="date" required />
            <Input label="End date" name="end" type="date" required />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="block-reason">Reason</label>
            <select id="block-reason" name="reason" className="search-input mt-1">
              <option value="PERSONAL_USE">Personal use</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="EXTERNAL_BOOKING">External booking</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <Input label="Notes" name="notes" placeholder="Optional notes" />
          <Button type="submit" fullWidth disabled={properties.length === 0}>Block dates</Button>
        </form>
      </Modal>
    </div>
  );
}
