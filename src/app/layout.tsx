import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suzanne Dwyer | Allstate Insurance Agent - Wynnewood, PA",
  description:
    "Home, Life and Car Insurance from Suzanne Dwyer, Allstate Insurance Agent in Wynnewood, PA. Elite Agent with 4.3 stars and 273+ reviews. Serving Delaware, New Jersey, and Pennsylvania.",
  keywords: [
    "Allstate",
    "Insurance",
    "Suzanne Dwyer",
    "Wynnewood PA",
    "Auto Insurance",
    "Home Insurance",
    "Life Insurance",
    "Renters Insurance",
    "Business Insurance",
    "Motorcycle Insurance",
    "Boat Insurance",
    "Flood Insurance",
    "Condo Insurance",
    "ATV Insurance",
  ],
  authors: [{ name: "Suzanne Dwyer" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Suzanne Dwyer | Allstate Insurance Agent",
    description:
      "You're in good hands. Home, Life and Car Insurance from Suzanne Dwyer, Elite Allstate Agent in Wynnewood, PA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
