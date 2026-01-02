import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | ACME",
    default: "ACME | AI-Powered Chat Assistant",
  },
};

export const viewport: Viewport = {
  themeColor: "#121214",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${interFont.variable}`}>
      <body className="relative min-h-dvh text-base antialiased bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
