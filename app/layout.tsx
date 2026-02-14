import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Team Dashboard",
  description: "Real-time monitoring for AI team operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
