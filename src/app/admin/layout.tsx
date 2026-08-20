import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminRouteGuard } from "@/components/admin/admin-route-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Host Dashboard" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AdminRouteGuard>{children}</AdminRouteGuard>
        </main>
      </div>
    </div>
  );
}
