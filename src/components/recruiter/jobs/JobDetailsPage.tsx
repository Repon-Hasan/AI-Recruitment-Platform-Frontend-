"use client";

import ParticleWave from "@/components/ui/particle-wave";
import {
  recruiterApi,
  type RecruiterJob,
} from "@/lib/api/recruiter.api";



import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Copy,
  Edit3,
  Globe2,
  Laptop,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  PauseCircle,
  Pencil,
  Send,
  Sparkles,
  Target,
  Users,
  XCircle,
} from "lucide-react";

import {
  motion,
  type Variants,
} from "motion/react";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   PROPS
========================================================= */

interface JobDetailsPageProps {
  jobId: string;
}

/* =========================================================
   TYPES
========================================================= */

type JobStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED";

/* =========================================================
   ANIMATION
========================================================= */

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const stagger: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   HELPERS
========================================================= */

const formatEnum = (
  value?: string | null,
) => {
  if (!value) {
    return "Not specified";
  }

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
};

const formatCurrency = (
  value?: number | null,
  currency = "BDT",
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "Not specified";
  }

  return `${currency} ${new Intl.NumberFormat(
    "en-BD",
  ).format(value)}`;
};

const formatSalary = (
  job: RecruiterJob,
) => {
  const min = job.salaryMin;
  const max = job.salaryMax;

  const currency =
    job.salaryCurrency ?? "BDT";

  if (
    min === null ||
    min === undefined
  ) {
    if (
      max !== null &&
      max !== undefined
    ) {
      return `Up to ${formatCurrency(
        max,
        currency,
      )}`;
    }

    return "Salary not specified";
  }

  if (
    max !== null &&
    max !== undefined
  ) {
    return `${formatCurrency(
      min,
      currency,
    )} – ${formatCurrency(
      max,
      currency,
    )}`;
  }

  return `${formatCurrency(
    min,
    currency,
  )}+`;
};

const formatDate = (
  value?: string | null,
  includeTime = false,
) => {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString(
    "en-BD",
    {
      day: "numeric",
      month: "long",
      year: "numeric",

      ...(includeTime
        ? {
            hour: "numeric",
            minute: "2-digit",
          }
        : {}),
    },
  );
};

const getDeadlineState = (
  deadline?: string | null,
) => {
  if (!deadline) {
    return {
      label: "No deadline",
      className:
        "border-white/10 bg-white/[0.04] text-slate-400",
    };
  }

  const deadlineDate =
    new Date(deadline);

  if (
    Number.isNaN(
      deadlineDate.getTime(),
    )
  ) {
    return {
      label: "Invalid deadline",
      className:
        "border-red-400/20 bg-red-500/10 text-red-300",
    };
  }

  const difference =
    deadlineDate.getTime() -
    Date.now();

  const days = Math.ceil(
    difference /
      (1000 * 60 * 60 * 24),
  );

  if (days < 0) {
    return {
      label: "Expired",
      className:
        "border-red-400/20 bg-red-500/10 text-red-300",
    };
  }

  if (days === 0) {
    return {
      label: "Ends today",
      className:
        "border-red-400/20 bg-red-500/10 text-red-300",
    };
  }

  if (days <= 3) {
    return {
      label: `${days} day${
        days === 1 ? "" : "s"
      } left`,
      className:
        "border-amber-400/20 bg-amber-500/10 text-amber-300",
    };
  }

  return {
    label: `${days} days left`,
    className:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  };
};

const getStatusStyle = (
  status?: string | null,
) => {
  switch (status) {
    case "PUBLISHED":
      return {
        className:
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
        icon: CheckCircle2,
      };

    case "CLOSED":
      return {
        className:
          "border-red-400/20 bg-red-500/10 text-red-300",
        icon: XCircle,
      };

    case "DRAFT":
    default:
      return {
        className:
          "border-amber-400/20 bg-amber-500/10 text-amber-300",
        icon: PauseCircle,
      };
  }
};

/* =========================================================
   PAGE
========================================================= */

export default function JobDetailsPage({
  jobId,
}: JobDetailsPageProps) {
  const [job, setJob] =
    useState<RecruiterJob | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState("");

  /* =======================================================
     LOAD JOB
  ======================================================= */

  const loadJob =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const jobs =
          await recruiterApi.getJobs();

        const foundJob =
          jobs.find(
            (item) =>
              item.id === jobId,
          );

        if (!foundJob) {
          throw new Error(
            "Job not found or you do not have permission to view it.",
          );
        }

        setJob(foundJob);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load job details.",
        );
      } finally {
        setLoading(false);
      }
    }, [jobId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadJob();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadJob]);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const applications =
    job?._count
      ?.jobApplications ?? 0;

  const matches =
    job?._count?.matches ?? 0;

  const skills =
    job?.requiredSkills ?? [];

  const deadlineState =
    useMemo(
      () =>
        getDeadlineState(
          job?.deadline,
        ),
      [job?.deadline],
    );

  const statusStyle =
    useMemo(
      () =>
        getStatusStyle(
          job?.status,
        ),
      [job?.status],
    );

  /* =======================================================
     PUBLISH
  ======================================================= */

  const handlePublish =
    async () => {
      if (!job) {
        return;
      }

      try {
        setActionLoading(
          "publish",
        );
        setError("");

        const updated =
          await recruiterApi.publishJob(
            job.id,
          );

        setJob(updated);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to publish job.",
        );
      } finally {
        setActionLoading("");
      }
    };

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose =
    async () => {
      if (!job) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to close this job?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading("close");
        setError("");

        const updated =
          await recruiterApi.closeJob(
            job.id,
          );

        setJob(updated);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to close job.",
        );
      } finally {
        setActionLoading("");
      }
    };

  /* =======================================================
     DUPLICATE
  ======================================================= */

  const handleDuplicate =
    async () => {
      if (!job) {
        return;
      }

      try {
        setActionLoading(
          "duplicate",
        );
        setError("");

        const duplicated =
          await recruiterApi.duplicateJob(
            job.id,
          );

        window.location.href =
          `/recruiter/jobs/${duplicated.id}`;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to duplicate job.",
        );

        setActionLoading("");
      }
    };

  /* =======================================================
     COPY LINK
  ======================================================= */

  const handleCopyLink =
    async () => {
      try {
        await navigator.clipboard.writeText(
          window.location.href,
        );
      } catch {
        // Clipboard may be unavailable.
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !job) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <ParticleWave />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(6,182,212,0.08),transparent_30%)]" />

        <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            className="w-full rounded-[28px] border border-white/10 bg-white/[0.05] p-8 text-center shadow-2xl backdrop-blur-2xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-400">
              <XCircle className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Unable to load job
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {error ||
                "The requested job could not be found."}
            </p>

            <Link
              href="/my-jobs"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Jobs
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  const StatusIcon =
    statusStyle.icon;

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-45">
        <ParticleWave />
      </div>

      {/* Ambient gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.13),transparent_28%),radial-gradient(circle_at_90%_15%,rgba(6,182,212,0.10),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.08),transparent_30%)]" />

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            TOP NAV
        ================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href="/my-jobs"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-white/20 group-hover:bg-white/[0.08]">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </span>

            Back to My Jobs
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void handleCopyLink()
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-300 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </button>

            <Link
              href={`/recruiter/jobs/${job.id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-300 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
            >
              <Edit3 className="h-4 w-4" />
              Edit Job
            </Link>
          </div>
        </motion.div>

        {/* =================================================
            HERO
        ================================================= */}

        <motion.section
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8"
        >
          {/* Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Job identity */}
            <div className="flex min-w-0 gap-5">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  rotate: -5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-xl shadow-indigo-500/20"
              >
                <BriefcaseBusiness className="h-8 w-8 text-white" />
              </motion.div>

              <div className="min-w-0">
                {/* badges */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.className}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />

                    {formatEnum(
                      job.status,
                    )}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${deadlineState.className}`}
                  >
                    <CalendarClock className="h-3.5 w-3.5" />

                    {deadlineState.label}
                  </span>
                </div>

                {/* title */}
                <h1 className="break-words text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">
                  {job.title}
                </h1>

                {/* meta */}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-300" />
                    {job.location ||
                      "Location not specified"}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-cyan-300" />
                    {formatEnum(
                      job.remoteType,
                    )}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-violet-300" />
                    {formatEnum(
                      job.employmentType,
                    )}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-300" />
                    {formatEnum(
                      job.experienceLevel,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex shrink-0 flex-wrap gap-2">
              {job.status ===
                "DRAFT" && (
                <button
                  type="button"
                  onClick={() =>
                    void handlePublish()
                  }
                  disabled={
                    actionLoading !== ""
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading ===
                  "publish" ? (
                    <Spinner />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}

                  Publish
                </button>
              )}

              {job.status ===
                "PUBLISHED" && (
                <button
                  type="button"
                  onClick={() =>
                    void handleClose()
                  }
                  disabled={
                    actionLoading !== ""
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-5 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading ===
                  "close" ? (
                    <Spinner />
                  ) : (
                    <PauseCircle className="h-4 w-4" />
                  )}

                  Close Job
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  void handleDuplicate()
                }
                disabled={
                  actionLoading !== ""
                }
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ===
                "duplicate" ? (
                  <Spinner />
                ) : (
                  <Copy className="h-4 w-4" />
                )}

                Duplicate
              </button>
            </div>
          </div>
        </motion.section>

        {/* =================================================
            STATS
        ================================================= */}

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <StatCard
            icon={
              <Users className="h-5 w-5" />
            }
            label="Applications"
            value={String(
              applications,
            )}
            description="Candidates applied"
          />

          <StatCard
            icon={
              <Target className="h-5 w-5" />
            }
            label="AI Matches"
            value={String(matches)}
            description="Potential matches"
          />

          <StatCard
            icon={
              <Code2 className="h-5 w-5" />
            }
            label="Required Skills"
            value={String(
              skills.length,
            )}
            description="Skills requested"
          />

          <StatCard
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            label="Deadline"
            value={
              job.deadline
                ? new Date(
                    job.deadline,
                  ).toLocaleDateString(
                    "en-BD",
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )
                : "—"
            }
            description={
              job.deadline
                ? formatDate(
                    job.deadline,
                  )
                : "No deadline"
            }
          />
        </motion.div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_390px]"
        >
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">
            {/* About */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10 backdrop-blur-2xl sm:p-7"
            >
              <SectionTitle
                icon={
                  <BriefcaseBusiness className="h-5 w-5" />
                }
                title="About this position"
              />

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                  {job.description ||
                    "No job description has been provided."}
                </p>
              </div>
            </motion.section>

            {/* Skills */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10 backdrop-blur-2xl sm:p-7"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <SectionTitle
                  icon={
                    <Code2 className="h-5 w-5" />
                  }
                  title="Required skills"
                />

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-500">
                  {skills.length} skills
                </span>
              </div>

              {skills.length >
              0 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {skills.map(
                    (
                      skill,
                      index,
                    ) => (
                      <motion.div
                        key={
                          skill.id ||
                          `${skill.name}-${index}`
                        }
                        variants={
                          scaleIn
                        }
                        whileHover={{
                          y: -2,
                          scale: 1.01,
                        }}
                        className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-indigo-400/20 hover:bg-indigo-500/[0.04]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 transition group-hover:bg-indigo-500/15">
                            <Code2 className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {
                                skill.name
                              }
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-500">
                              Required skill
                            </p>
                          </div>
                        </div>

                        <SkillPriority
                          priority={
                            skill.name
                          }
                        />
                      </motion.div>
                    ),
                  )}
                </div>
              ) : (
                <EmptyBlock message="No required skills added to this job." />
              )}
            </motion.section>

            {/* Job details */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10 backdrop-blur-2xl sm:p-7"
            >
              <SectionTitle
                icon={
                  <Globe2 className="h-5 w-5" />
                }
                title="Job details"
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailRow
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                  label="Location"
                  value={
                    job.location ||
                    "Not specified"
                  }
                />

                <DetailRow
                  icon={
                    <Laptop className="h-4 w-4" />
                  }
                  label="Work arrangement"
                  value={formatEnum(
                    job.remoteType,
                  )}
                />

                <DetailRow
                  icon={
                    <BriefcaseBusiness className="h-4 w-4" />
                  }
                  label="Employment type"
                  value={formatEnum(
                    job.employmentType,
                  )}
                />

                <DetailRow
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  label="Experience level"
                  value={formatEnum(
                    job.experienceLevel,
                  )}
                />

                <DetailRow
                  icon={
                    <CircleDollarSign className="h-4 w-4" />
                  }
                  label="Salary range"
                  value={formatSalary(
                    job,
                  )}
                />

                <DetailRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Application deadline"
                  value={formatDate(
                    job.deadline,
                  )}
                />
              </div>
            </motion.section>

            {/* Timeline */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10 backdrop-blur-2xl sm:p-7"
            >
              <SectionTitle
                icon={
                  <Clock3 className="h-5 w-5" />
                }
                title="Job timeline"
              />

              <div className="relative mt-7 space-y-7 pl-8">
                <TimelineLine />

                <TimelineItem
                  icon={
                    <Pencil className="h-4 w-4" />
                  }
                  title="Job created"
                  date={formatDate(
                    job.createdAt,
                  )}
                  description="The job posting was created."
                />

                {job.createdAt && (
                  <TimelineItem
                    icon={
                      <CheckCircle2 className="h-4 w-4" />
                    }
                    title="Job published"
                    date={formatDate(
                      job.createdAt,
                    )}
                    description="Candidates can discover and apply to this position."
                  />
                )}

                <TimelineItem
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  title="Application deadline"
                  date={formatDate(
                    job.deadline,
                  )}
                  description={
                    deadlineState.label
                  }
                />

                {job.deadline && (
                  <TimelineItem
                    icon={
                      <XCircle className="h-4 w-4" />
                    }
                    title="Job closed"
                    date={formatDate(
                      job.deadline,
                    )}
                    description="This position is no longer accepting applications."
                  />
                )}
              </div>
            </motion.section>

            {/* System information */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10 backdrop-blur-2xl sm:p-7"
            >
              <SectionTitle
                icon={
                  <Sparkles className="h-5 w-5" />
                }
                title="Posting information"
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Created"
                  value={formatDate(
                    job.createdAt,
                    true,
                  )}
                />

                <DetailRow
                  icon={
                    <Clock3 className="h-4 w-4" />
                  }
                  label="Last updated"
                  value={formatDate(
                    job.createdAt,
                    true,
                  )}
                />

                <DetailRow
                  icon={
                    <Target className="h-4 w-4" />
                  }
                  label="Job ID"
                  value={job.id}
                />

                <DetailRow
                  icon={
                    <Building2 className="h-4 w-4" />
                  }
                  label="Company ID"
                  value={job.company?.id || "N/A"}
                />
              </div>
            </motion.section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
            {/* Company */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 backdrop-blur-2xl"
            >
              <SectionTitle
                icon={
                  <Building2 className="h-5 w-5" />
                }
                title="Company"
              />

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-indigo-300">
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {job.company
                      ?.name ??
                      "Your Company"}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Hiring company
                  </p>
                </div>
              </div>

              {job.company
                ?.name && (
                <a
                  href={
                    job.company
                      .name ||
                    "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4" />
                    Company website
                  </span>

                  <ChevronRight className="h-4 w-4" />
                </a>
              )}
            </motion.section>

            {/* Compensation */}
            <motion.section
              variants={reveal}
              className="overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.10] to-cyan-500/[0.05] p-5 shadow-xl shadow-black/10 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  <CircleDollarSign className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Compensation
                  </p>

                  <p className="mt-1 break-words text-lg font-bold text-white">
                    {formatSalary(
                      job,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <SmallInfo
                  label="Minimum"
                  value={formatCurrency(
                    job.salaryMin,
                    job.salaryCurrency ??
                      "BDT",
                  )}
                />

                <SmallInfo
                  label="Maximum"
                  value={formatCurrency(
                    job.salaryMax,
                    job.salaryCurrency ??
                      "BDT",
                  )}
                />
              </div>
            </motion.section>

            {/* Applications */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    Candidates
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-white">
                    {applications}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Total applications
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <Link
                href={`/recruiter/jobs/${job.id}/applications`}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-slate-950 transition hover:bg-slate-200"
              >
                View Applications

                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.section>

            {/* AI matches */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-indigo-400/15 bg-indigo-500/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    AI candidate matching
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    AI-powered candidate
                    matching based on
                    job requirements and
                    profile relevance.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {matches}
                  </p>

                  <p className="text-xs text-slate-500">
                    potential matches
                  </p>
                </div>

                <Link
                  href={`/candidates?jobId=${encodeURIComponent(
                    job.id,
                  )}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 transition hover:text-indigo-200"
                >
                  Find candidates

                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.section>

            {/* Deadline */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
                  <CalendarClock className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Application deadline
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {formatDate(
                      job.deadline,
                    )}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 rounded-xl border px-3 py-3 text-center text-xs font-bold ${deadlineState.className}`}
              >
                {deadlineState.label}
              </div>
            </motion.section>

            {/* Quick actions */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 backdrop-blur-2xl"
            >
              <SectionTitle
                icon={
                  <MoreHorizontal className="h-5 w-5" />
                }
                title="Quick actions"
              />

              <div className="mt-5 space-y-2">
                <QuickAction
                  href={`/recruiter/jobs/${job.id}/edit`}
                  icon={
                    <Edit3 className="h-4 w-4" />
                  }
                  label="Edit job"
                />

                <QuickAction
                  href={`/recruiter/jobs/${job.id}/applications`}
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  label="Manage applications"
                />

                <QuickAction
                  href={`/candidates?jobId=${encodeURIComponent(
                    job.id,
                  )}`}
                  icon={
                    <Target className="h-4 w-4" />
                  }
                  label="Find matching candidates"
                />

                <QuickAction
                  href="/recruiter/messages"
                  icon={
                    <MessageSquare className="h-4 w-4" />
                  }
                  label="Open messages"
                />
              </div>
            </motion.section>
          </aside>
        </motion.div>
      </main>
    </div>
  );
}

/* =========================================================
   UI COMPONENTS
========================================================= */

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

function SectionTitle({
  icon,
  title,
}: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
        {icon}
      </div>

      <h2 className="text-base font-bold text-white sm:text-lg">
        {title}
      </h2>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
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
      variants={reveal}
      whileHover={{
        y: -3,
      }}
      className="group rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/5 backdrop-blur-xl transition hover:border-indigo-400/15 hover:bg-white/[0.06] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 transition group-hover:bg-indigo-500/15">
          {icon}
        </div>

        <span className="text-2xl font-bold text-white">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-200">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </motion.div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({
  icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/15 hover:bg-white/[0.035]">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="text-indigo-300/70">
          {icon}
        </span>

        {label}
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SKILL PRIORITY
========================================================= */

interface SkillPriorityProps {
  priority?: string | null;
}

function SkillPriority({
  priority,
}: SkillPriorityProps) {
  const normalized =
    priority?.toLowerCase() ??
    "medium";

  const styles =
    normalized === "high"
      ? "border-red-400/20 bg-red-500/10 text-red-300"
      : normalized === "low"
        ? "border-slate-400/10 bg-slate-500/10 text-slate-400"
        : "border-amber-400/20 bg-amber-500/10 text-amber-300";

  return (
    <span
      className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${styles}`}
    >
      {normalized}
    </span>
  );
}

/* =========================================================
   SMALL INFO
========================================================= */

interface SmallInfoProps {
  label: string;
  value: string;
}

function SmallInfo({
  label,
  value,
}: SmallInfoProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function QuickAction({
  href,
  icon,
  label,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-medium text-slate-300 transition hover:border-indigo-400/15 hover:bg-white/[0.06] hover:text-white"
    >
      <span className="flex items-center gap-3">
        <span className="text-slate-500 transition group-hover:text-indigo-300">
          {icon}
        </span>

        {label}
      </span>

      <ChevronRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-300" />
    </Link>
  );
}

/* =========================================================
   TIMELINE ITEM
========================================================= */

interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  description: string;
}

function TimelineItem({
  icon,
  title,
  date,
  description,
}: TimelineItemProps) {
  return (
    <div className="relative">
      <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
        {icon}
      </div>

      <div>
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <p className="text-sm font-bold text-white">
            {title}
          </p>

          <span className="text-xs text-slate-500">
            {date}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TIMELINE LINE
========================================================= */

function TimelineLine() {
  return (
    <div className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-indigo-400/30 via-white/10 to-transparent" />
  );
}

/* =========================================================
   EMPTY BLOCK
========================================================= */

function EmptyBlock({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center">
      <Code2 className="mx-auto h-7 w-7 text-slate-600" />

      <p className="mt-3 text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
}

/* =========================================================
   SPINNER
========================================================= */

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}

/* =========================================================
   SKELETON
========================================================= */

function JobDetailsSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        <ParticleWave />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-10 w-36 animate-pulse rounded-xl bg-white/10" />

        <div className="mt-6 h-64 animate-pulse rounded-[30px] border border-white/10 bg-white/[0.04]" />

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_390px]">
          <div className="space-y-6">
            <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />

            <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />

            <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />

            <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
          </div>

          <div className="space-y-6">
            <div className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />

            <div className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />

            <div className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />

            <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  );
}