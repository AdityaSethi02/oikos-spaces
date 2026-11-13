"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

function hideFooter(pathname: string) {
  return /^\/properties\/[^/]+$/.test(pathname);
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noFooter = hideFooter(pathname);

  return (
    <>
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      {!noFooter && <Footer />}
      <FloatingWhatsApp />
    </>
  );
}
