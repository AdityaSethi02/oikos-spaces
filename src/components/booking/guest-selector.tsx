"use client";

import { Select } from "@/components/ui/select";

interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  id?: string;
}

export function GuestSelector({
  value,
  onChange,
  min = 1,
  max = 8,
  label = "Guests",
  id = "guests",
}: GuestSelectorProps) {
  return (
    <Select
      id={id}
      label={label}
      value={String(value)}
      onChange={(v) => onChange(Number(v))}
      options={Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => ({
        value: String(n),
        label: `${n} guest${n !== 1 ? "s" : ""}`,
      }))}
    />
  );
}
