"use client";

import { useState } from "react";

import { UserRole } from "../dashboard/navigation-config";

import { MobileSidebar } from "../dashboard/mobile-sidebar";

import { DesktopSidebar } from "../dashboard/DesktopSidebar";

import { Topbar } from "../dashboard/topbar";

import ParticleWave from "@/components/ui/particle-wave";

interface DashboardShellProps {
  children: React.ReactNode;
  role: UserRole;
}

export function DashboardShell({
  children,
  role,
}: DashboardShellProps) {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* ==================== Animated Background ==================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Indigo Glow */}
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />

        {/* Purple Glow */}
        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl animate-pulse" />

        {/* Bottom Indigo Glow */}
        <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />

        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_35%)]" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Particle Wave Animation */}
        <div className="absolute inset-x-0 top-0 h-[520px] overflow-hidden opacity-30">
          <ParticleWave />
        </div>

        {/* Top Soft Light */}
        <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* ==================== Desktop Sidebar ==================== */}
      <div className="relative z-20">
        <DesktopSidebar role={role} />
      </div>

      {/* ==================== Mobile Sidebar ==================== */}
      <div className="relative z-50">
        <MobileSidebar
          role={role}
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />
      </div>

      {/* ==================== Main Area ==================== */}
      <div className="relative z-10 lg:pl-72">
        {/* Topbar */}
        <Topbar
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        {/* Main Content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}