"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand, navigation, whatsappLink } from "@/lib/brand";
import { conversations } from "@/data/mock/conversations";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/drawer";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          <Link
            href="/"
            className="min-w-0 flex flex-col leading-none"
            aria-label={`${brand.name} home`}
          >
            <span className="font-serif text-lg tracking-wide text-foreground sm:text-xl">
              {brand.name}
            </span>
            <span className="mt-0.5 hidden text-[10px] tracking-[0.18em] text-muted uppercase sm:block">
              {brand.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-foreground"
                    : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/favorites"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Saved properties"
            >
              <Icons.Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/messages"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Chat with dealer"
            >
              <Icons.Send className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              )}
            </Link>
            <ButtonLink
              href={whatsappLink()}
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </ButtonLink>
            <ButtonLink
              href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
              variant="outline"
              size="sm"
              className="hidden md:inline-flex lg:hidden xl:inline-flex"
            >
              Call
            </ButtonLink>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Icons.Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Menu"
        side="right"
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-accent-light text-accent"
                  : "text-foreground hover:bg-background",
              )}
            >
              {item.label}
            </Link>
          ))}
          <hr className="my-3 border-border" />
          {navigation.guest.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-base text-foreground hover:bg-background"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink
            href={whatsappLink()}
            fullWidth
            className="mt-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp an advisor
          </ButtonLink>
          <ButtonLink
            href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
            variant="outline"
            fullWidth
            className="mt-2"
          >
            Call {brand.contact.phone}
          </ButtonLink>
        </nav>
      </Drawer>
    </>
  );
}
