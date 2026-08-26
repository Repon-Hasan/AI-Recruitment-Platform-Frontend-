"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  navigation,
  type UserRole,
} from "./navigation-config";

interface SidebarProps {
  role: UserRole;
  onNavigate?: () => void;
}

export function Sidebar({
  role,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const navGroups = navigation[role];

  return (
    <aside className="flex h-full w-full flex-col bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link
          href={`/${role}/dashboard`}
          className="flex items-center gap-3"
          onClick={onNavigate}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">
              HireAI
            </span>

            <span className="text-[10px] text-muted-foreground">
              Intelligent Recruitment
            </span>
          </div>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-7">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`
                        group flex items-center gap-3 rounded-xl px-3 py-2.5
                        text-sm font-medium transition-all
                        ${
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                      `}
                    >
                      <Icon
                        className={`
                          h-[18px] w-[18px] shrink-0
                          ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          }
                        `}
                      />

                      <span className="flex-1 truncate">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                          {item.badge}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom User Section */}
      <div className="border-t p-3">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="/images/avatar.png"
              alt="User"
            />

            <AvatarFallback>
              RH
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              Repon Hasan
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {role === "candidate"
                ? "Candidate"
                : role === "recruiter"
                  ? "Recruiter"
                  : "Administrator"}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}