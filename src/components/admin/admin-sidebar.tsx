"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand, navigation } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/drawer";
import { Icons } from "@/components/icons";

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
      {navigation.admin.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "min-h-11 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent-light text-accent"
                : "text-stone-300 hover:bg-stone-800 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="flex items-center justify-between bg-stone-900 px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-serif text-lg text-white">
          {brand.name}
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-300 hover:bg-stone-800"
          aria-label="Open admin menu"
        >
          <Icons.Menu className="h-6 w-6" />
        </button>
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Admin Menu"
        side="left"
        className="max-w-xs bg-stone-900 text-white border-stone-800"
      >
        <div className="bg-stone-900">{navContent}</div>
      </Drawer>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-stone-800 bg-stone-900 lg:flex">
        <div className="border-b border-stone-800 px-5 py-6">
          <Link href="/admin" className="font-serif text-lg text-white">
            {brand.name}
          </Link>
          <p className="mt-1 text-xs text-stone-400">Host Dashboard</p>
        </div>
        <div className="flex-1 overflow-y-auto">{navContent}</div>
        <div className="border-t border-stone-800 p-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-white"
          >
            <Icons.ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
        </div>
      </aside>
    </>
  );
}

export function DataCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl text-foreground">{value}</p>
      {subtext && <p className="mt-1 text-xs text-muted">{subtext}</p>}
    </div>
  );
}
