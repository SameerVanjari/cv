import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Space_Grotesk, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Sameer Vanjari — Senior Frontend Engineer",
  description:
    "Senior Frontend Engineer with 4+ years building fast, scalable web apps with React, Next.js and TypeScript.",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrains.variable} ${dmSans.variable}`}
    >
      <body className="font-[var(--font-body)] bg-[#fcfcf9] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-teal-500 selection:text-white">
        <div className="grain" aria-hidden />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
