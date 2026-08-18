import type { Metadata } from "next";

export const metadata: Metadata = { title: "Saved stays" };

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
