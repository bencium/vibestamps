import GhibliBackground from "@/components/ui/ghibli-background";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
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
        <ThemeProvider 
          attribute="class" 
          defaultTheme="ghibli" 
          enableSystem={false}
          themes={['ghibli', 'ghibli-dark', 'youtube', 'youtube-dark', 'professional', 'professional-dark', 'sunset', 'sunset-dark', 'ocean', 'ocean-dark']}
        >
          <GhibliBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
