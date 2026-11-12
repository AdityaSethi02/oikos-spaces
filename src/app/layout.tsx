import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Fraunces, Manrope } from "next/font/google";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ToastContainer } from "@/components/feedback/toast-container";
import { brand } from "@/lib/brand";
import { themeToCssVars } from "@/lib/themes";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: `${brand.tagline} — trusted property advisors in Udaipur.`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = themeToCssVars() as CSSProperties;

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
      style={themeStyle}
    >
      <body className="min-h-full flex flex-col">
        <FavoritesProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
