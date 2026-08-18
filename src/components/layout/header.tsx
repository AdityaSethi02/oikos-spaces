"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand, navigation } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Link
            href="/"
            className="flex flex-col leading-none"
            aria-label={`${brand.name} home`}
          >
            <span className="font-serif text-lg tracking-wide text-foreground sm:text-xl">
              {brand.name}
            </span>
            <span className="mt-0.5 hidden text-[10px] tracking-[0.2em] text-muted uppercase sm:block">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/favorites"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Favorites"
            >
              ♥
            </Link>
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
            <Link
              href="/bookings"
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Account"
            >
              👤
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              ☰
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
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-4"
          >
            <Button fullWidth>Sign in</Button>
          </Link>
        </nav>
      </Drawer>
    </>
  );
}
