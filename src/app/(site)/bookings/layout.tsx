import type { Metadata } from "next";
import { requireAuthUser } from "@/server/policies/auth.policy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My bookings" };

export default async function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthUser();
  return children;
}
