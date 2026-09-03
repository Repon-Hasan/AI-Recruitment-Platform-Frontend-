
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Sidebar } from "./sidebar";

import type { UserRole } from "./navigation-config";

import { Home } from "lucide-react";
import Link from "next/link";

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

        {/* Home Button */}
        <div className="border-b px-4 py-3">
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>

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

