import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import MainNavigation from "@/components/navigation/MainNavigation";
import AccessibilityControls from "@/components/accessibility/AccessibilityControls";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust Loans",
  description: "Public review and risk-awareness platform for loan apps",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // A per-request render is required so Next.js can attach the middleware nonce.
  await connection();
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <MainNavigation />
        <div id="main-content"><ReactQueryProvider>{children}</ReactQueryProvider></div>
        <AccessibilityControls />
      </body>
    </html>
  );
}
