"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
  required?: boolean;
  name?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  label,
  id,
  "aria-label": ariaLabel,
  className,
  required,
  name,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listId = `${selectId}-listbox`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 block text-xs font-medium text-muted"
        >
          {label}
        </label>
      )}
      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}
      <button
        id={selectId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel || label || placeholder}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "search-input flex cursor-pointer items-center justify-between gap-2 text-left",
          !selected && "text-muted-foreground",
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <Icons.ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={selectId}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface py-1 shadow-soft"
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "flex w-full cursor-pointer items-center px-3 py-2.5 text-left text-sm transition-colors",
                    "hover:bg-accent-light hover:text-accent",
                    isActive && "bg-accent-light font-medium text-accent",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
