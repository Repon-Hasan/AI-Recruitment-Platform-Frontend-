
"use client";

import {
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Edit3,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { motion } from "motion/react";
import { useState } from "react";
import type { ComponentType } from "react";

import ProfileEditForm from "../authServices/ProfileEditForm";

interface AdminProfileProps {
  user: {
    id?: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    emailVerified?: boolean;
  };
}

export default function AdminProfile({
  user,
}: AdminProfileProps) {
  const [editing, setEditing] = useState(false);

  /* =========================================================
     Edit Profile
  ========================================================= */

  if (editing) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-red-600/10 blur-3xl" />

          <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.07),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          {/* Back Button */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditing(false)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
            Back to profile
          </motion.button>

          {/* Existing Profile Edit Form */}
          <ProfileEditForm
            initialName={user.name}
            email={user.email}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      {/* =====================================================
          Background
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-red-600/10 blur-3xl" />

        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* =====================================================
            Header
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Badge */}

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Administrator
          </div>

          {/* Header Content */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Admin Profile
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Manage your administrator account and platform access.
              </p>
            </div>

            {/* Edit Profile Button */}

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEditing(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100"
            >
              <Edit3 className="h-4 w-4" />
              Edit profile
            </motion.button>
          </div>
        </motion.div>

        {/* =====================================================
            Profile Card
        ===================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl"
        >
          {/* Cover */}

          <div className="h-36 bg-gradient-to-r from-red-600/20 via-indigo-600/20 to-purple-600/20" />

          <div className="px-6 pb-8 sm:px-10">
            {/* Avatar */}

            <div className="-mt-12 mb-6">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-slate-950 bg-gradient-to-br from-red-500 to-purple-600 shadow-xl">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Admin"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShieldCheck className="h-10 w-10 text-white" />
                )}
              </div>
            </div>

            {/* User Header */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {user.name || "Administrator"}
                </h2>

                <p className="mt-1 text-sm font-medium text-red-300">
                  System Administrator
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="h-4 w-4 text-indigo-400" />
                  {user.email}
                </div>
              </div>

              {/* Verified */}

              {user.emailVerified !== false && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </div>
              )}
            </div>

            {/* =================================================
                Information
            ================================================= */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Info
                icon={UserRound}
                label="Full name"
                value={user.name || "Administrator"}
              />

              <Info
                icon={Mail}
                label="Email"
                value={user.email}
              />

              <Info
                icon={ShieldCheck}
                label="Role"
                value="Administrator"
              />

              <Info
                icon={Activity}
                label="Account status"
                value="Active"
              />
            </div>

            {/* =================================================
                Admin Actions
            ================================================= */}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Action
                icon={LayoutDashboard}
                label="Dashboard"
                href="/dashboard/admin"
              />

              <Action
                icon={Users}
                label="Users"
                href="/dashboard/admin/users"
              />

              <Action
                icon={BriefcaseBusiness}
                label="Jobs"
                href="/dashboard/admin/jobs"
              />

              <Action
                icon={Settings}
                label="Settings"
                href="/dashboard/admin/settings"
              />
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            Admin Tools
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          <ToolCard
            icon={Users}
            title="Manage users"
            description="Review and manage platform users."
            href="/dashboard/admin/users"
          />

          <ToolCard
            icon={BriefcaseBusiness}
            title="Manage jobs"
            description="Monitor job postings across the platform."
            href="/dashboard/admin/jobs"
          />

          <ToolCard
            icon={Activity}
            title="System activity"
            description="Review platform activity and administration."
            href="/dashboard/admin"
          />
        </motion.div>
      </div>
    </main>
  );
}

/* =========================================================
   Info
========================================================= */

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-400/20 hover:bg-white/[0.05]"
    >
      <Icon className="h-5 w-5 text-indigo-400" />

      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-200">
        {value}
      </p>
    </motion.div>
  );
}

/* =========================================================
   Action
========================================================= */

function Action({
  icon: Icon,
  label,
  href,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-indigo-400/20 hover:bg-white/[0.08] hover:text-white"
    >
      <Icon className="h-4 w-4 text-indigo-400" />

      {label}

      <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-indigo-300" />
    </motion.a>
  );
}

/* =========================================================
   Tool Card
========================================================= */

function ToolCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <motion.a
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      href={href}
      className="group rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition hover:border-indigo-400/20 hover:bg-white/[0.08]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 transition group-hover:bg-indigo-500/20">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-300">
        Open

        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </div>
    </motion.a>
  );
}

