"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Loader2,
  MapPin,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import {
  useDeleteMyApplication,
  useMyApplications,
} from "../jobs/useJobs";

import ParticleWave from "@/components/ui/particle-wave";

/* =========================================================
   TYPES
========================================================= */

type ApplicationStatus =
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN"
  | string;

interface CandidateCompany {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
}

interface CandidateJob {
  id: string;
  companyId?: string | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  image?: string | null;
  remoteType?: string | null;
  employmentType?: string | null;
  experienceLevel?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  deadline?: string | null;
  status?: string | null;
  company?: CandidateCompany | null;
  requiredSkills?: {
    id: string;
    jobId: string;
    name: string;
    priority: string;
  }[];
}

interface CandidateApplication {
  id: string;
  candidateProfileId: string;
  jobId: string;
  coverLetter?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: CandidateJob | null;
}

type StatusFilter =
  | "ALL"
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED";

/* =========================================================
   API RESPONSE TYPES
========================================================= */

/**
 * Your backend returns:
 *
 * {
 *   success: true,
 *   message: "...",
 *   data: [...]
 * }
 *
 * Depending on apiClient implementation, React Query may receive:
 *
 * 1. data array directly
 * 2. full response object
 * 3. { data: [...] }
 *
 * We support all three without changing your API or hooks.
 */

interface ApplicationApiResponse {
  success?: boolean;
  message?: string;
  data?: CandidateApplication[] | CandidateApplication;
}

/* =========================================================
   HELPERS
========================================================= */

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong while loading your applications.";
}

function formatDate(date?: string | null): string {
  if (!date) {
    return "Unknown date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function formatEmploymentType(value?: string | null): string {
  if (!value) {
    return "Not specified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function formatExperienceLevel(value?: string | null): string {
  if (!value) {
    return "Experience not specified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function getStatusLabel(status: ApplicationStatus): string {
  switch (status.toUpperCase()) {
    case "APPLIED":
      return "Applied";

    case "REVIEWING":
      return "Under Review";

    case "SHORTLISTED":
      return "Shortlisted";

    case "INTERVIEW":
      return "Interview";

    case "ACCEPTED":
      return "Accepted";

    case "REJECTED":
      return "Rejected";

    case "WITHDRAWN":
      return "Withdrawn";

    default:
      return status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) =>
          character.toUpperCase(),
        );
  }
}

function getStatusIcon(status: ApplicationStatus) {
  switch (status.toUpperCase()) {
    case "ACCEPTED":
      return CheckCircle2;

    case "REJECTED":
      return XCircle;

    case "SHORTLISTED":
      return Sparkles;

    case "INTERVIEW":
      return CalendarDays;

    case "REVIEWING":
      return Clock3;

    case "WITHDRAWN":
      return XCircle;

    default:
      return Send;
  }
}

function getStatusClasses(status: ApplicationStatus): string {
  switch (status.toUpperCase()) {
    case "ACCEPTED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "REJECTED":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    case "SHORTLISTED":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";

    case "INTERVIEW":
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";

    case "REVIEWING":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "WITHDRAWN":
      return "border-slate-400/20 bg-slate-400/10 text-slate-400";

    default:
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }
}

function getCompanyName(job?: CandidateJob | null): string {
  return job?.company?.name ?? "Company";
}

/* =========================================================
   IMPORTANT RESPONSE NORMALIZER
========================================================= */

function normalizeApplications(
  response: unknown,
): CandidateApplication[] {
  if (!response) {
    return [];
  }

  /**
   * Case 1:
   * apiClient already unwraps `data`
   *
   * [
   *   { id: "...", job: {...} }
   * ]
   */
  if (Array.isArray(response)) {
    return response as CandidateApplication[];
  }

  /**
   * Case 2:
   * apiClient returns:
   *
   * {
   *   success: true,
   *   message: "...",
   *   data: [...]
   * }
   */
  if (
    typeof response === "object" &&
    response !== null
  ) {
    const apiResponse =
      response as ApplicationApiResponse;

    if (Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    }

    /**
     * Case 3:
     * Some api clients may return:
     *
     * {
     *   data: {
     *     data: [...]
     *   }
     * }
     */

    const nestedData = (
      response as {
        data?: unknown;
      }
    ).data;

    if (
      typeof nestedData === "object" &&
      nestedData !== null &&
      "data" in nestedData
    ) {
      const innerData = (
        nestedData as {
          data?: unknown;
        }
      ).data;

      if (Array.isArray(innerData)) {
        return innerData as CandidateApplication[];
      }
    }
  }

  return [];
}

/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  description: string;
}

function StatCard({
  label,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.065]"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-400/20" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-cyan-300">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const Icon = getStatusIcon(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
        status,
      )}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {getStatusLabel(status)}
    </span>
  );
}

/* =========================================================
   INFO PILL
========================================================= */

function InfoPill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/7 bg-white/[0.025] px-3 py-2.5 text-xs text-slate-400">
      <span className="shrink-0 text-slate-500">
        {icon}
      </span>

      <span className="truncate">{label}</span>
    </div>
  );
}

/* =========================================================
   APPLICATION CARD
========================================================= */

interface ApplicationCardProps {
  application: CandidateApplication;
  onDelete: (
    application: CandidateApplication,
  ) => void;
  deleting: boolean;
}

function ApplicationCard({
  application,
  onDelete,
  deleting,
}: ApplicationCardProps) {
  const job = application.job;

  const status = application.status?.toUpperCase() ?? "";

  const isWithdrawn = status === "WITHDRAWN";
  const isRejected = status === "REJECTED";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.045] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.09]" />

      <div className="relative">
        {/* HEADER */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
              {job?.image ? (
                <img
                  src={job.image}
                  alt={getCompanyName(job)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-cyan-300" />
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-2">
                <StatusBadge
                  status={
                    application.status || "APPLIED"
                  }
                />
              </div>

              <h2 className="truncate text-lg font-semibold text-white sm:text-xl">
                {job?.title ?? "Job Application"}
              </h2>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                <Building2 className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate">
                  {getCompanyName(job)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />

            Applied {formatDate(application.createdAt)}
          </div>
        </div>

        {/* JOB INFORMATION */}

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <InfoPill
            icon={
              <MapPin className="h-3.5 w-3.5" />
            }
            label={
              job?.location ??
              "Location not specified"
            }
          />

          <InfoPill
            icon={
              <BriefcaseBusiness className="h-3.5 w-3.5" />
            }
            label={formatEmploymentType(
              job?.employmentType,
            )}
          />

          <InfoPill
            icon={
              <Clock3 className="h-3.5 w-3.5" />
            }
            label={formatExperienceLevel(
              job?.experienceLevel,
            )}
          />
        </div>

        {/* SALARY */}

        {(job?.salaryMin != null ||
          job?.salaryMax != null) && (
          <div className="mt-2 rounded-xl border border-white/7 bg-white/[0.025] px-3 py-2.5 text-xs text-slate-400">
            <span className="font-medium text-slate-500">
              Salary:
            </span>{" "}
            {job?.salaryMin?.toLocaleString() ??
              "—"}{" "}
            -{" "}
            {job?.salaryMax?.toLocaleString() ??
              "—"}{" "}
            {job?.salaryCurrency ?? ""}
          </div>
        )}

        {/* COVER LETTER */}

        {application.coverLetter && (
          <div className="mt-5 rounded-2xl border border-white/7 bg-white/[0.025] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <FileText className="h-3.5 w-3.5" />

              Cover Letter
            </div>

            <p className="line-clamp-2 text-sm leading-6 text-slate-400">
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* REQUIRED SKILLS */}

        {job?.requiredSkills &&
          job.requiredSkills.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Required Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(
                  (skill) => (
                    <span
                      key={skill.id}
                      className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.05] px-2.5 py-1.5 text-xs text-cyan-300"
                    >
                      {skill.name}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}

        {/* FOOTER */}

        <div className="mt-5 flex flex-col gap-3 border-t border-white/7 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              Last updated{" "}
              {formatDate(application.updatedAt)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {job?.id && (
              <Link
                href={`/jobs/${job.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                View Job

                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {!isWithdrawn && !isRejected && (
              <button
                type="button"
                onClick={() =>
                  onDelete(application)
                }
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/25 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                Withdraw
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function ApplicationSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex gap-4">
        <div className="h-14 w-14 rounded-2xl bg-white/10" />

        <div className="flex-1">
          <div className="h-4 w-24 rounded bg-white/10" />

          <div className="mt-3 h-5 w-2/3 rounded bg-white/10" />

          <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <div className="h-10 rounded-xl bg-white/5" />
        <div className="h-10 rounded-xl bg-white/5" />
        <div className="h-10 rounded-xl bg-white/5" />
      </div>

      <div className="mt-5 h-12 rounded-xl bg-white/5" />
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyApplications({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.08]">
        <BriefcaseBusiness className="h-7 w-7 text-cyan-300" />
      </div>

      <h3 className="mt-5 text-xl font-semibold text-white">
        {hasFilters
          ? "No matching applications"
          : "No applications yet"}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or status filter to find other applications."
          : "Once you apply for a job, your applications and their current status will appear here."}
      </p>

      {!hasFilters && (
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Explore Jobs

          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </motion.div>
  );
}

/* =========================================================
   ERROR STATE
========================================================= */

function ApplicationsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-400/15 bg-red-400/[0.05] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10">
        <AlertCircle className="h-6 w-6 text-red-300" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white">
        Unable to load applications
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.1]"
      >
        Try Again
      </button>
    </div>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteApplicationModal({
  application,
  open,
  loading,
  onClose,
  onConfirm,
}: {
  application: CandidateApplication | null;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const job = application?.job;

  return (
    <AnimatePresence>
      {open && application && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10">
                <Trash2 className="h-5 w-5 text-red-300" />
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Withdraw application?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to withdraw
              your application for{" "}
              <span className="font-medium text-slate-200">
                {job?.title ??
                  "this position"}
              </span>
              ?
            </p>

            <div className="mt-5 rounded-2xl border border-white/7 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">
                {job?.title ??
                  "Job Application"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {getCompanyName(job)}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Keep Application
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading
                  ? "Withdrawing..."
                  : "Withdraw Application"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ApplicationsPage() {
  const {
    data: applicationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyApplications();

  const deleteApplication =
    useDeleteMyApplication();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<CandidateApplication | null>(
    null,
  );

  /* =======================================================
     NORMALIZE API RESPONSE
  ======================================================= */

  const applications = useMemo<
    CandidateApplication[]
  >(() => {
    return normalizeApplications(
      applicationsData,
    );
  }, [applicationsData]);

  /* =======================================================
     FILTER APPLICATIONS
  ======================================================= */

  const filteredApplications = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return applications.filter(
      (application) => {
        const job = application.job;

        const title =
          job?.title?.toLowerCase() ?? "";

        const company =
          getCompanyName(job).toLowerCase();

        const location =
          job?.location?.toLowerCase() ?? "";

        const matchesSearch =
          !normalizedSearch ||
          title.includes(
            normalizedSearch,
          ) ||
          company.includes(
            normalizedSearch,
          ) ||
          location.includes(
            normalizedSearch,
          );

        const matchesStatus =
          statusFilter === "ALL" ||
          application.status
            .toUpperCase() ===
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
     STATISTICS
  ======================================================= */

  const statistics = useMemo(() => {
    return {
      total: applications.length,

      active: applications.filter(
        (application) => {
          const status =
            application.status.toUpperCase();

          return (
            status !== "REJECTED" &&
            status !== "WITHDRAWN" &&
            status !== "ACCEPTED"
          );
        },
      ).length,

      interviews: applications.filter(
        (application) =>
          application.status.toUpperCase() ===
          "INTERVIEW",
      ).length,

      shortlisted: applications.filter(
        (application) =>
          application.status.toUpperCase() ===
          "SHORTLISTED",
      ).length,

      accepted: applications.filter(
        (application) =>
          application.status.toUpperCase() ===
          "ACCEPTED",
      ).length,
    };
  }, [applications]);

  /* =======================================================
     DELETE HANDLER
  ======================================================= */

  const handleDelete = async () => {
    if (!selectedApplication) {
      return;
    }

    try {
      await deleteApplication.mutateAsync(
        selectedApplication.id,
      );

      setSelectedApplication(null);
    } catch {
      // Keep modal open when mutation fails.
    }
  };

  const errorMessage =
    getErrorMessage(error);

  /* =======================================================
     DEBUG
  ======================================================= */

  console.log(
    "Applications API response:",
    applicationsData,
  );

  console.log(
    "Normalized applications:",
    applications,
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* PARTICLE WAVE */}

      <div className="pointer-events-none absolute inset-0 z-0 opacity-100">
        <ParticleWave />
      </div>

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />

      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.10),transparent_35%)]" />

      {/* CONTENT */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="mb-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-medium text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />

                Candidate Dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                My Applications
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Track every job you&apos;ve
                applied to, monitor application
                progress, and stay on top of
                your career opportunities.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
            >
              Find More Jobs

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* STATISTICS */}

        {!isLoading && !isError && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              label="Total"
              value={statistics.total}
              icon={
                <BriefcaseBusiness className="h-5 w-5" />
              }
              description="All applications"
            />

            <StatCard
              label="Active"
              value={statistics.active}
              icon={
                <Clock3 className="h-5 w-5" />
              }
              description="Still in progress"
            />

            <StatCard
              label="Shortlisted"
              value={statistics.shortlisted}
              icon={
                <Sparkles className="h-5 w-5" />
              }
              description="Great progress"
            />

            <StatCard
              label="Interviews"
              value={statistics.interviews}
              icon={
                <CalendarDays className="h-5 w-5" />
              }
              description="Interview stage"
            />

            <StatCard
              label="Accepted"
              value={statistics.accepted}
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              description="Successful"
            />
          </div>
        )}

        {/* MAIN PANEL */}

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
          {/* SEARCH */}

          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by job, company, location..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/30 focus:bg-white/[0.06]"
              />
            </div>

            {/* STATUS FILTERS */}

            <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 xl:w-auto">
              <div className="mr-1 flex shrink-0 items-center gap-2 text-xs text-slate-500">
                <Filter className="h-3.5 w-3.5" />

                Status
              </div>

              {(
                [
                  "ALL",
                  "APPLIED",
                  "REVIEWING",
                  "SHORTLISTED",
                  "INTERVIEW",
                  "ACCEPTED",
                  "REJECTED",
                ] as StatusFilter[]
              ).map((status) => {
                const active =
                  statusFilter === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        status,
                      )
                    }
                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
                      active
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/7 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    {status === "ALL"
                      ? "All"
                      : getStatusLabel(
                          status,
                        )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RESULT COUNT */}

          {!isLoading && !isError && (
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-300">
                  {
                    filteredApplications.length
                  }
                </span>{" "}
                application
                {filteredApplications.length !==
                1
                  ? "s"
                  : ""}
              </p>

              {(search ||
                statusFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter(
                      "ALL",
                    );
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />

                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* LOADING */}

          {isLoading && (
            <div className="space-y-4">
              <ApplicationSkeleton />
              <ApplicationSkeleton />
              <ApplicationSkeleton />
            </div>
          )}

          {/* ERROR */}

          {!isLoading && isError && (
            <ApplicationsError
              message={errorMessage}
              onRetry={() => {
                void refetch();
              }}
            />
          )}

          {/* EMPTY */}

          {!isLoading &&
            !isError &&
            filteredApplications.length ===
              0 && (
              <EmptyApplications
                hasFilters={
                  Boolean(search) ||
                  statusFilter !== "ALL"
                }
              />
            )}

          {/* APPLICATION LIST */}

          {!isLoading &&
            !isError &&
            filteredApplications.length >
              0 && (
              <motion.div
                layout
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredApplications.map(
                    (application) => (
                      <ApplicationCard
                        key={
                          application.id
                        }
                        application={
                          application
                        }
                        deleting={
                          deleteApplication.isPending &&
                          selectedApplication?.id ===
                            application.id
                        }
                        onDelete={
                          setSelectedApplication
                        }
                      />
                    ),
                  )}
                </AnimatePresence>
              </motion.div>
            )}
        </section>

        {/* BOTTOM INFO */}

        {!isLoading &&
          !isError &&
          applications.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.3,
              }}
              className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/7 bg-white/[0.025] p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400/70" />

                Your applications are
                automatically synchronized
                with the recruitment system.
              </div>

              <span>
                Last synced:{" "}
                {formatDate(
                  new Date().toISOString(),
                )}
              </span>
            </motion.div>
          )}
      </div>

      {/* DELETE MODAL */}

      <DeleteApplicationModal
        application={
          selectedApplication
        }
        open={Boolean(
          selectedApplication,
        )}
        loading={
          deleteApplication.isPending
        }
        onClose={() => {
          if (
            !deleteApplication.isPending
          ) {
            setSelectedApplication(
              null,
            );
          }
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </main>
  );
}