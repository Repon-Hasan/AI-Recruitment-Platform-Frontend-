"use client";

import { jobsApi, JobStatus, RecruiterJob } from "@/lib/api/jobs.api";
import {
  AlertCircle,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ParticleWave from "../../ui/particle-wave";



/* =========================================================
   Helpers
========================================================= */

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string | null,
): string {
  if (min === null && max === null) {
    return "Salary not specified";
  }

  const currencyText = currency ?? "BDT";

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  });

  if (min !== null && max !== null) {
    return `${currencyText} ${formatter.format(min)} - ${formatter.format(max)}`;
  }

  if (min !== null) {
    return `${currencyText} ${formatter.format(min)}+`;
  }

  return `Up to ${currencyText} ${formatter.format(max ?? 0)}`;
}

function formatDate(date: string | null): string {
  if (!date) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getDeadlineState(deadline: string | null): {
  label: string;
  urgent: boolean;
  expired: boolean;
} {
  if (!deadline) {
    return {
      label: "No deadline",
      urgent: false,
      expired: false,
    };
  }

  const deadlineDate = new Date(deadline);
  const now = new Date();

  if (deadlineDate < now) {
    return {
      label: "Deadline passed",
      urgent: true,
      expired: true,
    };
  }

  const difference =
    deadlineDate.getTime() - now.getTime();

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );

  if (days <= 3) {
    return {
      label: `${days} day${days === 1 ? "" : "s"} left`,
      urgent: true,
      expired: false,
    };
  }

  return {
    label: `${days} days left`,
    urgent: false,
    expired: false,
  };
}

function getStatusClasses(status: JobStatus): string {
  switch (status.toUpperCase()) {
    case "PUBLISHED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "DRAFT":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "CLOSED":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-white/60";
  }
}

function getRemoteLabel(remoteType: string): string {
  switch (remoteType.toUpperCase()) {
    case "REMOTE":
      return "Remote";

    case "HYBRID":
      return "Hybrid";

    case "ONSITE":
      return "On-site";

    default:
      return remoteType.replaceAll("_", " ");
  }
}

function getEmploymentLabel(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function getExperienceLabel(level: string): string {
  switch (level.toUpperCase()) {
    case "ENTRY":
      return "Entry Level";

    case "JUNIOR":
      return "Junior";

    case "MID":
      return "Mid Level";

    case "SENIOR":
      return "Senior";

    case "LEAD":
      return "Lead";

    default:
      return level.replaceAll("_", " ");
  }
}

/* =========================================================
   Animation
========================================================= */

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

/* =========================================================
   Component
========================================================= */

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | JobStatus>("ALL");

  const [sortBy, setSortBy] = useState<
    "NEWEST" | "OLDEST" | "APPLICATIONS" | "MATCHES"
  >("NEWEST");

  /* =========================================================
     Fetch
  ========================================================= */

  const loadJobs = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const data = await jobsApi.getMyJobs();

        setJobs(data);
      } catch (err: unknown) {
        console.error("Failed to load recruiter jobs:", err);

        if (
          err &&
          typeof err === "object" &&
          "response" in err
        ) {
          const response = (
            err as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            }
          ).response;

          setError(
            response?.data?.message ??
              "Unable to load your jobs.",
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unable to load your jobs.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadJobs();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadJobs]);

  /* =========================================================
     Statistics
  ========================================================= */

  const statistics = useMemo(() => {
    const total = jobs.length;

    const published = jobs.filter(
      (job) =>
        job.status.toUpperCase() === "PUBLISHED",
    ).length;

    const drafts = jobs.filter(
      (job) => job.status.toUpperCase() === "DRAFT",
    ).length;

    const closed = jobs.filter(
      (job) => job.status.toUpperCase() === "CLOSED",
    ).length;

    const applications = jobs.reduce(
      (totalCount, job) =>
        totalCount + (job._count?.jobApplications ?? 0),
      0,
    );

    const matches = jobs.reduce(
      (totalCount, job) =>
        totalCount + (job._count?.matches ?? 0),
      0,
    );

    return {
      total,
      published,
      drafts,
      closed,
      applications,
      matches,
    };
  }, [jobs]);

  /* =========================================================
     Filtering + sorting
  ========================================================= */

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    const result = jobs.filter((job) => {
      const matchesSearch =
        !normalizedSearch ||
        job.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        job.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        job.location
          .toLowerCase()
          .includes(normalizedSearch) ||
        job.requiredSkills.some((skill) =>
          skill.name
            .toLowerCase()
            .includes(normalizedSearch),
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        job.status.toUpperCase() ===
          statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "OLDEST":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "APPLICATIONS":
          return (
            (b._count?.jobApplications ?? 0) -
            (a._count?.jobApplications ?? 0)
          );

        case "MATCHES":
          return (
            (b._count?.matches ?? 0) -
            (a._count?.matches ?? 0)
          );

        case "NEWEST":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });
  }, [jobs, search, sortBy, statusFilter]);

  /* =========================================================
     Loading
  ========================================================= */

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
          <ParticleWave />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-72 rounded-xl bg-white/10" />
            <div className="h-5 w-96 max-w-full rounded bg-white/5" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-32 rounded-2xl border border-white/10 bg-white/5"
                  />
                ),
              )}
            </div>

            <div className="h-20 rounded-2xl border border-white/10 bg-white/5" />

            <div className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-80 rounded-3xl border border-white/10 bg-white/5"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     Error
  ========================================================= */

  if (error && jobs.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
          <ParticleWave />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-red-400/20 bg-black/40 p-8 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h2 className="text-xl font-semibold">
              Unable to load your jobs
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/55">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadJobs()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* =========================================================
     Main UI
  ========================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* =====================================================
          Background
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 opacity-80">
        <ParticleWave />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_40%)]" />

      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#050816]/20 via-[#050816]/70 to-[#050816]" />

      {/* =====================================================
          Content
      ===================================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* ===================================================
            Hero
        =================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-200">
                <Sparkles className="h-3.5 w-3.5" />
                Recruiter Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Manage your{" "}
                <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                  job postings
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Create, monitor and optimize your job
                openings. Track applicants and discover
                AI-matched talent from one place.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void loadJobs(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>

              <Link
                href="/recruiter/jobs/create"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-white/5 transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
                Create Job
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ===================================================
            Statistics
        =================================================== */}

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            label="Total Jobs"
            value={statistics.total}
            description="All your job postings"
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Published"
            value={statistics.published}
            description="Currently accepting"
          />

          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Applications"
            value={statistics.applications}
            description="Candidates applied"
          />

          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="AI Matches"
            value={statistics.matches}
            description="Recommended candidates"
          />
        </motion.section>

        {/* ===================================================
            Filters
        =================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 shadow-xl backdrop-blur-xl sm:p-5"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search jobs, skills, location..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-indigo-400/40 focus:bg-white/[0.06]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as
                        | "ALL"
                        | JobStatus,
                    )
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition focus:border-indigo-400/40 sm:w-44"
                >
                  <option
                    value="ALL"
                    className="bg-slate-950"
                  >
                    All Status
                  </option>

                  <option
                    value="PUBLISHED"
                    className="bg-slate-950"
                  >
                    Published
                  </option>

                  <option
                    value="DRAFT"
                    className="bg-slate-950"
                  >
                    Draft
                  </option>

                  <option
                    value="CLOSED"
                    className="bg-slate-950"
                  >
                    Closed
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value as
                        | "NEWEST"
                        | "OLDEST"
                        | "APPLICATIONS"
                        | "MATCHES",
                    )
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition focus:border-indigo-400/40 sm:w-48"
                >
                  <option
                    value="NEWEST"
                    className="bg-slate-950"
                  >
                    Newest first
                  </option>

                  <option
                    value="OLDEST"
                    className="bg-slate-950"
                  >
                    Oldest first
                  </option>

                  <option
                    value="APPLICATIONS"
                    className="bg-slate-950"
                  >
                    Most applications
                  </option>

                  <option
                    value="MATCHES"
                    className="bg-slate-950"
                  >
                    Most AI matches
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===================================================
            Section heading
        =================================================== */}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/70">
              Your openings
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              My Jobs
            </h2>
          </div>

          <p className="text-sm text-white/40">
            Showing{" "}
            <span className="font-semibold text-white/70">
              {filteredJobs.length}
            </span>{" "}
            of {jobs.length} jobs
          </p>
        </div>

        {/* ===================================================
            Error banner
        =================================================== */}

        {error && jobs.length > 0 && (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>

            <button
              type="button"
              onClick={() => void loadJobs(true)}
              className="shrink-0 font-medium underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* ===================================================
            Empty state
        =================================================== */}

        {filteredJobs.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(search)}
            hasJobs={jobs.length > 0}
            onClear={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          />
        ) : (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-5 grid gap-5 lg:grid-cols-2"
          >
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </motion.section>
        )}

        {/* ===================================================
            Bottom CTA
        =================================================== */}

        {jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8 overflow-hidden rounded-3xl border border-indigo-400/10 bg-indigo-400/[0.045] p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-300" />

                  <h3 className="font-semibold">
                    Find your next great hire
                  </h3>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                  Use AI-powered candidate matching to
                  discover qualified talent for your open
                  positions.
                </p>
              </div>

              <Link
                href="/candidates"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/15"
              >
                <Users className="h-4 w-4" />
                Find Talent
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   Stat Card
========================================================= */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}

function StatCard({
  icon,
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.065]"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition group-hover:bg-indigo-500/10" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-white/45">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-white/30">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-200">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   Job Card
========================================================= */

interface JobCardProps {
  job: RecruiterJob;
}

function JobCard({ job }: JobCardProps) {
  const deadline = getDeadlineState(job.deadline);

  const status = job.status.toUpperCase();

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{
        y: -4,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-colors duration-300 hover:border-indigo-300/15 hover:bg-white/[0.065] sm:p-6"
    >
      {/* Card glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-indigo-500/5 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

      {/* Top */}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5">
            <BriefcaseBusiness className="h-5 w-5 text-indigo-200" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight">
              {job.title}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location || "Location not specified"}
              </span>

              <span>
                {getRemoteLabel(job.remoteType)}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${getStatusClasses(
            job.status,
          )}`}
        >
          {status}
        </span>
      </div>

      {/* Description */}

      <p className="relative mt-5 line-clamp-2 text-sm leading-6 text-white/45">
        {job.description}
      </p>

      {/* Metadata */}

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <InfoBox
          icon={
            <BriefcaseBusiness className="h-4 w-4" />
          }
          label="Employment"
          value={getEmploymentLabel(
            job.employmentType,
          )}
        />

        <InfoBox
          icon={<Users className="h-4 w-4" />}
          label="Experience"
          value={getExperienceLabel(
            job.experienceLevel,
          )}
        />

        <InfoBox
          icon={<CalendarDays className="h-4 w-4" />}
          label="Deadline"
          value={formatDate(job.deadline)}
          urgent={deadline.urgent}
        />

        <InfoBox
          icon={<Sparkles className="h-4 w-4" />}
          label="Salary"
          value={formatSalary(
            job.salaryMin,
            job.salaryMax,
            job.salaryCurrency,
          )}
        />
      </div>

      {/* Skills */}

      {job.requiredSkills.length > 0 && (
        <div className="relative mt-5">
          <div className="mb-2 text-xs font-medium text-white/35">
            Required skills
          </div>

          <div className="flex flex-wrap gap-2">
            {job.requiredSkills
              .slice(0, 6)
              .map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/60"
                >
                  {skill.name}
                </span>
              ))}

            {job.requiredSkills.length > 6 && (
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/35">
                +{job.requiredSkills.length - 6}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}

      <div className="relative mt-5 grid grid-cols-2 gap-3 border-y border-white/10 py-4">
        <div>
          <p className="text-xs text-white/35">
            Applications
          </p>

          <div className="mt-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-white/45" />

            <span className="text-lg font-semibold">
              {job._count?.jobApplications ?? 0}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/35">
            AI Matches
          </p>

          <div className="mt-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-300" />

            <span className="text-lg font-semibold">
              {job._count?.matches ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Deadline warning */}

      {job.deadline && (
        <div
          className={`relative mt-4 flex items-center gap-2 text-xs ${
            deadline.urgent
              ? "text-amber-300"
              : "text-white/35"
          }`}
        >
          <Clock3 className="h-3.5 w-3.5" />

          <span>{deadline.label}</span>
        </div>
      )}

      {/* Actions */}

      <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/recruiter/jobs/${job.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
        >
          View Job
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        <Link
          href={`/recruiter/jobs/${job.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </Link>

        <Link
          href={`/recruiter/jobs/${job.id}/applications`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
        >
          <Users className="h-4 w-4" />
          Applicants
        </Link>
      </div>
    </motion.article>
  );
}

/* =========================================================
   Info Box
========================================================= */

interface InfoBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  urgent?: boolean;
}

function InfoBox({
  icon,
  label,
  value,
  urgent = false,
}: InfoBoxProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-3">
      <div className="flex items-center gap-2 text-white/30">
        {icon}

        <span className="text-[11px]">
          {label}
        </span>
      </div>

      <p
        className={`mt-1.5 truncate text-xs font-medium ${
          urgent
            ? "text-amber-300"
            : "text-white/65"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   Empty State
========================================================= */

interface EmptyStateProps {
  hasSearch: boolean;
  hasJobs: boolean;
  onClear: () => void;
}

function EmptyState({
  hasSearch,
  hasJobs,
  onClear,
}: EmptyStateProps) {
  if (hasSearch || hasJobs) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Search className="h-6 w-6 text-white/40" />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          No matching jobs
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
          Try changing your search term or status
          filter to find another job posting.
        </p>

        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
        >
          Clear filters
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center backdrop-blur-xl sm:p-16"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10">
        <BriefcaseBusiness className="h-7 w-7 text-indigo-300" />
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        No jobs yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
        Create your first job posting and start
        attracting qualified candidates with
        AI-powered matching.
      </p>

      <Link
        href="/recruiter/jobs/create"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
      >
        <Plus className="h-4 w-4" />
        Create Your First Job
      </Link>
    </motion.div>
  );
}