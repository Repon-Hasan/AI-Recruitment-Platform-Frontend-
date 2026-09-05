"use client";

import {
  ChevronDown,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NotificationButton from "./notification-Button";

/* =========================================================
   TYPES
========================================================= */

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  image?: string | null;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN" | "COMPANY" | string;
  status?: string;
  needPasswordChange?: boolean;
  isDeleted?: boolean;
}

interface TopbarProps {
  onMenuClick: () => void;
}

/* =========================================================
   TOPBAR
========================================================= */

export function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  /* =======================================================
     GET CURRENT USER
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const getCurrentUser = async () => {
      try {
        setLoadingUser(true);

        const response = await fetch("/api/auth/getMe", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (mounted) {
            setUser(null);
          }

          return;
        }

        const result = await response.json();

        /*
         * Supports:
         *
         * {
         *   user: {...}
         * }
         *
         * OR
         *
         * {
         *   data: {
         *     user: {...}
         *   }
         * }
         *
         * OR
         *
         * {
         *   data: {...}
         * }
         *
         * OR
         *
         * {
         *   id,
         *   name,
         *   ...
         * }
         */

        const currentUser =
          result?.user ??
          result?.data?.user ??
          result?.data ??
          result;

        if (mounted) {
          setUser(currentUser ?? null);
        }
      } catch (error) {
        console.error("Failed to get current user:", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    };

    getCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     USER INITIALS
  ======================================================= */

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* =======================================================
     ROLE LABEL
  ======================================================= */

  const getRoleLabel = () => {
    if (!user?.role) {
      return "User";
    }

    switch (user.role.toUpperCase()) {
      case "RECRUITER":
        return "Recruiter";

      case "CANDIDATE":
        return "Candidate";

      case "ADMIN":
        return "Admin";

      case "COMPANY":
        return "Company";

      default:
        return user.role;
    }
  };

  /* =======================================================
     DASHBOARD
  ======================================================= */

  const getDashboardHref = () => {
    if (!user) {
      return "/login";
    }

    switch (user.role.toUpperCase()) {
      case "ADMIN":
        return "/dashboard/admin";

      case "RECRUITER":
      case "COMPANY":
        return "/recruiter/dashboard";

      case "CANDIDATE":
      default:
        return "/candidate/dashboard";
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ?? "Unable to log out.",
        );
      }

      toast.success("Logged out", {
        description:
          result?.message ??
          "You have been logged out successfully.",
      });

      setUser(null);

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error("Logout failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  /* =======================================================
     PROFILE LINKS
  ======================================================= */

  const profileHref = "/profile";

  const settingsHref =
    user?.role?.toUpperCase() === "RECRUITER" ||
    user?.role?.toUpperCase() === "COMPANY"
      ? "/recruiter/settings"
      : "/settings";

  const billingHref = "/recruiter/billing";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.header
      initial={{
        y: -20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"
    >
      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
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
      </motion.div>

      {/* =====================================================
          MOBILE LOGO
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.15,
          duration: 0.3,
        }}
        className="mr-4 flex items-center gap-2 lg:hidden"
      >
        <motion.div
          whileHover={{
            rotate: 8,
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-primary-foreground shadow-lg shadow-indigo-500/20"
        >
          <Sparkles className="h-4 w-4" />

          <motion.div
            className="absolute inset-0 rounded-lg bg-indigo-400/30 blur-md"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>

        <span className="font-bold">
          Hire
          <span className="text-indigo-500">
            AI
          </span>
        </span>
      </motion.div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          x: -15,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.4,
        }}
        className="relative hidden max-w-md flex-1 md:block"
      >
        {/*
          Search intentionally kept empty exactly
          like your existing Topbar.
        */}
      </motion.div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* ===================================================
            HOME
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
          }}
          className="hidden sm:block"
        >
          <Link href="/">
            <motion.div
              whileHover={{
                y: -2,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.96,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Home className="h-4 w-4" />

              <span>Home</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 300,
          }}
        >
          <NotificationButton />
        </motion.div>

        {/* ===================================================
            SEPARATOR
        =================================================== */}

        <Separator
          orientation="vertical"
          className="mx-1 hidden h-7 sm:block"
        />

        {/* ===================================================
            USER MENU
        =================================================== */}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <motion.div
              initial={{
                opacity: 0,
                x: 10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="group flex h-10 items-center gap-2 rounded-xl px-2 outline-none transition-colors hover:bg-muted"
            >
              {/* =================================================
                  AVATAR
              ================================================= */}

              <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all group-hover:ring-primary/20">
                {!loadingUser && user?.image ? (
                  <AvatarImage
                    src={user.image}
                    alt={user.name ?? "User profile"}
                  />
                ) : null}

                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                  {loadingUser ? "..." : getInitials()}
                </AvatarFallback>
              </Avatar>

              {/* =================================================
                  USER INFORMATION
              ================================================= */}

              <div className="hidden text-left lg:block">
                {loadingUser ? (
                  <>
                    <div className="h-3 w-24 animate-pulse rounded bg-muted" />

                    <div className="mt-1 h-2 w-16 animate-pulse rounded bg-muted" />
                  </>
                ) : (
                  <>
                    <p className="max-w-[150px] truncate text-sm font-medium">
                      {user?.name ?? "User"}
                    </p>

                    <p className="text-xs capitalize text-muted-foreground">
                      {getRoleLabel()}
                    </p>
                  </>
                )}
              </div>

              {/* =================================================
                  CHEVRON
              ================================================= */}

              <motion.div
                whileHover={{
                  y: 1,
                }}
              >
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 lg:block" />
              </motion.div>
            </motion.div>
          </DropdownMenuTrigger>

          {/* ===================================================
              DROPDOWN
          =================================================== */}

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 overflow-hidden rounded-2xl border bg-background/95 p-2 shadow-xl backdrop-blur-xl"
          >
            <AnimatePresence>
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {/* =================================================
                    ACCOUNT HEADER
                ================================================= */}

                <DropdownMenuLabel className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {user?.image ? (
                        <AvatarImage
                          src={user.image}
                          alt={user.name ?? "User"}
                        />
                      ) : null}

                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {user?.name ?? "User"}
                      </p>

                      <p className="truncate text-xs font-normal text-muted-foreground">
                        {user?.email ?? ""}
                      </p>

                      <p className="mt-1 text-[10px] font-medium capitalize text-indigo-500">
                        {getRoleLabel()}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* =================================================
                    ACCOUNT MENU
                ================================================= */}

                <DropdownMenuGroup>
                  {/* =================================================
                      HOME
                  ================================================= */}

                  <DropdownMenuItem>
                    <Link
                      href="/"
                      className="flex cursor-pointer items-center gap-3 rounded-lg"
                    >
                      <Home className="h-4 w-4 text-muted-foreground" />

                      <span>Home</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* =================================================
                      PROFILE
                  ================================================= */}

                  <DropdownMenuItem>
                    <Link
                      href={profileHref}
                      className="flex cursor-pointer items-center gap-3 rounded-lg"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />

                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* =================================================
                      SETTINGS
                  ================================================= */}

                  <DropdownMenuItem>
                    <Link
                      href={settingsHref}
                      className="flex cursor-pointer items-center gap-3 rounded-lg"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />

                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* =================================================
                      BILLING
                  ================================================= */}

                  {(user?.role?.toUpperCase() ===
                    "RECRUITER" ||
                    user?.role?.toUpperCase() ===
                      "COMPANY") && (
                    <DropdownMenuItem>
                      <Link
                        href={billingHref}
                        className="flex cursor-pointer items-center gap-3 rounded-lg"
                      >
                        <CreditCard className="h-4 w-4 text-muted-foreground" />

                        <span>Billing</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    handleLogout();
                  }}
                  disabled={loggingOut}
                  className="cursor-pointer rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />

                  <span>
                    {loggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </span>
                </DropdownMenuItem>
              </motion.div>
            </AnimatePresence>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}