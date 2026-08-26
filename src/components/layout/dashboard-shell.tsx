"use client";

import { useState } from "react";
import { UserRole } from "../dashboard/navigation-config";
import { MobileSidebar } from "../dashboard/mobile-sidebar";
import { DesktopSidebar } from "../dashboard/DesktopSidebar";
import { Topbar } from "../dashboard/topbar";

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
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <DesktopSidebar role={role} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        role={role}
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />

      {/* Main Area */}
      <div className="lg:pl-72">
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