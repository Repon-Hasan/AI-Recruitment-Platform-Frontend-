import { Toaster } from "sonner";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import QueryProviders from "./providers/providers";
import ParticleWave from "@/components/ui/particle-wave";
import { Navbar } from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Recruitment Platform",
  description:
    "An intelligent AI-powered recruitment platform for connecting talented candidates with the right opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 antialiased`}
      >
        {/* =====================================================
            GLOBAL ANIMATED BACKGROUND
        ====================================================== */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Particle Wave */}
          <div className="absolute inset-0 z-0 opacity-70">
            <ParticleWave className="h-full w-full" />
          </div>

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-linear-to-b from-slate-950/35 via-slate-950/75 to-slate-950" />

          {/* Indigo Glow */}
          <div className="absolute -left-40 top-20 z-10 h-125 w-125 rounded-full bg-indigo-600/10 blur-[140px]" />

          {/* Purple Glow */}
          <div className="absolute -right-40 top-[30%] z-10 h-125 w-125 rounded-full bg-purple-600/10 blur-[140px]" />
        </div>

        {/* =====================================================
            APPLICATION
        ====================================================== */}
        <QueryProviders>
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="relative z-20">
            {children}
          </main>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            richColors
          />
        </QueryProviders>
      </body>
    </html>
  );
}