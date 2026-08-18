"use client";

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
    <div>
      <label htmlFor={id} className="text-xs font-medium text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="search-input mt-1"
      >
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
          <option key={n} value={n}>
            {n} guest{n !== 1 ? "s" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
