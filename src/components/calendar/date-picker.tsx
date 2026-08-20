"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  checkIn: string;
  checkOut: string;
  onSelect: (checkIn: string, checkOut: string) => void;
  unavailableDates?: string[];
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function DatePicker({
  checkIn,
  checkOut,
  onSelect,
  unavailableDates = [],
  className,
}: DatePickerProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selecting, setSelecting] = useState<"in" | "out">("in");

  const blocked = new Set(unavailableDates);

  const handleDayClick = (day: number) => {
    const dateStr = formatDateStr(viewYear, viewMonth, day);
    if (blocked.has(dateStr)) return;

    if (selecting === "in" || !checkIn || (checkIn && checkOut)) {
      onSelect(dateStr, "");
      setSelecting("out");
    } else {
      if (new Date(dateStr) <= new Date(checkIn)) {
        onSelect(dateStr, "");
        setSelecting("out");
      } else {
        onSelect(checkIn, dateStr);
        setSelecting("in");
      }
    }
  };

  const isInRange = (dateStr: string) => {
    if (!checkIn || !checkOut) return false;
    const d = new Date(dateStr);
    return d > new Date(checkIn) && d < new Date(checkOut);
  };

  const renderMonth = (monthOffset: number) => {
    const month = (viewMonth + monthOffset) % 12;
    const year = viewYear + Math.floor((viewMonth + monthOffset) / 12);
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    return (
      <div key={`${year}-${month}`} className="min-w-0 flex-1">
        <h3 className="mb-3 text-center text-sm font-medium">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-1 text-xs font-medium text-muted">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDateStr(year, month, day);
            const isUnavailable = blocked.has(dateStr);
            const isCheckIn = dateStr === checkIn;
            const isCheckOut = dateStr === checkOut;
            const inRange = isInRange(dateStr);
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <button
                key={day}
                type="button"
                disabled={isUnavailable}
                onClick={() => {
                  setViewMonth(month);
                  setViewYear(year);
                  handleDayClick(day);
                }}
                className={cn(
                  "relative flex h-11 w-full items-center justify-center rounded-full text-sm transition-colors sm:h-9",
                  isUnavailable && "text-muted-foreground/40 line-through cursor-not-allowed",
                  !isUnavailable && !isCheckIn && !isCheckOut && !inRange && "hover:bg-background",
                  inRange && "bg-accent-light/60 rounded-none",
                  isCheckIn && "bg-foreground text-background font-medium",
                  isCheckOut && "bg-foreground text-background font-medium",
                  isToday && !isCheckIn && !isCheckOut && "ring-1 ring-accent/40",
                )}
                aria-label={`${MONTH_NAMES[month]} ${day}, ${year}${isUnavailable ? ", unavailable" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-background"
          aria-label="Previous month"
        >
          <Icons.ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-background"
          aria-label="Next month"
        >
          <Icons.ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {renderMonth(0)}
        <div className="hidden lg:block">{renderMonth(1)}</div>
      </div>
      {checkIn && checkOut && (
        <p className="mt-4 text-center text-sm text-muted">
          {Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24),
          )}{" "}
          nights selected
        </p>
      )}
    </div>
  );
}
