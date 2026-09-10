"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  // Prevent hydration mismatch between server and client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep the same navigation configuration
  const navGroups = navigation[role];

  return (
    <aside className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left Indigo Glow */}
        <div className="absolute -left-32 -top-32 h-[24rem] w-[24rem] rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Right Purple Glow */}
        <div className="absolute -right-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-purple-600/10 blur-3xl" />

        {/* Bottom Indigo Glow */}
        <div className="absolute -bottom-32 left-1/3 h-[20rem] w-[20rem] rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Radial Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col">
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

              <span className="text-[10px] text-slate-400">
                Intelligent Recruitment
              </span>
            </div>
          </Link>
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-7">
            {mounted &&
              navGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
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
                                ? "bg-indigo-500/10 text-indigo-300 shadow-sm"
                                : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                            }
                          `}
                        >
                          <Icon
                            className={`
                              h-[18px] w-[18px] shrink-0
                              ${
                                isActive
                                  ? "text-indigo-400"
                                  : "text-slate-500 group-hover:text-slate-200"
                              }
                            `}
                          />

                          <span className="flex-1 truncate">
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-300">
                              {item.badge}
                            </span>
                          )}

                          {isActive && (
                            <ChevronRight className="h-4 w-4 text-indigo-400" />
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
        <div className="border-t border-white/10 p-3">
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm">
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
              <p className="truncate text-sm font-semibold text-white">
                Repon Hasan
              </p>

              <p className="truncate text-xs text-slate-500">
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
            className="w-full justify-start gap-3 text-slate-400 hover:bg-white/[0.06] hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}