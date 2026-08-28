"use client";

import {
  Bell,
  ChevronDown,
  Home,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Separator,
} from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({
  onMenuClick,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Mobile Menu */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />

        <span className="sr-only">
          Open navigation
        </span>
      </Button>

      {/* Mobile Logo */}
      <div className="mr-4 flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>

        <span className="font-bold">
          HireAI
        </span>
      </div>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search jobs, candidates..."
          className="h-10 rounded-xl border-muted bg-muted/40 pl-9 focus-visible:bg-background"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <motion.a
          href="/"
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </motion.a>

        {/* Mobile Search */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Search className="h-5 w-5" />

          <span className="sr-only">
            Search
          </span>
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />

          <span className="sr-only">
            Notifications
          </span>
        </Button>

        <Separator
          orientation="vertical"
          className="mx-1 hidden h-7 sm:block"
        />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 gap-2 rounded-xl px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/images/avatar.png"
                  alt="Repon Hasan"
                />

                <AvatarFallback>
                  RH
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium">
                  Repon Hasan
                </p>

                <p className="text-xs text-muted-foreground">
                  Pro Plan
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem>
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}