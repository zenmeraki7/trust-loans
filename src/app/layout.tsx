import type { Metadata } from "next";
import MainNavigation from "@/components/navigation/MainNavigation";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust Loans",
  description: "Public review and risk-awareness platform for loan apps",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MainNavigation />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
