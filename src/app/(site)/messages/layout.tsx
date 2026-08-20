import type { Metadata } from "next";
import { requireAuthUser } from "@/server/policies/auth.policy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthUser();
  return children;
}
