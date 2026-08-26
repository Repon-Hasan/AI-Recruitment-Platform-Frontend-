"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Sidebar,
} from "./sidebar";

import type {
  UserRole,
} from "./navigation-config";

interface MobileSidebarProps {
  role: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({
  role,
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="left"
        className="w-70 p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>
            Navigation
          </SheetTitle>
        </SheetHeader>

        <Sidebar
          role={role}
          onNavigate={() =>
            onOpenChange(false)
          }
        />
      </SheetContent>
    </Sheet>
  );
}