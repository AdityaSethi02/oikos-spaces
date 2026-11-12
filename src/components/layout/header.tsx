"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand, navigation } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/drawer";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-header-muted/20 bg-header/95 text-header-foreground backdrop-blur-sm">
        <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          <Link
            href="/"
            className="min-w-0 flex flex-col leading-none"
            aria-label={`${brand.name} home`}
          >
            <span className="font-serif text-lg tracking-wide text-header-foreground sm:text-xl">
              {brand.name}
            </span>
            <span className="mt-0.5 hidden text-[10px] tracking-[0.18em] text-header-muted uppercase sm:block">
              {brand.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Main">
            {navigation.main.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-highlight",
                    active ? "text-header-foreground" : "text-header-muted",
                    "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-highlight after:transition-transform after:duration-200",
                    "hover:after:scale-x-100",
                    active && "after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-1 sm:gap-2 lg:flex">
              <Link
                href="/favorites"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-header-muted transition-colors hover:bg-header-foreground/10 hover:text-header-foreground"
                aria-label="Saved properties"
              >
                <Icons.Heart className="h-5 w-5" />
              </Link>
              <ButtonLink href="/contact" variant="secondary" size="sm">
                Book consultation
              </ButtonLink>
            </div>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-header-foreground touch-manipulation hover:bg-header-foreground/10 lg:hidden"
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
        title={brand.name}
        side="right"
        fullWidth
        className="bg-header text-header-foreground"
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={cn(
                "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-header-foreground/10 text-highlight"
                  : "text-header-foreground hover:bg-header-foreground/5",
              )}
            >
              {item.label}
            </Link>
          ))}
          <hr className="my-3 border-header-muted/25" />
          <Link
            href="/favorites"
            onClick={closeMobile}
            className={cn(
              "inline-flex items-center gap-3 rounded-lg px-4 py-3 text-base text-header-foreground hover:bg-header-foreground/5",
              pathname.startsWith("/favorites") && "bg-header-foreground/10 text-highlight",
            )}
          >
            <Icons.Heart className="h-5 w-5 shrink-0" aria-hidden />
            Saved
          </Link>
          <ButtonLink href="/contact" fullWidth className="mt-4" onClick={closeMobile}>
            Book consultation
          </ButtonLink>
          <ButtonLink
            href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
            variant="outline"
            fullWidth
            className="mt-2 border-header-muted/40 bg-transparent text-header-foreground hover:bg-header-foreground/10"
            onClick={closeMobile}
          >
            Call {brand.contact.phone}
          </ButtonLink>
        </nav>
      </Drawer>
    </>
  );
}
