
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Contact,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface UserData {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "candidate" | "recruiter" | "admin" | string;
}

interface NavbarProps {
  user?: UserData | null;
  onLogout?: () => void;
}

const publicNavigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "How It Works",
    href: "/how-it-works",
  },
  {
    name: "Reviews",
    href: "/reviews",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Contact,
  },
];

const candidateNavigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Find Jobs",
    href: "/jobs",
    icon: Search,
  },
  {
    name: "Applications",
    href: "/dashboard/applications",
    icon: BriefcaseBusiness,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageCircle,
  },
];

const recruiterNavigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Find Talent",
    href: "/candidates",
    icon: Users,
  },
  {
    name: "Jobs",
    href: "/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageCircle,
  },
];

export function Navbar({
  user,
  onLogout,
}: NavbarProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  /*
   * Detect page scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const isLoggedIn = Boolean(user);

  const isRecruiter =
    user?.role === "recruiter" ||
    user?.role === "company";

  const navigation = !isLoggedIn
    ? publicNavigation
    : isRecruiter
      ? recruiterNavigation
      : candidateNavigation;

  const dashboardHref = isRecruiter
    ? "/dashboard/recruiter"
    : "/dashboard/candidate";

  /*
   * Get user initials
   */
  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* ======================================================
          NAVBAR
      ======================================================= */}
      <motion.header
        initial={{
          y: -80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-slate-950/80 shadow-lg shadow-black/10 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* ==================================================
              LOGO
          =================================================== */}
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="h-5 w-5 text-white" />

              <motion.div
                className="absolute inset-0 rounded-xl bg-indigo-400/30 blur-md"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>

            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-white">
                Hire<span className="text-indigo-400">AI</span>
              </span>

              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Intelligent Hiring
              </span>
            </div>
          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          =================================================== */}
          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-3 py-2"
                >
                  <motion.div
                    whileHover={{
                      y: -1,
                    }}
                    className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {Icon && (
                      <Icon className="h-4 w-4" />
                    )}

                    {item.name}

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 -z-10 rounded-lg bg-white/5"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>

                  {isActive && (
                    <motion.div
                      layoutId="navbar-line"
                      className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-linear-to-r from-indigo-400 to-purple-400"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ==================================================
              DESKTOP RIGHT SIDE
          =================================================== */}
          <div className="hidden items-center gap-3 lg:flex">
            {!isLoggedIn ? (
              <>
                {/* Login */}
                <Link href="/login">
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                  >
                    Login
                  </motion.div>
                </Link>

                {/* Get Started */}
                <Link href="/register">
                  <motion.div
                    whileHover={{
                      scale: 1.04,
                      boxShadow:
                        "0 10px 30px rgba(99,102,241,0.3)",
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="relative overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{
                        x: "-100%",
                      }}
                      whileHover={{
                        x: "100%",
                      }}
                      transition={{
                        duration: 0.6,
                      }}
                    />

                    <span className="relative z-10">
                      Get Started
                    </span>
                  </motion.div>
                </Link>
              </>
            ) : (
              <>
                {/* Notification */}
                <motion.button
                  whileHover={{
                    scale: 1.08,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Bell className="h-4 w-4" />

                  {/* Notification dot */}
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-400 ring-2 ring-slate-950" />
                </motion.button>

                {/* Profile */}
                <div className="relative">
                  <motion.button
                    onClick={() =>
                      setProfileOpen(
                        !profileOpen,
                      )
                    }
                    whileHover={{
                      scale: 1.02,
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3 backdrop-blur-md transition hover:bg-white/10"
                  >
                    {/* Avatar */}
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={
                          user?.name ??
                          "User profile"
                        }
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                        {getInitials()}
                      </div>
                    )}

                    <div className="hidden text-left xl:block">
                      <p className="max-w-[100px] truncate text-xs font-semibold text-white">
                        {user?.name ??
                          "User"}
                      </p>

                      <p className="text-[10px] capitalize text-slate-500">
                        {user?.role ??
                          "Candidate"}
                      </p>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </motion.button>

                  {/* Profile dropdown */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale: 0.96,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          scale: 0.96,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
                      >
                        {/* User info */}
                        <div className="mb-2 border-b border-white/10 px-3 py-3">
                          <p className="truncate text-sm font-semibold text-white">
                            {user?.name ??
                              "User"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {user?.email}
                          </p>
                        </div>

                        {/* Dashboard */}
                        <Link
                          href={dashboardHref}
                          onClick={closeMenus}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <BriefcaseBusiness className="h-4 w-4 text-indigo-400" />

                          Dashboard
                        </Link>

                        {/* Profile */}
                        <Link
                          href="/profile"
                          onClick={closeMenus}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <User className="h-4 w-4 text-purple-400" />

                          Profile
                        </Link>

                        {/* Settings */}
                        <Link
                          href="/settings"
                          onClick={closeMenus}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <Settings className="h-4 w-4 text-slate-400" />

                          Settings
                        </Link>

                        {/* Logout */}
                        <button
                          onClick={() => {
                            closeMenus();
                            onLogout?.();
                          }}
                          className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-white/10 px-3 py-2.5 pt-3 text-sm text-red-400 transition hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />

                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* ==================================================
              MOBILE MENU BUTTON
          =================================================== */}
          <motion.button
            whileTap={{
              scale: 0.9,
            }}
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                  }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* ======================================================
            MOBILE NAVIGATION
        ======================================================= */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl lg:hidden"
            >
              <div className="mx-auto max-w-7xl px-6 py-5">
                {/* Navigation */}
                <div className="space-y-1">
                  {navigation.map(
                    (item, index) => {
                      const Icon = item.icon;

                      const isActive =
                        pathname ===
                        item.href;

                      return (
                        <motion.div
                          key={item.name}
                          initial={{
                            opacity: 0,
                            x: -20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay:
                              index * 0.05,
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMenus}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                              isActive
                                ? "bg-indigo-500/10 text-indigo-300"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {Icon && (
                              <Icon className="h-4 w-4" />
                            )}

                            {item.name}
                          </Link>
                        </motion.div>
                      );
                    },
                  )}
                </div>

                {/* Logged out */}
                {!isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                    className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4"
                  >
                    <Link
                      href="/login"
                      onClick={closeMenus}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenus}
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                )}

                {/* Logged in */}
                {isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                    className="mt-4 border-t border-white/10 pt-4"
                  >
                    {/* Profile */}
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
                      {user?.image ? (
                        <img
                          src={user?.image}
                          alt={
                            user?.name ??
                            "User"
                          }
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                          {getInitials()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {user?.name ??
                            "User"}
                        </p>

                        <p className="truncate text-xs capitalize text-slate-500">
                          {user?.role ??
                            "Candidate"}
                        </p>
                      </div>
                    </div>

                    {/* Dashboard */}
                    <Link
                      href={dashboardHref}
                      onClick={closeMenus}
                      className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <BriefcaseBusiness className="h-4 w-4 text-indigo-400" />

                      Dashboard
                    </Link>

                    {/* Profile */}
                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4 text-purple-400" />

                      Profile
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        closeMenus();
                        onLogout?.();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />

                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}



