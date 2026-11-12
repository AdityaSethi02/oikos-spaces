"use client";

import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const onPropertyDetail = /^\/properties\/[^/]+$/.test(pathname);
  const onHome = pathname === "/" || pathname === "";

  return (
    <a
      href={whatsappLink("Hi, I'd like help with a property in Udaipur.")}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft sm:right-5",
        "touch-manipulation transition-opacity duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:scale-105",
        /* Keep clear of hero search + mobile enquiry bar */
        onPropertyDetail || onHome ? "bottom-24 lg:bottom-6" : "bottom-6",
      )}
      aria-label="Chat on WhatsApp"
    >
      <Icons.WhatsApp className="h-7 w-7" aria-hidden />
    </a>
  );
}
