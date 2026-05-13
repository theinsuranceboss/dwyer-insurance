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
  title: "Dwyer Insurance Group | Insurance Agency - PA, NY, DE",
  description:
    "Home, Life and Car Insurance from Dwyer Insurance Group. Elite Agent, National Award Winner with 4.3 stars and 273+ reviews. Serving Pennsylvania, New York, and Delaware.",
  keywords: [
    "Insurance",
    "Dwyer Insurance Group",
    "PA",
    "NY",
    "DE",
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
  authors: [{ name: "Dwyer Insurance Group" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Dwyer Insurance Group | Insurance Agency",
    description:
      "Protecting what matters most. Home, Life and Car Insurance from Dwyer Insurance Group, serving PA, NY, and DE.",
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
