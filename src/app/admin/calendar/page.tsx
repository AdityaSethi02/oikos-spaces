"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { calendarEvents } from "@/data/mock/admin";
import { properties } from "@/data/mock/properties";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

type View = "month" | "week" | "list";
type EventType = "confirmed" | "pending" | "blocked" | "checkin" | "checkout";

const typeColors: Record<EventType, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  blocked: "bg-stone-200 text-stone-700",
  checkin: "bg-blue-100 text-blue-800",
  checkout: "bg-purple-100 text-purple-800",
};

function inRange(date: string, start: string, end: string) {
  return date >= start && date < end;
}

export default function AdminCalendarPage() {
  const [view, setView] = useState<View>("month");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [blockModal, setBlockModal] = useState(false);
  const [anchor] = useState(new Date(2026, 8, 1));
  const { showToast } = useToast();

  const filtered = useMemo(
    () => calendarEvents.filter((e) => propertyFilter === "all" || e.propertyId === propertyFilter),
    [propertyFilter],
  );

  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const weekStart = 14;
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i);

  const eventsForDay = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filtered.filter((e) => (e.type === "checkin" || e.type === "checkout" ? e.start === date : inRange(date, e.start, e.end) || e.start === date));
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm text-muted">September 2026 · demo bookings and blocks</p>
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
          {filtered.map((event) => (
            <div key={event.id} className={cn("flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between", typeColors[event.type])}>
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm opacity-80">
                  {event.start} → {event.end}
                  {"reason" in event && event.reason ? ` · ${event.reason}` : ""}
                </p>
              </div>
              <span className="text-xs font-medium uppercase">{event.type}</span>
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
              const evs = eventsForDay(day);
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
          <p className="mb-4 text-center text-sm text-muted">Week of Sep {weekStart}–{weekStart + 6}, 2026</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
            {weekDays.map((day) => (
              <div key={day} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium">Sep {day}</p>
                <div className="mt-2 space-y-1">
                  {eventsForDay(day).length === 0 && <p className="text-xs text-muted">Open</p>}
                  {eventsForDay(day).map((e) => (
                    <p key={e.id} className={cn("rounded px-2 py-1 text-xs", typeColors[e.type])}>{e.title}</p>
                  ))}
                </div>
              </div>
            ))}
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
          onSubmit={(e) => {
            e.preventDefault();
            showToast("Dates blocked (demo)", "success");
            setBlockModal(false);
          }}
        >
          <div>
            <label className="text-sm font-medium" htmlFor="block-property">Property</label>
            <select id="block-property" className="search-input mt-1">
              {properties.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start date" type="date" />
            <Input label="End date" type="date" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="block-reason">Reason</label>
            <select id="block-reason" className="search-input mt-1">
              <option>Personal use</option>
              <option>Maintenance</option>
              <option>External booking</option>
              <option>Other</option>
            </select>
          </div>
          <Input label="Notes" placeholder="Optional notes" />
          <Button type="submit" fullWidth>Block dates</Button>
        </form>
      </Modal>
    </div>
  );
}
