import { cn } from "@/lib/utils";

interface EditorialImageProps {
  label?: string;
  className?: string;
  variant?: "warm" | "cool" | "hero";
}

const variants = {
  warm: "from-amber-100 via-stone-200 to-stone-300",
  cool: "from-sky-100 via-stone-200 to-stone-300",
  hero: "from-stone-600 via-stone-700 to-stone-900",
};

export function EditorialImage({
  label,
  className,
  variant = "warm",
}: EditorialImageProps) {
  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden rounded-2xl bg-gradient-to-br p-6",
        variants[variant],
        className,
      )}
      aria-hidden={!label}
    >
      {label && variant !== "hero" && (
        <span className="text-xs font-medium uppercase tracking-wider text-stone-500">{label}</span>
      )}
    </div>
  );
}
