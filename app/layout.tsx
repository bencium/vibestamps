import GhibliBackground from "@/components/ui/ghibli-background";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Doto, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  weight: "900",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibestamps | Timestamp Generator for YouTube",
  description:
    "Vibestamps helps you upload a .srt file to generate meaningful timestamps for YouTube videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${doto.variable} antialiased`}>
        <ThemeProvider>
          <GhibliBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
