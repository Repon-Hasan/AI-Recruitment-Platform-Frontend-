"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaBriefcase,
  FaBuilding,
  FaCalendarCheck,
  FaCalendarDays,
  FaCheck,
  FaChevronDown,
  FaClock,
  FaComments,
  FaLocationDot,
  FaPhone,
  FaRotate,
  FaVideo,
  FaUsers,
  FaXmark,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "motion/react";
import { FaExclamationTriangle} from 'react-icons/fa';

import {
  interviewApi,
  type Interview,
  type InterviewStatus,
} from "@/lib/api/interview";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";


/* =========================================================
   Types
========================================================= */

type FilterType =
  | "ALL"
  | "UPCOMING"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

type InterviewWithDetails = Interview & {
  application?: {
    id?: string;
    candidateProfile?: {
      id?: string;
      user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      } | null;
      phone?: string | null;
      location?: string | null;
      experience?: string | null;
    } | null;
    job?: {
      id?: string;
      title?: string | null;
      location?: string | null;
      company?: {
        id?: string;
        name?: string | null;
      } | null;
    } | null;
  } | null;

  jobApplication?: {
    id?: string;
    candidateProfile?: {
      id?: string;
      user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      } | null;
      phone?: string | null;
      location?: string | null;
      experience?: string | null;
    } | null;
    job?: {
      id?: string;
      title?: string | null;
      location?: string | null;
      company?: {
        id?: string;
        name?: string | null;
      } | null;
    } | null;
  } | null;
};

/* =========================================================
   Helpers
========================================================= */

function formatStatus(status: InterviewStatus) {
  switch (status) {
    case "SCHEDULED":
      return "Scheduled";

    case "STARTED":
      return "Live Now";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "RESCHEDULED":
      return "Rescheduled";

    default:
      return status;
  }
}

function formatType(type: Interview["type"]) {
  switch (type) {
    case "VIDEO":
      return "Video Interview";

    case "PHONE":
      return "Phone Interview";

    case "IN_PERSON":
      return "In Person";

    default:
      return type;
  }
}

function getStatusClasses(status: InterviewStatus) {
  switch (status) {
    case "SCHEDULED":
      return {
        badge:
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
        icon:
          "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      };

    case "STARTED":
      return {
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
        icon:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      };

    case "COMPLETED":
      return {
        badge:
          "border-gray-200 bg-gray-100 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300",
        icon:
          "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
      };

    case "CANCELLED":
      return {
        badge:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
        icon:
          "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      };

    case "RESCHEDULED":
      return {
        badge:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
        icon:
          "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      };

    default:
      return {
        badge:
          "border-gray-200 bg-gray-100 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300",
        icon:
          "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
      };
  }
}

function getStatusIcon(status: InterviewStatus) {
  switch (status) {
    case "SCHEDULED":
      return <FaCalendarCheck />;

    case "STARTED":
      return <FaVideo />;

    case "COMPLETED":
      return <FaCheck />;

    case "CANCELLED":
      return <FaXmark />;

    case "RESCHEDULED":
      return <FaRotate />;

    default:
      return <FaCalendarDays />;
  }
}

function getTypeIcon(type: Interview["type"]) {
  switch (type) {
    case "VIDEO":
      return <FaVideo />;

    case "PHONE":
      return <FaPhone />;

    case "IN_PERSON":
      return <FaLocationDot />;

    default:
      return <FaCalendarDays />;
  }
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Invalid date";
  }

  return value.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "--:--";
  }

  return value.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isToday(date: string) {
  const value = new Date(date);
  const now = new Date();

  return (
    value.getDate() === now.getDate() &&
    value.getMonth() === now.getMonth() &&
    value.getFullYear() === now.getFullYear()
  );
}

function getInitials(name?: string | null) {
  if (!name) return "C";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getCandidate(interview: InterviewWithDetails) {
  return (
    interview.application?.candidateProfile ??
    interview.jobApplication?.candidateProfile ??
    null
  );
}

function getJob(interview: InterviewWithDetails) {
  return (
    interview.application?.job ??
    interview.jobApplication?.job ??
    null
  );
}

function getApplicationId(interview: InterviewWithDetails) {
  return (
    interview.jobApplicationId ||
    interview.application?.id ||
    interview.jobApplication?.id ||
    ""
  );
}

/* =========================================================
   Skeleton
========================================================= */

function InterviewSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-52 animate-pulse rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
        />
        
      ))}
    </div>
  );
}

/* =========================================================
   Empty State
========================================================= */

function EmptyState({
  filter,
  onReset,
}: {
  filter: FilterType;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <FaCalendarDays className="text-2xl" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
        {filter === "ALL"
          ? "No interviews yet"
          : `No ${filter.toLowerCase()} interviews`}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
        Interviews scheduled for your job applications will appear here.
        You can open an application to communicate directly with the
        candidate.
      </p>

      {filter !== "ALL" && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <FaRotate />
          View all interviews
        </button>
      )}
    </motion.div>
  );
}

/* =========================================================
   Interview Card
========================================================= */

function InterviewCard({
  interview,
  index,
}: {
  interview: InterviewWithDetails;
  index: number;
}) {
  const candidate = getCandidate(interview);
  const job = getJob(interview);

  const candidateName =
    candidate?.user?.name || "Candidate";

  const candidateEmail =
    candidate?.user?.email || "No email available";

  const applicationId = getApplicationId(interview);

  const statusClasses = getStatusClasses(interview.status);

  const isLive = interview.status === "STARTED";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.35),
      }}
      whileHover={{
        y: -3,
      }}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-gray-200/40 dark:border-white/10 dark:bg-[#111318] dark:hover:shadow-black/20"
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              {candidate?.user?.image ? (
                <img
                  src={candidate.user.image}
                  alt={candidateName}
                  className="h-14 w-14 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-white/5"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white ring-4 ring-gray-50 dark:ring-white/5">
                  {getInitials(candidateName)}
                </div>
              )}

              {isLive && (
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                  }}
                  className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-[#111318]"
                />
              )}
            </div>

            {/* Candidate */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-bold text-gray-900 dark:text-white">
                  {candidateName}
                </h2>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses.badge}`}
                >
                  {getStatusIcon(interview.status)}
                  {formatStatus(interview.status)}
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                {candidateEmail}
              </p>

              {candidate?.location && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                  <FaLocationDot />
                  {candidate.location}
                </p>
              )}
            </div>
          </div>

          {/* Date / time */}
          <div className="shrink-0 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <FaCalendarDays className="text-blue-500" />
              {formatDate(interview.scheduledAt)}
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaClock />
              {formatTime(interview.scheduledAt)}
              <span>•</span>
              {interview.durationMinutes} min
            </div>

            {isToday(interview.scheduledAt) && (
              <div className="mt-2 inline-flex rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                Today
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-100 dark:border-white/5" />

        {/* Details */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Job */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FaBriefcase />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Position
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {job?.title || "Job position"}
              </p>
            </div>
          </div>

          {/* Company */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <FaBuilding />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Company
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {job?.company?.name || "Your company"}
              </p>
            </div>
          </div>

          {/* Interview type */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              {getTypeIcon(interview.type)}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Interview type
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatType(interview.type)}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <FaLocationDot />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Location
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {job?.location || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {interview.notes && (
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/[0.025]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Interview notes
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {interview.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FaUsers />
            Candidate communication is available from the application.
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Meeting */}
            {interview.meetingUrl &&
              interview.status !== "COMPLETED" &&
              interview.status !== "CANCELLED" && (
                <a
                  href={interview.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                >
                  <FaVideo />
                  Join interview
                </a>
              )}

            {/* Communication */}
            {applicationId ? (
              <Link
                href={`/recruiter/applications/${applicationId}`}
                className="group/button inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                <FaComments />

                <span>Communicate</span>

                <FaArrowRight className="text-xs transition-transform group-hover/button:translate-x-1" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-400 dark:bg-white/10 dark:text-gray-500"
              >
                <FaComments />
                Application unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function RecruiterInterviewsPage() {
  const [interviews, setInterviews] = useState<
    InterviewWithDetails[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] =
    useState<FilterType>("ALL");

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [now, setNow] = useState(0);

  /* =======================================================
     Load interviews
  ======================================================= */

  const loadInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await interviewApi.getAll();

      setInterviews(
        Array.isArray(data)
          ? (data as InterviewWithDetails[])
          : [],
      );
    } catch (err) {
      console.error("Failed to load recruiter interviews:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load interviews.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInterviews();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadInterviews]);

  useEffect(() => {
    const updateNow = () => setNow(Date.now());

    updateNow();
    const intervalId = window.setInterval(updateNow, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  /* =======================================================
     Stats
  ======================================================= */

  const stats = useMemo(() => {
    const upcoming = interviews.filter(
      (interview) =>
        (interview.status === "SCHEDULED" ||
          interview.status === "RESCHEDULED") &&
        new Date(interview.scheduledAt).getTime() >= now,
    ).length;

    const started = interviews.filter(
      (interview) => interview.status === "STARTED",
    ).length;

    const completed = interviews.filter(
      (interview) => interview.status === "COMPLETED",
    ).length;

    const cancelled = interviews.filter(
      (interview) => interview.status === "CANCELLED",
    ).length;

    return {
      total: interviews.length,
      upcoming,
      started,
      completed,
      cancelled,
    };
  }, [interviews, now]);

  /* =======================================================
     Filter
  ======================================================= */

  const filteredInterviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return interviews
      .filter((interview) => {
        const candidate = getCandidate(interview);
        const job = getJob(interview);

        const candidateName =
          candidate?.user?.name?.toLowerCase() || "";

        const candidateEmail =
          candidate?.user?.email?.toLowerCase() || "";

        const jobTitle =
          job?.title?.toLowerCase() || "";

        const companyName =
          job?.company?.name?.toLowerCase() || "";

        const matchesSearch =
          !query ||
          candidateName.includes(query) ||
          candidateEmail.includes(query) ||
          jobTitle.includes(query) ||
          companyName.includes(query);

        if (!matchesSearch) {
          return false;
        }

        switch (filter) {
          case "UPCOMING":
            return (
              (interview.status === "SCHEDULED" ||
                interview.status === "RESCHEDULED") &&
              new Date(interview.scheduledAt).getTime() >=
                now
            );

          case "STARTED":
            return interview.status === "STARTED";

          case "COMPLETED":
            return interview.status === "COMPLETED";

          case "CANCELLED":
            return interview.status === "CANCELLED";

          case "ALL":
          default:
            return true;
        }
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime(),
      );
  }, [interviews, filter, search, now]);

  /* =======================================================
     Filter tabs
  ======================================================= */

  const filterTabs: Array<{
    id: FilterType;
    label: string;
    count: number;
  }> = [
    {
      id: "ALL",
      label: "All",
      count: stats.total,
    },
    {
      id: "UPCOMING",
      label: "Upcoming",
      count: stats.upcoming,
    },
    {
      id: "STARTED",
      label: "Live",
      count: stats.started,
    },
    {
      id: "COMPLETED",
      label: "Completed",
      count: stats.completed,
    },
    {
      id: "CANCELLED",
      label: "Cancelled",
      count: stats.cancelled,
    },
  ];

  /* =======================================================
     Error
  ======================================================= */

  if (!loading && error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-[#08090b] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-3xl border border-red-200 bg-white p-8 text-center dark:border-red-500/20 dark:bg-[#111318]"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <FaExclamationTriangle />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
              Unable to load interviews
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadInterviews()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <FaRotate />
              Try again
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  /* =======================================================
     Render
  ======================================================= */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#08090b]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =================================================
            Hero
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111318] sm:p-8"
        >
          {/* Background decoration */}
          <motion.div
            animate={{
              x: [0, 25, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
          />

          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                <FaCalendarCheck />
                Recruiter Interview Center
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Interviews
              </h1>
                   
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
                Manage candidate interviews, join scheduled meetings,
                and communicate with applicants from one place.
              </p>
            </div>

            {/* Refresh */}
            <motion.button
              type="button"
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => void loadInterviews()}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200 dark:hover:border-blue-500/30 dark:hover:text-blue-300"
            >
              <Button
  asChild
  variant="outline"
  className="group h-11 rounded-xl border-slate-200 bg-white/90 px-4 font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
>
  <a href="/recruiter/dashboard">
    <ArrowUpRight className="mr-2 h-4 w-4 rotate-45 transition-transform duration-200 group-hover:rotate-0" />
    Back to dashboard
  </a>
</Button>
              <FaRotate
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </motion.button>
          </div>
        </motion.section>

        {/* =================================================
            Stats
        ================================================= */}

        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: <FaCalendarDays />,
              iconClass:
                "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
            },
            {
              label: "Upcoming",
              value: stats.upcoming,
              icon: <FaClock />,
              iconClass:
                "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
            },
            {
              label: "Live now",
              value: stats.started,
              icon: <FaVideo />,
              iconClass:
                "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: <FaCheck />,
              iconClass:
                "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              icon: <FaXmark />,
              iconClass:
                "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.06,
                duration: 0.4,
              }}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111318]"
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  {stat.icon}
                </div>

                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>

              <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </section>

        {/* =================================================
            Filters
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mt-6 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#111318]"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Tabs */}
            <div className="flex min-w-0 gap-1 overflow-x-auto pb-1 lg:pb-0">
              {filterTabs.map((tab) => {
                const active = filter === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active
                          ? "bg-white/15 text-white dark:bg-gray-900/10 dark:text-gray-900"
                          : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1 lg:w-72">
                <FaUsers className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search candidate or job..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:border-blue-500/40 dark:focus:bg-white/[0.04]"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters((value) => !value)
                }
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 lg:hidden"
              >
                <FaChevronDown
                  className={`transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
                Filter
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
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
                className="overflow-hidden lg:hidden"
              >
                <div className="mt-3 border-t border-gray-100 pt-3 dark:border-white/5">
                  <p className="text-xs text-gray-400">
                    Select a status above to filter your interviews.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* =================================================
            Content
        ================================================= */}

        <section className="mt-6">
          {loading ? (
            <InterviewSkeleton />
          ) : filteredInterviews.length === 0 ? (
            <EmptyState
              filter={filter}
              onReset={() => {
                setFilter("ALL");
                setSearch("");
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredInterviews.length}
                  </span>{" "}
                  {filteredInterviews.length === 1
                    ? "interview"
                    : "interviews"}
                </p>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredInterviews.map(
                  (interview, index) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      index={index}
                    />
                  ),
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}