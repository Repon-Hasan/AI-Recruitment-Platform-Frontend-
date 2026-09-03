"use client";

import type { UserRole } from "./navigation-config";
import { Sidebar } from "./sidebar";


interface DesktopSidebarProps {
  role: UserRole;
}

export function DesktopSidebar({
  role,
}: DesktopSidebarProps) {
  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        w-72
        border-r
        bg-background
        lg:flex
      "
    >
      <Sidebar role={role} />
    </aside>
  );
}