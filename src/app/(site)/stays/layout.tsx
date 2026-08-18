import type { Metadata } from "next";

export const metadata: Metadata = { title: "Stays" };

export default function StaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
