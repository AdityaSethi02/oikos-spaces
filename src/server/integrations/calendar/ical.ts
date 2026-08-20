export type IcalEvent = {
  uid: string;
  start: string;
  end: string;
  summary?: string;
};

function unfold(raw: string): string[] {
  return raw.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").split("\n");
}

function unescapeIcal(value: string) {
  return value.replace(/\\n/g, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";");
}

function parseIcalDate(value: string): string | null {
  const compact = value.trim();
  if (/^\d{8}$/.test(compact)) {
    return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
  }
  const dateTime = compact.match(/^(\d{4})(\d{2})(\d{2})T/);
  if (dateTime) {
    return `${dateTime[1]}-${dateTime[2]}-${dateTime[3]}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(compact)) {
    return compact.slice(0, 10);
  }
  return null;
}

export function parseIcalEvents(raw: string): IcalEvent[] {
  const lines = unfold(raw);
  const events: IcalEvent[] = [];
  let current: Partial<IcalEvent> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current?.uid && current.start && current.end) {
        events.push({
          uid: current.uid,
          start: current.start,
          end: current.end,
          summary: current.summary,
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;
    const split = line.indexOf(":");
    if (split < 0) continue;
    const key = line.slice(0, split).split(";")[0].toUpperCase();
    const value = unescapeIcal(line.slice(split + 1));
    if (key === "UID") current.uid = value;
    if (key === "SUMMARY") current.summary = value;
    if (key === "DTSTART") current.start = parseIcalDate(value) ?? current.start;
    if (key === "DTEND") current.end = parseIcalDate(value) ?? current.end;
  }

  return events.filter((event) => event.start < event.end);
}

export function formatIcalCalendar(events: Array<{
  uid: string;
  start: string;
  end: string;
  summary: string;
}>): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OIKOS Spaces//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${event.start.replaceAll("-", "")}`,
      `DTEND;VALUE=DATE:${event.end.replaceAll("-", "")}`,
      `SUMMARY:${event.summary.replace(/[,;\\]/g, " ")}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
