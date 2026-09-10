"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowRight,
  Brain,
  CalendarDays,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Mic,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Target,
  Timer,
  Video,
  X,
  XCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ParticleWave from "../ui/particle-wave";

// ============================================================
// TYPES
// ============================================================

type InterviewStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "NO_SHOW";

type InterviewType =
  | "VIDEO"
  | "PHONE"
  | "IN_PERSON"
  | "TECHNICAL"
  | "HR"
  | "BEHAVIORAL"
  | "FINAL";

interface Company {
  id?: string;
  name: string;
  logo?: string | null;
}

interface Job {
  id?: string;
  title: string;
  company?: Company | null;
}

interface ScheduledBy {
  id: string;
  name: string;
  email: string;
}

interface Interview {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  status: InterviewStatus;
  meetingUrl?: string | null;
  title?: string | null;
  notes?: string | null;
  jobApplication?: {
    job?: Job | null;
  } | null;
  scheduledBy?: ScheduledBy | null;
}

interface InterviewResponse {
  interviews: Interview[];
  upcoming: Interview[];
  completed: Interview[];
  cancelled: Interview[];
  stats: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
}

type TabType = "upcoming" | "completed" | "cancelled";

// ============================================================
// HELPERS
// ============================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

function formatInterviewDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatInterviewTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getCompanyName(interview: Interview) {
  return (
    interview.jobApplication?.job?.company?.name ||
    "Company"
  );
}

function getJobTitle(interview: Interview) {
  return (
    interview.jobApplication?.job?.title ||
    interview.title ||
    "Interview"
  );
}

function getInterviewTypeLabel(type: InterviewType) {
  switch (type) {
    case "VIDEO":
      return "Video Interview";

    case "PHONE":
      return "Phone Interview";

    case "IN_PERSON":
      return "In-Person Interview";

    case "TECHNICAL":
      return "Technical Interview";

    case "HR":
      return "HR Interview";

    case "BEHAVIORAL":
      return "Behavioral Interview";

    case "FINAL":
      return "Final Interview";

    default:
      return "Interview";
  }
}

function getStatusLabel(status: InterviewStatus) {
  switch (status) {
    case "SCHEDULED":
      return "Scheduled";

    case "CONFIRMED":
      return "Confirmed";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "RESCHEDULED":
      return "Rescheduled";

    case "NO_SHOW":
      return "No Show";

    default:
      return status;
  }
}

function getStatusClasses(status: InterviewStatus) {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "COMPLETED":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "CANCELLED":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    case "RESCHEDULED":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    case "IN_PROGRESS":
      return "border-violet-500/20 bg-violet-500/10 text-violet-400";

    default:
      return "border-primary/20 bg-primary/10 text-primary";
  }
}

function getCountdownParts(date: string) {
  const target = new Date(date).getTime();
  const now = Date.now();

  const difference = Math.max(target - now, 0);

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    total: difference,
  };
}

// ============================================================
// COUNTDOWN
// ============================================================

function InterviewCountdown({
  scheduledAt,
}: {
  scheduledAt: string;
}) {
  const [mounted, setMounted] = useState(false);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    setMounted(true);

    const update = () => {
      setCountdown(getCountdownParts(scheduledAt));
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [scheduledAt]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center"
          >
            <div className="h-6 animate-pulse rounded bg-white/10" />

            <p className="mt-1 text-[9px] uppercase tracking-widest text-white/40">
              {label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const isStarting =
    countdown.total <= 5 * 60 * 1000;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-white/60">
        <Timer className="h-3.5 w-3.5 text-primary" />

        {isStarting
          ? "Starting soon"
          : "Time until interview"}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <CountdownUnit
          value={countdown.days}
          label="Days"
        />

        <CountdownUnit
          value={countdown.hours}
          label="Hours"
        />

        <CountdownUnit
          value={countdown.minutes}
          label="Min"
        />

        <CountdownUnit
          value={countdown.seconds}
          label="Sec"
        />
      </div>
    </div>
  );
}

function CountdownUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center backdrop-blur-sm">
      <p className="text-xl font-bold tabular-nums text-white">
        {String(value).padStart(2, "0")}
      </p>

      <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CandidateInterviews() {
  const [data, setData] =
    useState<InterviewResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<TabType>("upcoming");

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [showDetails, setShowDetails] =
    useState<Interview | null>(null);

  const [showReschedule, setShowReschedule] =
    useState<Interview | null>(null);

  const [rescheduleDate, setRescheduleDate] =
    useState("");

  const [mounted, setMounted] = useState(false);

  // ==========================================================
  // MOUNT
  // ==========================================================

  useEffect(() => {
    setMounted(true);
  }, []);

  // ==========================================================
  // FETCH
  // ==========================================================

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/v1/interviews/candidate`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to load interviews"
        );
      }

      setData(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const nextInterview = useMemo(() => {
    if (!data?.upcoming?.length) {
      return null;
    }

    return [...data.upcoming].sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() -
        new Date(b.scheduledAt).getTime()
    )[0];
  }, [data]);

  const visibleInterviews = useMemo(() => {
    if (!data) return [];

    if (activeTab === "completed") {
      return data.completed;
    }

    if (activeTab === "cancelled") {
      return data.cancelled;
    }

    return data.upcoming.filter(
      (item) =>
        item.id !== nextInterview?.id
    );
  }, [activeTab, data, nextInterview]);

  // ==========================================================
  // CONFIRM
  // ==========================================================

  const handleConfirm = async (
    interviewId: string
  ) => {
    try {
      setActionLoading(`confirm-${interviewId}`);

      const response = await fetch(
        `${API_URL}/api/v1/interviews/candidate/${interviewId}/confirm`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to confirm interview"
        );
      }

      await fetchInterviews();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to confirm interview"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================================
  // CANCEL
  // ==========================================================

  const handleCancel = async (
    interviewId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`cancel-${interviewId}`);

      const response = await fetch(
        `${API_URL}/api/v1/interviews/candidate/${interviewId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to cancel interview"
        );
      }

      setShowDetails(null);

      await fetchInterviews();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to cancel interview"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================================
  // RESCHEDULE
  // ==========================================================

  const handleReschedule = async () => {
    if (!showReschedule || !rescheduleDate) {
      return;
    }

    try {
      setActionLoading(
        `reschedule-${showReschedule.id}`
      );

      const response = await fetch(
        `${API_URL}/api/v1/interviews/candidate/${showReschedule.id}/reschedule`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scheduledAt: new Date(
              rescheduleDate
            ).toISOString(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to reschedule interview"
        );
      }

      setShowReschedule(null);
      setRescheduleDate("");

      await fetchInterviews();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to reschedule interview"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
        {/* Matching Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/70 to-slate-950" />

          <div className="absolute inset-0 opacity-[0.12]">
            <ParticleWave />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <InterviewSkeleton />
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
        {/* Matching Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/75 to-slate-950" />

          <div className="absolute inset-0 opacity-[0.08]">
            <ParticleWave />
          </div>
        </div>

        <div className="relative z-10 flex min-h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h2 className="text-xl font-bold">
              Unable to load interviews
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>

            <Button
              onClick={fetchInterviews}
              className="mt-6 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">

      {/* ======================================================
          MATCHING BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Left Indigo Glow */}
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Right Purple Glow */}
        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

        {/* Top Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />

        {/* Particle Wave */}
        <div className="absolute inset-0 opacity-[0.12]">
          <ParticleWave />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/75 to-slate-950" />
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <section
          className={`mb-7 transition-all duration-700 ${
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
                  <CalendarClock className="h-4 w-4 text-indigo-400" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  Interview Center
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your interviews
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Stay organized, prepare confidently,
                and never miss your next opportunity.
              </p>
            </div>

            <Button
              className="group gap-2 rounded-xl shadow-lg shadow-indigo-500/10"
              onClick={() => {
                window.location.href =
                  "/candidate/practices";
              }}
            >
              <Brain className="h-4 w-4" />

              Practice with AI

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>

        {/* ====================================================
            STATS
        ==================================================== */}

        <section
          className={`mb-7 grid grid-cols-2 gap-3 md:grid-cols-4 ${
            mounted
              ? "animate-in fade-in slide-in-from-bottom-2 duration-700"
              : ""
          }`}
        >
          <StatCard
            icon={CalendarDays}
            label="Upcoming"
            value={data?.stats.upcoming ?? 0}
            description="Scheduled"
          />

          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={data?.stats.completed ?? 0}
            description="Finished"
          />

          <StatCard
            icon={XCircle}
            label="Cancelled"
            value={data?.stats.cancelled ?? 0}
            description="Cancelled"
          />

          <StatCard
            icon={Target}
            label="Total"
            value={data?.stats.total ?? 0}
            description="All interviews"
          />
        </section>

        {/* ====================================================
            NEXT INTERVIEW
        ==================================================== */}

        {nextInterview && (
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-400" />

                <h2 className="text-sm font-bold">
                  Next interview
                </h2>
              </div>

              <Badge
                variant="outline"
                className="border-indigo-400/20 bg-indigo-400/5 text-indigo-300"
              >
                {getStatusLabel(
                  nextInterview.status
                )}
              </Badge>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-white/[0.06] shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">

              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-700 group-hover:bg-indigo-500/15" />

              <div className="relative grid lg:grid-cols-[1.4fr_0.8fr]">

                {/* LEFT */}
                <div className="p-6 sm:p-8">

                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <Badge className="rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/10">
                      {getInterviewTypeLabel(
                        nextInterview.type
                      )}
                    </Badge>

                    {nextInterview.durationMinutes && (
                      <Badge
                        variant="outline"
                        className="rounded-lg border-white/10 bg-white/5 text-slate-300"
                      >
                        <Clock3 className="mr-1 h-3 w-3" />

                        {nextInterview.durationMinutes}{" "}
                        min
                      </Badge>
                    )}
                  </div>

                  <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                    {getJobTitle(nextInterview)}
                  </h2>

                  <p className="mt-2 text-base font-medium text-indigo-300">
                    {getCompanyName(nextInterview)}
                  </p>

                  {/* DATE */}
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <InfoItem
                      icon={CalendarDays}
                      label="Date"
                      value={formatInterviewDate(
                        nextInterview.scheduledAt
                      )}
                    />

                    <InfoItem
                      icon={Clock3}
                      label="Time"
                      value={`${formatInterviewTime(
                        nextInterview.scheduledAt
                      )} · ${nextInterview.durationMinutes} min`}
                    />

                    <InfoItem
                      icon={
                        nextInterview.type === "VIDEO"
                          ? Video
                          : MapPin
                      }
                      label="Format"
                      value={getInterviewTypeLabel(
                        nextInterview.type
                      )}
                    />

                    <InfoItem
                      icon={Sparkles}
                      label="Interviewer"
                      value={
                        nextInterview.scheduledBy?.name ||
                        "Hiring team"
                      }
                    />
                  </div>

                  {/* NOTES */}
                  {nextInterview.notes && (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex gap-3">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />

                        <div>
                          <p className="text-xs font-semibold">
                            Interview notes
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {nextInterview.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-7 flex flex-wrap gap-2">

                    {nextInterview.meetingUrl && (
                      <Button
                        asChild
                        className="gap-2 rounded-xl shadow-lg shadow-indigo-500/10"
                      >
                        <a
                          href={
                            nextInterview.meetingUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Video className="h-4 w-4" />
                          Join interview
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}

                    {nextInterview.status ===
                      "SCHEDULED" && (
                      <Button
                        variant="outline"
                        className="gap-2 rounded-xl border-white/10 bg-white/[0.03]"
                        disabled={
                          actionLoading ===
                          `confirm-${nextInterview.id}`
                        }
                        onClick={() =>
                          handleConfirm(
                            nextInterview.id
                          )
                        }
                      >
                        {actionLoading ===
                        `confirm-${nextInterview.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}

                        Confirm
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      className="gap-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                      onClick={() =>
                        setShowDetails(
                          nextInterview
                        )
                      }
                    >
                      View details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* RIGHT COUNTDOWN */}
                <div className="relative border-t border-white/10 bg-black/10 p-6 lg:border-l lg:border-t-0 sm:p-8">

                  <div className="flex h-full flex-col justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Countdown
                      </p>

                      <div className="mt-5">
                        <InterviewCountdown
                          scheduledAt={
                            nextInterview.scheduledAt
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-4">

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                          <Brain className="h-4 w-4 text-indigo-300" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            Prepare with AI
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Practice questions tailored
                            to this role and your resume.
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              (window.location.href =
                                "/candidate/practices")
                            }
                            className="mt-3 text-xs font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                          >
                            Start practice →
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ====================================================
            PREPARATION + CHECKLIST
        ==================================================== */}

        <section className="mb-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">

          <PreparationCard />

          <PreparationChecklist />

        </section>

        {/* ====================================================
            INTERVIEW LIST
        ==================================================== */}

        <section>

          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold">
                Interview history
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Track your upcoming and previous interviews.
              </p>
            </div>

            <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">

              <TabButton
                active={
                  activeTab === "upcoming"
                }
                onClick={() =>
                  setActiveTab("upcoming")
                }
              >
                Upcoming
              </TabButton>

              <TabButton
                active={
                  activeTab === "completed"
                }
                onClick={() =>
                  setActiveTab("completed")
                }
              >
                Completed
              </TabButton>

              <TabButton
                active={
                  activeTab === "cancelled"
                }
                onClick={() =>
                  setActiveTab("cancelled")
                }
              >
                Cancelled
              </TabButton>

            </div>

          </div>

          {visibleInterviews.length > 0 ? (
            <div className="space-y-3">
              {visibleInterviews.map(
                (interview) => (
                  <InterviewListItem
                    key={interview.id}
                    interview={interview}
                    onView={() =>
                      setShowDetails(
                        interview
                      )
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyInterviewState
              type={activeTab}
            />
          )}

        </section>

      </main>

      {/* ======================================================
          DETAILS DIALOG
      ====================================================== */}

      {showDetails && (
        <InterviewDetailsModal
          interview={showDetails}
          actionLoading={actionLoading}
          onClose={() =>
            setShowDetails(null)
          }
          onConfirm={() =>
            handleConfirm(
              showDetails.id
            )
          }
          onCancel={() =>
            handleCancel(
              showDetails.id
            )
          }
          onReschedule={() => {
            setShowReschedule(
              showDetails
            );

            setShowDetails(null);
          }}
        />
      )}

      {/* ======================================================
          RESCHEDULE MODAL
      ====================================================== */}

      {showReschedule && (
        <RescheduleModal
          interview={showReschedule}
          value={rescheduleDate}
          loading={
            actionLoading ===
            `reschedule-${showReschedule.id}`
          }
          onChange={
            setRescheduleDate
          }
          onClose={() => {
            setShowReschedule(null);
            setRescheduleDate("");
          }}
          onSubmit={handleReschedule}
        />
      )}

    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/20 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-indigo-500/5">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10">
          <Icon className="h-4 w-4 text-indigo-300" />
        </div>

        <span className="text-2xl font-bold tabular-nums">
          {value}
        </span>

      </div>

      <p className="mt-3 text-xs font-semibold">
        {label}
      </p>

      <p className="mt-0.5 text-[11px] text-slate-500">
        {description}
      </p>

    </div>
  );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
        <Icon className="h-4 w-4 text-indigo-300" />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-slate-200">
          {value}
        </p>

      </div>

    </div>
  );
}

// ============================================================
// PREPARATION CARD
// ============================================================

function PreparationCard() {
  const preparationScore = 82;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">

      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">

        <div className="flex items-start justify-between gap-4">

          <div className="flex gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Brain className="h-5 w-5 text-indigo-300" />
            </div>

            <div>
              <h3 className="font-bold">
                AI interview preparation
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Personalized preparation based on your
                role and skills.
              </p>
            </div>

          </div>

          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">
            {preparationScore}% ready
          </Badge>

        </div>

        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between text-xs">

            <span className="text-slate-500">
              Preparation score
            </span>

            <span className="font-bold">
              {preparationScore}%
            </span>

          </div>

          <Progress
            value={preparationScore}
            className="h-2"
          />

        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">

          <PreparationSkill
            label="React.js"
            status="strong"
          />

          <PreparationSkill
            label="Node.js"
            status="strong"
          />

          <PreparationSkill
            label="PostgreSQL"
            status="good"
          />

          <PreparationSkill
            label="System Design"
            status="focus"
          />

        </div>

        <Button
          className="mt-6 w-full gap-2 rounded-xl"
          onClick={() =>
            (window.location.href =
              "/candidate/practices")
          }
        >
          <Sparkles className="h-4 w-4" />

          Start AI mock interview

          <ArrowRight className="ml-auto h-4 w-4" />
        </Button>

      </div>
    </div>
  );
}

function PreparationSkill({
  label,
  status,
}: {
  label: string;
  status:
    | "strong"
    | "good"
    | "focus";
}) {
  const config = {
    strong: {
      icon: CheckCircle2,
      text: "Strong",
      classes:
        "text-emerald-400 bg-emerald-500/10",
    },

    good: {
      icon: Check,
      text: "Good",
      classes:
        "text-blue-400 bg-blue-500/10",
    },

    focus: {
      icon: Target,
      text: "Focus",
      classes:
        "text-amber-400 bg-amber-500/10",
    },
  };

  const item = config[status];

  const Icon = item.icon;

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">

      <span className="text-xs font-medium">
        {label}
      </span>

      <span
        className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-semibold ${item.classes}`}
      >
        <Icon className="h-3 w-3" />

        {item.text}
      </span>

    </div>
  );
}

// ============================================================
// CHECKLIST
// ============================================================

function PreparationChecklist() {
  const items = [
    {
      label: "Review job description",
      done: true,
    },
    {
      label: "Review your resume",
      done: true,
    },
    {
      label: "Research the company",
      done: false,
    },
    {
      label: "Practice technical questions",
      done: false,
    },
    {
      label: "Prepare questions to ask",
      done: false,
    },
    {
      label: "Test camera & microphone",
      done: false,
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10">
          <FileText className="h-5 w-5 text-blue-400" />
        </div>

        <div>
          <h3 className="font-bold">
            Before your interview
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Quick preparation checklist
          </p>
        </div>

      </div>

      <div className="mt-5 space-y-2">

        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl px-2 py-2"
          >

            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                item.done
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "border border-white/10 text-transparent"
              }`}
            >
              <Check className="h-3 w-3" />
            </div>

            <span
              className={`text-xs ${
                item.done
                  ? "text-slate-500 line-through"
                  : "font-medium text-slate-300"
              }`}
            >
              {item.label}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

// ============================================================
// TAB BUTTON
// ============================================================

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-white/10 text-white shadow-sm"
          : "text-slate-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// ============================================================
// INTERVIEW LIST ITEM
// ============================================================

function InterviewListItem({
  interview,
  onView,
}: {
  interview: Interview;
  onView: () => void;
}) {
  const date = new Date(interview.scheduledAt);

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/20 hover:bg-white/[0.06] hover:shadow-lg">

      <div className="flex flex-col gap-4 md:flex-row md:items-center">

        {/* DATE */}

        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-indigo-500/5">

          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
            {new Intl.DateTimeFormat(
              "en-US",
              {
                month: "short",
              }
            ).format(date)}
          </span>

          <span className="text-xl font-bold">
            {date.getDate()}
          </span>

        </div>

        {/* MAIN */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="truncate text-sm font-bold">
              {getJobTitle(interview)}
            </h3>

            <Badge
              variant="outline"
              className={`text-[10px] ${getStatusClasses(
                interview.status
              )}`}
            >
              {getStatusLabel(
                interview.status
              )}
            </Badge>

          </div>

          <p className="mt-1 text-xs font-medium text-indigo-300">
            {getCompanyName(interview)}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">

            <span className="flex items-center gap-1">
              <Clock3 className="h-3 w-3" />

              {formatInterviewTime(
                interview.scheduledAt
              )}
            </span>

            <span className="flex items-center gap-1">
              <CalendarClock className="h-3 w-3" />

              {interview.durationMinutes} min
            </span>

            <span className="flex items-center gap-1">
              {interview.type === "VIDEO" ? (
                <Video className="h-3 w-3" />
              ) : (
                <Mic className="h-3 w-3" />
              )}

              {getInterviewTypeLabel(
                interview.type
              )}
            </span>

          </div>

        </div>

        {/* ACTION */}

        <Button
          variant="ghost"
          className="shrink-0 gap-1 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white"
          onClick={onView}
        >
          View details

          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>

      </div>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyInterviewState({
  type,
}: {
  type: TabType;
}) {
  const config = {
    upcoming: {
      icon: CalendarClock,
      title: "No upcoming interviews",
      description:
        "When a recruiter schedules an interview, it will appear here.",
    },

    completed: {
      icon: CheckCircle2,
      title: "No completed interviews",
      description:
        "Your completed interviews and their history will appear here.",
    },

    cancelled: {
      icon: XCircle,
      title: "No cancelled interviews",
      description:
        "You don't have any cancelled interviews.",
    },
  };

  const item = config[type];

  const Icon = item.icon;

  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
        <Icon className="h-6 w-6 text-slate-500" />
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {item.title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
        {item.description}
      </p>

    </div>
  );
}

// ============================================================
// DETAILS MODAL
// ============================================================

function InterviewDetailsModal({
  interview,
  actionLoading,
  onClose,
  onConfirm,
  onCancel,
  onReschedule,
}: {
  interview: Interview;
  actionLoading: string | null;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  onReschedule: () => void;
}) {
  return (
    <Modal onClose={onClose}>

      <div className="p-6 sm:p-7">

        <div className="flex items-start justify-between gap-4">

          <div>

            <Badge
              variant="outline"
              className={`mb-3 ${getStatusClasses(
                interview.status
              )}`}
            >
              {getStatusLabel(
                interview.status
              )}
            </Badge>

            <h2 className="text-xl font-bold">
              {getJobTitle(interview)}
            </h2>

            <p className="mt-1 text-sm font-medium text-indigo-300">
              {getCompanyName(interview)}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="grid gap-3 sm:grid-cols-2">

          <InfoItem
            icon={CalendarDays}
            label="Date"
            value={formatInterviewDate(
              interview.scheduledAt
            )}
          />

          <InfoItem
            icon={Clock3}
            label="Time"
            value={`${formatInterviewTime(
              interview.scheduledAt
            )} · ${interview.durationMinutes} min`}
          />

          <InfoItem
            icon={Video}
            label="Interview type"
            value={getInterviewTypeLabel(
              interview.type
            )}
          />

          <InfoItem
            icon={Sparkles}
            label="Interviewer"
            value={
              interview.scheduledBy?.name ||
              "Hiring team"
            }
          />

        </div>

        {interview.scheduledBy && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <p className="text-xs font-semibold">
              Interviewer
            </p>

            <p className="mt-2 text-sm font-medium">
              {interview.scheduledBy.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {interview.scheduledBy.email}
            </p>

          </div>
        )}

        {interview.notes && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <p className="text-xs font-semibold">
              Notes from recruiter
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {interview.notes}
            </p>

          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">

          {interview.meetingUrl &&
            interview.status !== "CANCELLED" && (
              <Button
                asChild
                className="gap-2 rounded-xl"
              >
                <a
                  href={interview.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Video className="h-4 w-4" />
                  Join interview
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}

          {(interview.status === "SCHEDULED" ||
            interview.status === "RESCHEDULED") && (
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-white/10 bg-white/[0.03]"
              disabled={
                actionLoading ===
                `confirm-${interview.id}`
              }
              onClick={onConfirm}
            >
              {actionLoading ===
              `confirm-${interview.id}` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              Confirm
            </Button>
          )}

          {interview.status !== "COMPLETED" &&
            interview.status !== "CANCELLED" && (
              <>
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-white/10 bg-white/[0.03]"
                  onClick={onReschedule}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reschedule
                </Button>

                <Button
                  variant="ghost"
                  className="gap-2 rounded-xl text-red-400 hover:bg-red-500/5 hover:text-red-300"
                  disabled={
                    actionLoading ===
                    `cancel-${interview.id}`
                  }
                  onClick={onCancel}
                >
                  {actionLoading ===
                  `cancel-${interview.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}

                  Cancel
                </Button>
              </>
            )}

        </div>

      </div>
    </Modal>
  );
}

// ============================================================
// RESCHEDULE MODAL
// ============================================================

function RescheduleModal({
  interview,
  value,
  loading,
  onChange,
  onClose,
  onSubmit,
}: {
  interview: Interview;
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal onClose={onClose}>

      <div className="p-6 sm:p-7">

        <div className="flex items-start justify-between">

          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <CalendarClock className="h-5 w-5 text-indigo-300" />
            </div>

            <h2 className="text-xl font-bold">
              Reschedule interview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a new date and time for your interview.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

          <p className="text-xs text-slate-500">
            Current interview
          </p>

          <p className="mt-1 text-sm font-semibold">
            {getJobTitle(interview)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {formatInterviewDate(
              interview.scheduledAt
            )}{" "}
            at{" "}
            {formatInterviewTime(
              interview.scheduledAt
            )}
          </p>

        </div>

        <div className="mt-5">

          <label
            htmlFor="reschedule-date"
            className="mb-2 block text-xs font-semibold"
          >
            New date and time
          </label>

          <input
            id="reschedule-date"
            type="datetime-local"
            value={value}
            min={new Date()
              .toISOString()
              .slice(0, 16)}
            onChange={(event) =>
              onChange(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
          />

        </div>

        <div className="mt-6 flex justify-end gap-2">

          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className="gap-2 rounded-xl"
            disabled={!value || loading}
            onClick={onSubmit}
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Confirm new time
          </Button>

        </div>

      </div>

    </Modal>
  );
}

// ============================================================
// MODAL
// ============================================================

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-md">

      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
        {children}
      </div>

    </div>
  );
}

// ============================================================
// SKELETON
// ============================================================

function InterviewSkeleton() {
  return (
    <div className="animate-pulse">

      <div className="h-4 w-32 rounded bg-white/10" />

      <div className="mt-4 h-10 w-72 rounded bg-white/10" />

      <div className="mt-3 h-5 w-96 max-w-full rounded bg-white/10" />

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 rounded-2xl bg-white/10"
          />
        ))}

      </div>

      <div className="mt-8 h-[430px] rounded-3xl bg-white/10" />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">

        <div className="h-72 rounded-3xl bg-white/10" />

        <div className="h-72 rounded-3xl bg-white/10" />

      </div>

    </div>
  );
}