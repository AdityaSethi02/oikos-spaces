import { describe, expect, it } from "vitest";
import { formatIcalCalendar, parseIcalEvents } from "@/server/integrations/calendar/ical";

describe("iCal parse/export", () => {
  it("round-trips all-day events", () => {
    const ics = formatIcalCalendar([
      {
        uid: "evt-1@oikos",
        start: "2026-10-02",
        end: "2026-10-05",
        summary: "Blocked",
      },
    ]);
    const events = parseIcalEvents(ics);
    expect(events).toEqual([
      { uid: "evt-1@oikos", start: "2026-10-02", end: "2026-10-05", summary: "Blocked" },
    ]);
  });

  it("skips invalid ranges", () => {
    const events = parseIcalEvents(`BEGIN:VCALENDAR
BEGIN:VEVENT
UID:bad
DTSTART;VALUE=DATE:20261005
DTEND;VALUE=DATE:20261005
END:VEVENT
END:VCALENDAR`);
    expect(events).toEqual([]);
  });
});
