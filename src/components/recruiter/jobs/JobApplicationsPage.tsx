"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { motion, type Variants } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";


import {
  recruiterApi,
  type ApplicationStatus,
  type RecruiterApplication,
  type RecruiterJob,
} from "@/lib/api/recruiter.api";
import ParticleWave from "@/components/ui/particle-wave";


/* =========================================================
   TYPES
========================================================= */

interface JobApplicationsPageProps {
  jobId: string;
}


type FilterStatus =
  | "ALL"
  | ApplicationStatus;


/* =========================================================
   ANIMATION
========================================================= */

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.5,
      staggerChildren: 0.06,
    },
  },
};


const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};


const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};


/* =========================================================
   HELPERS
========================================================= */

function formatEnum(
  value?: string | null,
) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase(),
    );
}


function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}


function formatRelativeDate(
  value?: string | null,
) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    diff / 60000,
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  if (days < 30) {
    return `${days}d ago`;
  }

  return formatDate(value);
}


function getCandidateName(
  application: RecruiterApplication,
) {
  return (
    application.candidateProfile?.user?.name ||
    application.candidate?.name ||
    "Unknown Candidate"
  );
}


function getCandidateEmail(
  application: RecruiterApplication,
) {
  return (
    application.candidateProfile?.user?.email ||
    application.candidate?.email ||
    ""
  );
}


function getCandidateImage(
  application: RecruiterApplication,
) {
  return (
    application.candidateProfile
      ?.profileImage ||
    application.candidateProfile
      ?.image ||
    application.candidateProfile
      ?.avatar ||
    application.candidateProfile
      ?.user?.image ||
    application.candidate?.image ||
    null
  );
}


function getMatchScore(
  application: RecruiterApplication,
) {
  const values = [
    application.matchScore,
    application.score,
    application.matchPercentage,
    application.aiScore,
    application.aiMatchScore,
    application.match?.score,
    application.match?.percentage,
  ];

  const score = values.find(
    (value) =>
      typeof value === "number",
  );

  if (
    typeof score !== "number" ||
    Number.isNaN(score)
  ) {
    return null;
  }

  return Math.round(
    Math.max(0, Math.min(100, score)),
  );
}


function getStatusClasses(
  status?: string | null,
) {
  switch (status) {
    case "SHORTLISTED":
      return "border-violet-400/20 bg-violet-500/10 text-violet-300";

    case "INTERVIEW":
      return "border-cyan-400/20 bg-cyan-500/10 text-cyan-300";

    case "ACCEPTED":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

    case "REJECTED":
      return "border-rose-400/20 bg-rose-500/10 text-rose-300";

    case "WITHDRAWN":
      return "border-slate-400/20 bg-slate-500/10 text-slate-300";

    case "REVIEWING":
      return "border-amber-400/20 bg-amber-500/10 text-amber-300";

    case "APPLIED":
    default:
      return "border-blue-400/20 bg-blue-500/10 text-blue-300";
  }
}


function getScoreClasses(
  score: number | null,
) {
  if (score === null) {
    return "border-white/10 bg-white/[0.04] text-slate-400";
  }

  if (score >= 80) {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (score >= 60) {
    return "border-amber-400/20 bg-amber-500/10 text-amber-300";
  }

  return "border-rose-400/20 bg-rose-500/10 text-rose-300";
}


function getInitials(
  name: string,
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  description: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -3,
      }}
      className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition-colors hover:border-white/15 hover:bg-white/[0.055]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-300">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </motion.div>
  );
}


function DetailItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

      <div className="min-w-0">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <div className="mt-1 text-sm text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function JobApplicationsPage({
  jobId,
}: JobApplicationsPageProps) {
  const [job, setJob] =
    useState<RecruiterJob | null>(null);

  const [applications, setApplications] =
    useState<RecruiterApplication[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<FilterStatus>("ALL");

  const [selectedApplication, setSelectedApplication] =
    useState<RecruiterApplication | null>(null);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);


  /* =======================================================
     LOAD DATA
  ======================================================== */

  const loadData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const [
          jobs,
          jobApplications,
        ] = await Promise.all([
          recruiterApi.getJobs(),
          recruiterApi.getApplicationsByJob(
            jobId,
          ),
        ]);

        const foundJob = jobs.find(
          (item) => item.id === jobId,
        );

        if (!foundJob) {
          throw new Error(
            "Job not found or you do not have access to this job.",
          );
        }

        setJob(foundJob);
        setApplications(jobApplications);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load applications.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [jobId],
  );


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadData]);


  /* =======================================================
     FILTERED APPLICATIONS
  ======================================================== */

  const filteredApplications =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return applications.filter(
        (application) => {
          const name =
            getCandidateName(
              application,
            ).toLowerCase();

          const email =
            getCandidateEmail(
              application,
            ).toLowerCase();

          const headline =
            application
              .candidateProfile
              ?.headline
              ?.toLowerCase() ?? "";

          const matchesSearch =
            !query ||
            name.includes(query) ||
            email.includes(query) ||
            headline.includes(query);

          const matchesStatus =
            statusFilter === "ALL" ||
            application.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      applications,
      search,
      statusFilter,
    ]);


  /* =======================================================
     STATS
  ======================================================== */

  const stats = useMemo(() => {
    const total =
      applications.length;

    const reviewing =
      applications.filter(
        (item) =>
          item.status === "REVIEWING",
      ).length;

    const shortlisted =
      applications.filter(
        (item) =>
          item.status === "SHORTLISTED",
      ).length;

    const interviews =
      applications.filter(
        (item) =>
          item.status === "INTERVIEW",
      ).length;

    return {
      total,
      reviewing,
      shortlisted,
      interviews,
    };
  }, [applications]);


  /* =======================================================
     STATUS UPDATE
  ======================================================== */

  const updateStatus = async (
    application: RecruiterApplication,
    status: ApplicationStatus,
  ) => {
    try {
      setUpdatingStatus(true);
      setError(null);

      const updated =
        await recruiterApi.updateApplicationStatus(
          application.id,
          status,
        );

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? {
                ...item,
                ...updated,
              }
            : item,
        ),
      );

      setSelectedApplication(
        (current) =>
          current
            ? {
                ...current,
                ...updated,
              }
            : null,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update application status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };


  /* =======================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <ParticleWave />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="animate-pulse space-y-6">

            <div className="h-5 w-40 rounded bg-white/10" />

            <div className="h-12 w-1/2 rounded-xl bg-white/10" />

            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-2xl bg-white/[0.04]"
                />
              ))}
            </div>

            <div className="h-[500px] rounded-3xl bg-white/[0.04]" />

          </div>
        </div>
      </div>
    );
  }


  /* =======================================================
     ERROR
  ======================================================== */

  if (error && !job) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <ParticleWave />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">

          <div className="w-full max-w-md rounded-3xl border border-rose-400/20 bg-white/[0.05] p-8 text-center shadow-2xl backdrop-blur-xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <X className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-semibold">
              Unable to load applications
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <Link
              href="/recruiter/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>

          </div>
        </div>
      </div>
    );
  }


  if (!job) {
    return null;
  }


  /* =======================================================
     MAIN UI
  ======================================================== */

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-hidden bg-[#050816] text-white"
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <ParticleWave />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_30%)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />


      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <motion.div
          variants={itemVariants}
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >

          <div className="flex items-center gap-2 text-sm text-slate-400">

            <Link
              href="/recruiter"
              className="transition hover:text-white"
            >
              Dashboard
            </Link>

            <ChevronRight className="h-4 w-4" />

            <Link
              href="/recruiter/jobs"
              className="transition hover:text-white"
            >
              Jobs
            </Link>

            <ChevronRight className="h-4 w-4" />

            <Link
              href={`/recruiter/jobs/${job.id}`}
              className="max-w-[180px] truncate transition hover:text-white"
            >
              {job.title}
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="text-slate-200">
              Applications
            </span>

          </div>


          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                loadData(true)
              }
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <Link
              href={`/recruiter/jobs/${job.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Job
            </Link>

          </div>

        </motion.div>


        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          variants={itemVariants}
          className="mb-8"
        >

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                <Users className="h-3.5 w-3.5" />

                Candidate Applications
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Applications
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">

                <span className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {job.title}
                </span>

                {job.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                )}

                <span className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4" />
                  {formatEnum(
                    job.remoteType,
                  )}
                </span>

              </div>

            </div>


            <Link
              href={`/candidates?jobId=${job.id}`}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              <Sparkles className="h-4 w-4" />

              AI Candidate Matching

              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

          </div>

        </motion.div>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-4 text-sm text-rose-200"
          >
            <X className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">
                Something went wrong
              </p>

              <p className="mt-1 text-rose-200/70">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              className="rounded-lg p-1 transition hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}


        {/* =====================================================
            STATS
        ====================================================== */}

        <motion.div
          variants={containerVariants}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >

          <StatCard
            icon={Users}
            label="Total Applications"
            value={stats.total}
            description="Candidates applied"
          />

          <StatCard
            icon={Clock3}
            label="Under Review"
            value={stats.reviewing}
            description="Currently reviewing"
          />

          <StatCard
            icon={Sparkles}
            label="Shortlisted"
            value={stats.shortlisted}
            description="Candidates shortlisted"
          />

          <StatCard
            icon={CalendarDays}
            label="Interviews"
            value={stats.interviews}
            description="Candidates in interview"
          />

        </motion.div>


        {/* =====================================================
            FILTER BAR
        ====================================================== */}

        <motion.div
          variants={itemVariants}
          className="mb-6 rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-xl backdrop-blur-xl"
        >

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search candidate by name, email or headline..."
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-400/50 focus:bg-white/[0.04] focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>


            {/* Status */}

            <div className="relative lg:w-52">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as FilterStatus,
                  )
                }
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 pr-10 text-sm text-slate-200 outline-none transition focus:border-indigo-400/50"
              >
                <option value="ALL">
                  All Applications
                </option>

                <option value="APPLIED">
                  Applied
                </option>

                <option value="REVIEWING">
                  Reviewing
                </option>

                <option value="SHORTLISTED">
                  Shortlisted
                </option>

                <option value="INTERVIEW">
                  Interview
                </option>

                <option value="ACCEPTED">
                  Accepted
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="WITHDRAWN">
                  Withdrawn
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            </div>

          </div>


          <div className="mt-3 flex items-center justify-between px-1 text-xs text-slate-500">

            <span>
              Showing{" "}
              <span className="font-semibold text-slate-300">
                {filteredApplications.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-300">
                {applications.length}
              </span>{" "}
              applications
            </span>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="text-indigo-300 transition hover:text-indigo-200"
              >
                Clear search
              </button>
            )}

          </div>

        </motion.div>


        {/* =====================================================
            APPLICATIONS
        ====================================================== */}

        {filteredApplications.length === 0 ? (

          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-20 text-center backdrop-blur-xl"
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
              {applications.length === 0 ? (
                <Users className="h-7 w-7" />
              ) : (
                <Search className="h-7 w-7" />
              )}
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              {applications.length === 0
                ? "No applications yet"
                : "No matching applications"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {applications.length === 0
                ? "Applications from candidates will appear here when they apply to this position."
                : "Try changing your search or status filter to find other candidates."}
            </p>

          </motion.div>

        ) : (

          <motion.div
            variants={containerVariants}
            className="space-y-4"
          >

            {filteredApplications.map(
              (application) => {
                const name =
                  getCandidateName(
                    application,
                  );

                const email =
                  getCandidateEmail(
                    application,
                  );

                const image =
                  getCandidateImage(
                    application,
                  );

                const score =
                  getMatchScore(
                    application,
                  );

                const skills =
                  application
                    .candidateProfile
                    ?.skills ?? [];

                return (
                  <motion.div
                    key={application.id}
                    variants={cardVariants}
                    layout
                    whileHover={{
                      y: -2,
                    }}
                    className="group rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-xl backdrop-blur-xl transition-colors hover:border-white/15 hover:bg-white/[0.05] sm:p-5"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                      {/* Candidate */}

                      <div className="flex min-w-0 flex-1 items-start gap-4">

                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 text-sm font-bold text-indigo-200 ring-1 ring-white/10">
                            {getInitials(
                              name,
                            )}
                          </div>
                        )}


                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="truncate text-base font-semibold text-white">
                              {name}
                            </h2>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                application.status,
                              )}`}
                            >
                              {formatEnum(
                                application.status,
                              )}
                            </span>

                          </div>


                          <p className="mt-1 truncate text-sm text-slate-400">
                            {application
                              .candidateProfile
                              ?.headline ||
                              "Candidate"}
                          </p>


                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">

                            {email && (
                              <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {email}
                              </span>
                            )}

                            {application
                              .candidateProfile
                              ?.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {
                                  application
                                    .candidateProfile
                                    .location
                                }
                              </span>
                            )}

                            <span className="flex items-center gap-1.5">
                              <Clock3 className="h-3.5 w-3.5" />
                              {formatRelativeDate(
                                application.createdAt,
                              )}
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* Skills */}

                      <div className="hidden min-w-[220px] max-w-[300px] lg:block">

                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Skills
                        </p>

                        <div className="flex flex-wrap gap-1.5">

                          {skills
                            .slice(0, 5)
                            .map(
                              (skill) => (
                                <span
                                  key={
                                    skill.id ??
                                    skill.name
                                  }
                                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300"
                                >
                                  {skill.name}
                                </span>
                              ),
                            )}

                          {skills.length >
                            5 && (
                            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-500">
                              +
                              {skills.length -
                                5}
                            </span>
                          )}

                          {skills.length ===
                            0 && (
                            <span className="text-xs text-slate-600">
                              No skills listed
                            </span>
                          )}

                        </div>

                      </div>


                      {/* AI Score */}

                      <div className="flex shrink-0 items-center gap-4">

                        <div
                          className={`rounded-2xl border px-4 py-3 text-center ${getScoreClasses(
                            score,
                          )}`}
                        >

                          <div className="flex items-center justify-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />

                            <span className="text-lg font-bold">
                              {score !== null
                                ? `${score}%`
                                : "—"}
                            </span>
                          </div>

                          <p className="mt-0.5 text-[10px] uppercase tracking-wider opacity-70">
                            AI Match
                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            setSelectedApplication(
                              application,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white"
                        >
                          <UserRound className="h-4 w-4" />

                          View

                          <ChevronRight className="h-4 w-4" />
                        </button>

                      </div>

                    </div>


                    {/* Mobile skills */}

                    <div className="mt-4 lg:hidden">

                      <div className="flex flex-wrap gap-1.5">

                        {skills
                          .slice(0, 5)
                          .map(
                            (skill) => (
                              <span
                                key={
                                  skill.id ??
                                  skill.name
                                }
                                className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300"
                              >
                                {skill.name}
                              </span>
                            ),
                          )}

                      </div>

                    </div>

                  </motion.div>
                );
              },
            )}

          </motion.div>

        )}

      </div>


      {/* =====================================================
          APPLICATION DETAILS MODAL
      ====================================================== */}

      {selectedApplication && (
        <div className="fixed inset-0 z-50">

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setSelectedApplication(
                null,
              )
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />


          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#080b19]/95 shadow-2xl backdrop-blur-2xl"
          >

            {/* Modal header */}

            <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6">

              <div className="flex min-w-0 items-center gap-4">

                {getCandidateImage(
                  selectedApplication,
                ) ? (
                  <img
                    src={
                      getCandidateImage(
                        selectedApplication,
                      )!
                    }
                    alt={getCandidateName(
                      selectedApplication,
                    )}
                    className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 font-bold text-indigo-200">
                    {getInitials(
                      getCandidateName(
                        selectedApplication,
                      ),
                    )}
                  </div>
                )}

                <div className="min-w-0">

                  <h2 className="truncate text-xl font-bold text-white">
                    {getCandidateName(
                      selectedApplication,
                    )}
                  </h2>

                  <p className="mt-1 truncate text-sm text-slate-400">
                    {getCandidateEmail(
                      selectedApplication,
                    )}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(
                    null,
                  )
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

            </div>


            {/* Modal body */}

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">

              <div className="space-y-6">

                {/* Status / Match */}

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">

                    <p className="text-xs text-slate-500">
                      Application Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        selectedApplication.status,
                      )}`}
                    >
                      {formatEnum(
                        selectedApplication.status,
                      )}
                    </span>

                  </div>


                  <div
                    className={`rounded-2xl border p-4 ${getScoreClasses(
                      getMatchScore(
                        selectedApplication,
                      ),
                    )}`}
                  >

                    <p className="text-xs opacity-70">
                      AI Match Score
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {getMatchScore(
                        selectedApplication,
                      ) !== null
                        ? `${getMatchScore(
                            selectedApplication,
                          )}%`
                        : "Not scored"}
                    </p>

                  </div>

                </div>


                {/* Candidate info */}

                <section>

                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <UserRound className="h-4 w-4 text-indigo-300" />
                    Candidate Information
                  </h3>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

                    <div className="grid gap-4 sm:grid-cols-2">

                      <DetailItem
                        icon={Mail}
                        label="Email"
                      >
                        {getCandidateEmail(
                          selectedApplication,
                        ) || "Not available"}
                      </DetailItem>


                      <DetailItem
                        icon={MapPin}
                        label="Location"
                      >
                        {selectedApplication
                          .candidateProfile
                          ?.location ||
                          "Not specified"}
                      </DetailItem>


                      <DetailItem
                        icon={BriefcaseBusiness}
                        label="Experience"
                      >
                        {selectedApplication
                          .candidateProfile
                          ?.experience ||
                          "Not specified"}
                      </DetailItem>


                      <DetailItem
                        icon={CalendarDays}
                        label="Applied"
                      >
                        {formatDate(
                          selectedApplication.createdAt,
                        )}
                      </DetailItem>

                    </div>

                  </div>

                </section>


                {/* Skills */}

                <section>

                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <Sparkles className="h-4 w-4 text-indigo-300" />
                    Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {selectedApplication
                      .candidateProfile
                      ?.skills
                      ?.map((skill) => (
                        <span
                          key={
                            skill.id ??
                            skill.name
                          }
                          className="rounded-xl border border-indigo-400/10 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-200"
                        >
                          {skill.name}
                        </span>
                      ))}

                    {!selectedApplication
                      .candidateProfile
                      ?.skills?.length && (
                      <p className="text-sm text-slate-500">
                        No skills provided.
                      </p>
                    )}

                  </div>

                </section>


                {/* Cover letter */}

                <section>

                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <FileText className="h-4 w-4 text-indigo-300" />
                    Cover Letter
                  </h3>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                    {selectedApplication.coverLetter ? (
                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                        {
                          selectedApplication.coverLetter
                        }
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No cover letter was provided.
                      </p>
                    )}

                  </div>

                </section>


                {/* Resume */}

                <section>

                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <FileText className="h-4 w-4 text-indigo-300" />
                    Resume
                  </h3>

                  <div className="space-y-3">

                    {selectedApplication
                      .candidateProfile
                      ?.resumes?.map(
                        (resume, index) => (
                          <div
                            key={
                              resume.id ??
                              index
                            }
                            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                          >

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
                                <FileText className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-medium text-white">
                                  Resume{" "}
                                  {index + 1}
                                </p>

                                {resume.summary && (
                                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                    {
                                      resume.summary
                                    }
                                  </p>
                                )}

                              </div>

                            </div>


                            {resume.fileUrl && (
                              <a
                                href={
                                  resume.fileUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                              >
                                Open

                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}

                          </div>
                        ),
                      )}

                    {!selectedApplication
                      .candidateProfile
                      ?.resumes?.length && (
                      <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-500">
                        No resume uploaded.
                      </p>
                    )}

                  </div>

                </section>


                {/* Social links */}

                <section>

                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <Globe2 className="h-4 w-4 text-indigo-300" />
                    Candidate Links
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {selectedApplication
                      .candidateProfile
                      ?.linkedin && (
                      <a
                        href={
                          selectedApplication
                            .candidateProfile
                            .linkedin
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        <FaLinkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}


                    {selectedApplication
                      .candidateProfile
                      ?.github && (
                      <a
                        href={
                          selectedApplication
                            .candidateProfile
                            .github
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        <FaGithub className="h-4 w-4" />
                        GitHub
                      </a>
                    )}


                    {selectedApplication
                      .candidateProfile
                      ?.portfolio && (
                      <a
                        href={
                          selectedApplication
                            .candidateProfile
                            .portfolio
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        <Globe2 className="h-4 w-4" />
                        Portfolio
                      </a>
                    )}

                  </div>

                </section>

              </div>

            </div>


            {/* =================================================
                MODAL FOOTER
            ================================================== */}

            <div className="border-t border-white/10 bg-black/20 p-4 sm:p-5">

              <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <select
                    value={
                      selectedApplication.status ??
                      "APPLIED"
                    }
                    disabled={updatingStatus}
                    onChange={(event) =>
                      updateStatus(
                        selectedApplication,
                        event.target.value as ApplicationStatus,
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-sm text-slate-200 outline-none transition focus:border-indigo-400/50 disabled:opacity-60"
                  >
                    <option value="APPLIED">
                      Applied
                    </option>

                    <option value="REVIEWING">
                      Reviewing
                    </option>

                    <option value="SHORTLISTED">
                      Shortlisted
                    </option>

                    <option value="INTERVIEW">
                      Interview
                    </option>

                    <option value="ACCEPTED">
                      Accepted
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>

                    <option value="WITHDRAWN">
                      Withdrawn
                    </option>
                  </select>

                  {updatingStatus ? (
                    <Loader2 className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-indigo-300" />
                  ) : (
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  )}

                </div>


                <Link
                  href="/recruiter/messages"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
                >
                  <MessageCircle className="h-4 w-4" />

                  Message Candidate
                </Link>

              </div>

            </div>

          </motion.div>

        </div>
      )}

    </motion.main>
  );
}