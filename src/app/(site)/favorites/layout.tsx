import type { Metadata } from "next";
import { requireAuthUser } from "@/server/policies/auth.policy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Favorites" };

export default async function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthUser();
  return children;
}
