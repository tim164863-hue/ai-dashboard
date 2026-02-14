import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Team Dashboard",
    template: "%s | AI Dashboard",
  },
  description: "Real-time monitoring and analytics for AI team operations — Ula, 0xcat, Kawa",
  keywords: ["AI", "dashboard", "monitoring", "agents", "OpenClaw"],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="dark" suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
