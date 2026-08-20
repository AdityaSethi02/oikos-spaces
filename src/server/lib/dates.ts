const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnly(value: string): boolean {
  return DATE_RE.test(value);
}

export function parseDateOnly(value: string): Date {
  if (!isDateOnly(value)) {
    throw new Error(`Invalid date: ${value}`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateOnly: string, days: number): string {
  const date = parseDateOnly(dateOnly);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateOnly(date);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseDateOnly(checkIn).getTime();
  const end = parseDateOnly(checkOut).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export function eachNight(checkIn: string, checkOut: string): string[] {
  const nights: string[] = [];
  let cursor = checkIn;
  while (cursor < checkOut) {
    nights.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return nights;
}

export function isWeekendUtc(dateOnly: string): boolean {
  const day = parseDateOnly(dateOnly).getUTCDay();
  return day === 0 || day === 6;
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function todayInTimeZone(timeZone = "Asia/Kolkata"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function datesInRangeExclusive(start: string, end: string): string[] {
  return eachNight(start, end);
}
