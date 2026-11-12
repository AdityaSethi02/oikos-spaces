"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import type { FaqItem } from "@/data/mock/faqs";
import { cn } from "@/lib/utils";

export function FaqSection({
  items,
  title = "Frequently asked questions",
  className,
}: {
  items: FaqItem[];
  title?: string;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-page max-w-3xl">
        <h2 className="font-serif text-3xl sm:text-4xl text-center">{title}</h2>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center justify-between gap-4 py-5 text-left transition-colors touch-manipulation hover:text-accent"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span className="font-medium text-foreground">{item.question}</span>
                  <Icons.ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
                      open && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  style={{ transitionDuration: "250ms" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-muted">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
