
"use client";

import {
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import {
  ArrowRight,
  Award,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Target,
  UserRound,
  XCircle,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import ParticleWave from "@/components/ui/particle-wave";

import {
  candidateProfileApi,
  type CandidateSkill,
} from "@/lib/api/candidateProfile";

import {
  getJobs,
  getMyApplications,
  type MyApplication,
} from "@/lib/api/jobs.api";

import {
  interviewApi,
  type Interview,
} from "@/lib/api/interview";

import {
  resumeApi,
  type Resume,
  type ResumeAnalysis,
} from "@/lib/api/resume.api";

import type { Job } from "@/types/job";

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

interface DashboardCandidateProfile {
  id: string;
  userId: string;

  name: string | null;
  email: string | null;
  image: string | null;

  phone: string | null;
  location: string | null;
  bio: string | null;
  experience: string | null;

  linkedin: string | null;
  github: string | null;
  portfolio: string | null;

  skills: CandidateSkill[];

  education: Array<{
    id?: string;
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear: number;
  }>;

  projects: Array<{
    id?: string;
    name: string;
    description: string;
    technologies: string;
    projectUrl?: string | null;
    image?: string | null;
  }>;

  certifications: Array<{
    id?: string;
    name: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string | null;
    image?: string | null;
  }>;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

interface RawCandidateProfile {
  id?: string;
  userId?: string;

  name?: string | null;
  email?: string | null;
  image?: string | null;

  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  experience?: string | null;

  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;

  skills?: CandidateSkill[];

  education?: DashboardCandidateProfile["education"];

  projects?: DashboardCandidateProfile["projects"];

  certifications?: DashboardCandidateProfile["certifications"];

  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface DashboardApplication extends MyApplication {
  job?: Job | null;
}

/* =========================================================
   ANIMATION
========================================================= */

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeProfile(
  response: unknown,
): DashboardCandidateProfile | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const outer =
    response as ApiResponse<RawCandidateProfile> &
      RawCandidateProfile;

  const raw =
    outer.data &&
    typeof outer.data === "object"
      ? outer.data
      : outer;

  if (!raw.id) {
    return null;
  }

  const user = raw.user;

  return {
    id: raw.id,

    userId:
      raw.userId ??
      user?.id ??
      "",

    name:
      raw.name ??
      user?.name ??
      null,

    email:
      raw.email ??
      user?.email ??
      null,

    image:
      raw.image ??
      user?.image ??
      null,

    phone:
      raw.phone ??
      null,

    location:
      raw.location ??
      null,

    bio:
      raw.bio ??
      null,

    experience:
      raw.experience ??
      null,

    linkedin:
      raw.linkedin ??
      null,

    github:
      raw.github ??
      null,

    portfolio:
      raw.portfolio ??
      null,

    skills:
      Array.isArray(raw.skills)
        ? raw.skills
        : [],

    education:
      Array.isArray(raw.education)
        ? raw.education
        : [],

    projects:
      Array.isArray(raw.projects)
        ? raw.projects
        : [],

    certifications:
      Array.isArray(raw.certifications)
        ? raw.certifications
        : [],
  };
}

function normalizeApplications(
  value: unknown,
): MyApplication[] {
  if (Array.isArray(value)) {
    return value as MyApplication[];
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    return [];
  }

  const object =
    value as Record<string, unknown>;

  if (Array.isArray(object.data)) {
    return object.data as MyApplication[];
  }

  if (
    Array.isArray(object.applications)
  ) {
    return object.applications as MyApplication[];
  }

  return [];
}

function getApplicationStatus(
  status: string | undefined,
): ApplicationStatus {
  return String(
    status ?? "APPLIED",
  ).toUpperCase();
}

function getStatusColor(
  status: ApplicationStatus,
) {
  switch (status) {
    case "ACCEPTED":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";

    case "REJECTED":
      return "text-red-600 bg-red-50 border-red-200";

    case "INTERVIEW":
      return "text-blue-600 bg-blue-50 border-blue-200";

    case "SHORTLISTED":
      return "text-violet-600 bg-violet-50 border-violet-200";

    case "REVIEWING":
      return "text-amber-600 bg-amber-50 border-amber-200";

    case "WITHDRAWN":
      return "text-slate-600 bg-slate-50 border-slate-200";

    default:
      return "text-cyan-600 bg-cyan-50 border-cyan-200";
  }
}

function getStatusIcon(
  status: ApplicationStatus,
): ComponentType<{
  className?: string;
}> {
  switch (status) {
    case "ACCEPTED":
      return CheckCircle2;

    case "REJECTED":
      return XCircle;

    case "INTERVIEW":
      return CalendarDays;

    case "SHORTLISTED":
      return Sparkles;

    case "REVIEWING":
      return Clock3;

    default:
      return BriefcaseBusiness;
  }
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Recently";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

function formatInterviewDate(
  value?: string | null,
) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  );
}

function formatInterviewTime(
  value?: string | null,
) {
  if (!value) {
    return "Time unavailable";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Time unavailable";
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

function getJobSkills(
  job: Job,
): string[] {
  if (
    !Array.isArray(
      job.requiredSkills,
    )
  ) {
    return [];
  }

  return job.requiredSkills
    .map((skill) => {
      if (
        typeof skill ===
        "string"
      ) {
        return skill;
      }

      if (
        skill &&
        typeof skill ===
          "object" &&
        "name" in skill &&
        typeof skill.name ===
          "string"
      ) {
        return skill.name;
      }

      return null;
    })
    .filter(
      (
        skill,
      ): skill is string =>
        typeof skill ===
          "string" &&
        skill.trim()
          .length > 0,
    );
}

function calculateProfileCompletion(
  profile:
    | DashboardCandidateProfile
    | null,
): number {
  if (!profile) {
    return 0;
  }

  const checks = [
    Boolean(profile.name),
    Boolean(profile.email),
    Boolean(profile.phone),
    Boolean(profile.location),
    Boolean(profile.bio),
    Boolean(profile.image),
    Boolean(profile.experience),
    Boolean(profile.linkedin),
    Boolean(profile.github),
    Boolean(profile.portfolio),
    profile.skills.length > 0,
    profile.education.length > 0,
    profile.projects.length > 0,
    profile.certifications.length > 0,
  ];

  const completed =
    checks.filter(Boolean)
      .length;

  return Math.round(
    (completed /
      checks.length) *
      100,
  );
}

function getInitials(
  name?: string | null,
) {
  if (!name?.trim()) {
    return "C";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) =>
      word
        .charAt(0)
        .toUpperCase(),
    )
    .join("");
}

function getResumeScore(
  analysis?: ResumeAnalysis | null,
) {
  if (!analysis) {
    return 0;
  }

  const explicitScore =
    Number(
      analysis.overallScore,
    );

  if (
    Number.isFinite(
      explicitScore,
    )
  ) {
    return Math.round(
      Math.max(
        0,
        Math.min(
          100,
          explicitScore,
        ),
      ),
    );
  }

  const values = [
    Number(
      analysis.skillsScore,
    ),
    Number(
      analysis.experienceScore,
    ),
    Number(
      analysis.educationScore,
    ),
  ].filter(
    Number.isFinite,
  );

  if (!values.length) {
    return 0;
  }

  return Math.round(
    values.reduce(
      (
        sum,
        value,
      ) =>
        sum + value,
      0,
    ) /
      values.length,
  );
}

/* =========================================================
   DATA HOOK
========================================================= */

function useCandidateDashboardData() {
  const profileQuery =
    useQuery<
      DashboardCandidateProfile | null,
      Error
    >({
      queryKey: [
        "candidate-profile",
        "me",
      ],

      queryFn: async () => {
        const response =
          await candidateProfileApi.getMyProfile();

        return normalizeProfile(
          response,
        );
      },

      staleTime: 60_000,

      refetchOnWindowFocus:
        false,
    });

  const jobsQuery =
    useQuery<
      Job[],
      Error
    >({
      queryKey: [
        "candidate-dashboard-jobs",
      ],

      queryFn: () =>
        getJobs({
          limit: 6,
        }),

      staleTime: 30_000,

      refetchOnWindowFocus:
        false,
    });

  const applicationsQuery =
    useQuery<
      MyApplication[],
      Error
    >({
      queryKey: [
        "candidate-dashboard-applications",
      ],

      queryFn: async () => {
        const response =
          await getMyApplications();

        return normalizeApplications(
          response,
        );
      },

      staleTime: 30_000,

      refetchOnWindowFocus:
        false,
    });

  const resumesQuery =
    useQuery<
      Resume[],
      Error
    >({
      queryKey: [
        "candidate-dashboard-resumes",
      ],

      queryFn: async () => {
        const response =
          await resumeApi.getMyResumes();

        const raw =
          response as unknown as ApiResponse<{
            resumes?: Resume[];
          }>;

        if (
          Array.isArray(
            raw.data?.resumes,
          )
        ) {
          return raw.data.resumes;
        }

        return [];
      },

      staleTime: 60_000,

      refetchOnWindowFocus:
        false,
    });

  const interviewsQuery =
    useQuery<
      Interview[],
      Error
    >({
      queryKey: [
        "candidate-dashboard-interviews",
      ],

      queryFn: () =>
        interviewApi.getAll(),

      staleTime: 30_000,

      refetchOnWindowFocus:
        false,
    });

  const latestResume =
    resumesQuery.data?.[0];

  const analysisQuery =
    useQuery<
      ResumeAnalysis | null,
      Error
    >({
      queryKey: [
        "candidate-dashboard-resume-analysis",
        latestResume?.id,
      ],

      queryFn: async () => {
        if (
          !latestResume?.id
        ) {
          return null;
        }

        const response =
          await resumeApi.getResumeAnalysis(
            latestResume.id,
          );

        const raw =
          response as unknown as ApiResponse<{
            analysis?: ResumeAnalysis;
          }>;

        return (
          raw.data?.analysis ??
          null
        );
      },

      enabled:
        Boolean(
          latestResume?.id,
        ),

      staleTime: 120_000,

      refetchOnWindowFocus:
        false,
    });

  return {
    profileQuery,
    jobsQuery,
    applicationsQuery,
    resumesQuery,
    interviewsQuery,
    analysisQuery,
  };
}

/* =========================================================
   UI COMPONENTS
========================================================= */

function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-white/10",
        "bg-white/[0.06] backdrop-blur-xl",
        "shadow-2xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function LoadingBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-2xl",
        "bg-white/10",
        className,
      ].join(" ")}
    />
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  action,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-slate-400">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>

      {href &&
        action && (
          <Link
            href={href}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            {action}

            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  href,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string | number;
  description: string;
  href?: string;
}) {
  const content = (
    <motion.div
      variants={
        itemVariants
      }
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group h-full"
    >
      <GlassCard className="relative h-full overflow-hidden p-5">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 opacity-70 blur-2xl transition-all duration-500 group-hover:scale-150" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </div>

            {href && (
              <ArrowRight className="h-4 w-4 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-300" />
            )}
          </div>

          <div className="mt-5">
            <p className="text-3xl font-bold tracking-tight text-white">
              {value}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-200">
              {label}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}

function ScoreMini({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="p-4 text-center">
      <p className="text-lg font-bold text-slate-950">
        {Math.round(
          Number(value) || 0,
        )}
        %
      </p>

      <p className="mt-1 text-[10px] font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

function ProfileMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-slate-400">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-sm font-bold text-white">
          {value}
        </p>

        <p className="text-[10px] text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  className,
}: {
  href: string;
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className="group"
    >
      <motion.div
        whileHover={{
          y: -4,
        }}
        className={[
          "relative overflow-hidden rounded-3xl",
          "border border-white/10",
          "bg-gradient-to-br",
          className,
          "p-5",
          "shadow-2xl",
          "transition-shadow duration-300",
          "group-hover:border-white/20",
        ].join(" ")}
      >
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 shadow-sm">
              <Icon className="h-5 w-5 text-white" />
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </div>

          <h3 className="mt-5 text-sm font-bold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function CandidateDashboardPage() {
  const {
    profileQuery,
    jobsQuery,
    applicationsQuery,
    resumesQuery,
    interviewsQuery,
    analysisQuery,
  } =
    useCandidateDashboardData();

  const [
    showAllSkills,
    setShowAllSkills,
  ] = useState(false);

  const profile =
    profileQuery.data ??
    null;

  const jobs =
    jobsQuery.data ??
    [];

  const applications =
    applicationsQuery.data ??
    [];

  const resumes =
    resumesQuery.data ??
    [];

  const interviews =
    interviewsQuery.data ??
    [];

  const analysis =
    analysisQuery.data ??
    null;

  const profileCompletion =
    useMemo(
      () =>
        calculateProfileCompletion(
          profile,
        ),
      [profile],
    );

  const resumeScore =
    useMemo(
      () =>
        getResumeScore(
          analysis,
        ),
      [analysis],
    );

  const applicationStats =
    useMemo(() => {
      const total =
        applications.length;

      const active =
        applications.filter(
          (
            application,
          ) =>
            [
              "APPLIED",
              "REVIEWING",
              "SHORTLISTED",
              "INTERVIEW",
            ].includes(
              getApplicationStatus(
                application.status,
              ),
            ),
        ).length;

      const accepted =
        applications.filter(
          (
            application,
          ) =>
            getApplicationStatus(
              application.status,
            ) ===
            "ACCEPTED",
        ).length;

      return {
        total,
        active,
        accepted,
      };
    }, [applications]);

  const upcomingInterviews =
    useMemo(() => {
      const now =
        Date.now();

      return interviews
        .filter(
          (interview) => {
            const scheduledTime =
              new Date(
                interview.scheduledAt,
              ).getTime();

            return (
              scheduledTime >=
                now &&
              interview.status !==
                "CANCELLED" &&
              interview.status !==
                "COMPLETED"
            );
          },
        )
        .sort(
          (
            a,
            b,
          ) =>
            new Date(
              a.scheduledAt,
            ).getTime() -
            new Date(
              b.scheduledAt,
            ).getTime(),
        )
        .slice(0, 3);
    }, [interviews]);

  const interviewCount =
    interviews.length;

  const recentApplications =
    useMemo(() => {
      return [
        ...applications,
      ]
        .sort(
          (
            a,
            b,
          ) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        )
        .slice(0, 5);
    }, [applications]);

  const displayedSkills =
    profile?.skills.slice(
      0,
      showAllSkills
        ? 20
        : 8,
    ) ?? [];

  const firstName =
    profile?.name
      ?.trim()
      .split(/\s+/)[0] ??
    "there";

  const currentHour =
    new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";

  const isLoading =
    profileQuery.isLoading ||
    jobsQuery.isLoading ||
    applicationsQuery.isLoading;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">

      {/* ===================================================
          BACKGROUND — SAME STYLE AS RECRUITER PROFILE
      =================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Base background */}
        <div className="absolute inset-0 bg-slate-950" />

        {/* Left Indigo Glow */}
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Right Purple Glow */}
        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

        {/* Bottom Blue Glow */}
        <div className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-3xl" />

        {/* Radial Highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />

        {/* Particle Wave */}
        <div
          className="
            absolute
            left-1/2
            top-0
            h-[520px]
            w-[900px]
            -translate-x-1/2
            overflow-hidden
            opacity-[0.10]
          "
        >
          <ParticleWave />
        </div>

      </div>

      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="relative z-10 overflow-hidden border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">

        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">

                <Sparkles className="h-3.5 w-3.5" />

                AI Career Hub

              </div>

              {profileQuery.isLoading ? (
                <>
                  <LoadingBlock className="h-8 w-64" />

                  <LoadingBlock className="mt-3 h-4 w-80" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">

                    {greeting},{" "}

                    {firstName} 👋

                  </h1>

                  <p className="mt-1 max-w-2xl text-sm text-slate-400">
                    Track your applications,
                    improve your resume,
                    discover better
                    opportunities, and
                    prepare for your next
                    interview.
                  </p>
                </>
              )}

            </div>

            <div className="flex items-center gap-3">

              <Link
                href="/candidate/jobs"
                className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-slate-300 shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <Search className="h-4 w-4" />

                Find jobs
              </Link>

              <Link
                href="/candidate/profile"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
              >
                {profile?.image ? (
                  <img
                    src={
                      profile.image
                    }
                    alt={
                      profile.name ??
                      "Candidate"
                    }
                    className="h-9 w-9 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                    {getInitials(
                      profile?.name,
                    )}
                  </div>
                )}

                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-white">
                    {profile?.name ??
                      "Candidate"}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    View profile
                  </p>
                </div>

                <ChevronRight className="hidden h-4 w-4 text-slate-600 sm:block" />
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <motion.div
        variants={
          containerVariants
        }
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      >

        {/* PROFILE COMPLETION */}

        <motion.div
          variants={
            itemVariants
          }
        >
          <GlassCard className="relative overflow-hidden">

            <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-indigo-500/10 via-transparent to-transparent lg:block" />

            <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                  <Target className="h-5 w-5" />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="font-bold text-white">
                      Complete your
                      candidate profile
                    </h2>

                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-300">
                      {profileCompletion}%
                      complete
                    </span>

                  </div>

                  <p className="mt-1 max-w-xl text-sm text-slate-400">
                    A complete profile helps
                    our AI understand your
                    skills and improve job
                    matching.
                  </p>

                </div>

              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3 lg:max-w-md">

                <div className="flex items-center justify-between text-xs font-semibold">

                  <span className="text-slate-500">
                    Profile strength
                  </span>

                  <span className="text-slate-300">
                    {profileCompletion}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${profileCompletion}%`,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />

                </div>

                <Link
                  href="/candidate/profile"
                  className="inline-flex items-center gap-2 self-start text-xs font-semibold text-indigo-300 transition hover:text-indigo-200"
                >
                  Improve profile

                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

              </div>

            </div>

          </GlassCard>
        </motion.div>

        {/* STATS */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            icon={
              BriefcaseBusiness
            }
            label="Applications"
            value={
              applicationsQuery.isLoading
                ? "—"
                : applicationStats.total
            }
            description="Jobs you've applied to"
            href="/candidate/applications"
          />

          <StatCard
            icon={Clock3}
            label="Active applications"
            value={
              applicationsQuery.isLoading
                ? "—"
                : applicationStats.active
            }
            description="Currently in progress"
            href="/candidate/applications"
          />

          <StatCard
            icon={
              CalendarDays
            }
            label="Interviews"
            value={
              interviewsQuery.isLoading
                ? "—"
                : interviewCount
            }
            description="Scheduled interview records"
            href="/candidate/interviews"
          />

          <StatCard
            icon={
              CheckCircle2
            }
            label="Accepted"
            value={
              applicationsQuery.isLoading
                ? "—"
                : applicationStats.accepted
            }
            description="Successful applications"
            href="/candidate/applications"
          />

        </div>

        {/* MAIN GRID */}

        <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">

          {/* LEFT */}

          <div className="space-y-6">

            {/* RECENT APPLICATIONS */}

            <motion.div
              variants={
                itemVariants
              }
            >
              <GlassCard className="overflow-hidden">

                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">

                  <div>

                    <h2 className="font-bold text-white">
                      Recent applications
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Keep track of your latest
                      opportunities.
                    </p>

                  </div>

                  <Link
                    href="/candidate/applications"
                    className="hidden items-center gap-1 text-xs font-semibold text-indigo-300 sm:flex"
                  >
                    View all

                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                </div>

                <div className="p-3 sm:p-4">

                  {applicationsQuery.isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(
                        (item) => (
                          <LoadingBlock
                            key={
                              item
                            }
                            className="h-20 w-full"
                          />
                        ),
                      )}
                    </div>
                  ) : recentApplications.length ===
                    0 ? (
                    <EmptyState
                      icon={
                        BriefcaseBusiness
                      }
                      title="No applications yet"
                      description="Start exploring jobs that match your skills and experience."
                      href="/candidate/jobs"
                      action="Explore jobs"
                    />
                  ) : (
                    <div className="space-y-2">

                      {recentApplications.map(
                        (
                          application,
                          index,
                        ) => {
                          const status =
                            getApplicationStatus(
                              application.status,
                            );

                          const StatusIcon =
                            getStatusIcon(
                              status,
                            );

                          const job =
                            jobs.find(
                              (
                                item,
                              ) =>
                                item.id ===
                                application.jobId,
                            );

                          return (
                            <motion.div
                              key={
                                application.id
                              }
                              initial={{
                                opacity: 0,
                                x: -12,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              transition={{
                                delay:
                                  index *
                                  0.05,
                              }}
                              className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                            >

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                                <BriefcaseBusiness className="h-5 w-5" />
                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="truncate text-sm font-semibold text-white">
                                  {job?.title ??
                                    `Application #${application.id.slice(
                                      0,
                                      8,
                                    )}`}
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">

                                  {job?.location && (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />

                                      {
                                        job.location
                                      }
                                    </span>
                                  )}

                                  <span>
                                    Applied{" "}
                                    {formatDate(
                                      application.createdAt,
                                    )}
                                  </span>

                                </div>

                              </div>

                              <div
                                className={[
                                  "hidden items-center gap-1.5",
                                  "rounded-full border px-2.5 py-1",
                                  "text-[10px] font-bold sm:flex",
                                  getStatusColor(
                                    status,
                                  ),
                                ].join(
                                  " ",
                                )}
                              >
                                <StatusIcon className="h-3 w-3" />

                                {status.replaceAll(
                                  "_",
                                  " ",
                                )}
                              </div>

                              <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-300" />

                            </motion.div>
                          );
                        },
                      )}

                    </div>
                  )}

                </div>

              </GlassCard>
            </motion.div>

            {/* RECOMMENDED JOBS */}

            <motion.div
              variants={
                itemVariants
              }
            >
              <GlassCard className="overflow-hidden">

                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="font-bold text-white">
                        Recommended for you
                      </h2>

                      <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold text-violet-300">
                        AI
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Opportunities from your
                      candidate job feed.
                    </p>

                  </div>

                  <Link
                    href="/candidate/jobs"
                    className="hidden items-center gap-1 text-xs font-semibold text-indigo-300 sm:flex"
                  >
                    Browse jobs

                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                </div>

                <div className="grid gap-3 p-4 md:grid-cols-2">

                  {jobsQuery.isLoading ? (
                    [1, 2, 3, 4].map(
                      (item) => (
                        <LoadingBlock
                          key={
                            item
                          }
                          className="h-40"
                        />
                      ),
                    )
                  ) : jobs.length ===
                    0 ? (
                    <div className="md:col-span-2">
                      <EmptyState
                        icon={
                          Search
                        }
                        title="No jobs found"
                        description="There are currently no jobs available in your candidate feed."
                        href="/candidate/jobs"
                        action="Search jobs"
                      />
                    </div>
                  ) : (
                    jobs
                      .slice(0, 4)
                      .map(
                        (
                          job,
                          index,
                        ) => {
                          const skills =
                            getJobSkills(
                              job,
                            );

                          return (
                            <motion.div
                              key={
                                job.id
                              }
                              initial={{
                                opacity: 0,
                                y: 10,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                delay:
                                  index *
                                  0.06,
                              }}
                              whileHover={{
                                y: -3,
                              }}
                              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-indigo-400/20 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-indigo-500/5"
                            >

                              <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                                  <BriefcaseBusiness className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">

                                  <h3 className="truncate text-sm font-bold text-white">
                                    {
                                      job.title
                                    }
                                  </h3>

                                  {job.location && (
                                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                      <MapPin className="h-3 w-3" />

                                      {
                                        job.location
                                      }
                                    </p>
                                  )}

                                </div>

                              </div>

                              {skills.length >
                                0 && (
                                <div className="mt-4 flex flex-wrap gap-1.5">

                                  {skills
                                    .slice(
                                      0,
                                      3,
                                    )
                                    .map(
                                      (
                                        skill,
                                      ) => (
                                        <span
                                          key={
                                            skill
                                          }
                                          className="rounded-lg bg-white/[0.06] px-2 py-1 text-[10px] font-medium text-slate-400"
                                        >
                                          {
                                            skill
                                          }
                                        </span>
                                      ),
                                    )}

                                  {skills.length >
                                    3 && (
                                    <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-[10px] font-medium text-slate-500">
                                      +
                                      {skills.length -
                                        3}
                                    </span>
                                  )}

                                </div>
                              )}

                              <Link
                                href={`/candidate/jobs/${job.id}`}
                                className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-semibold text-indigo-300"
                              >
                                View opportunity

                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                              </Link>

                            </motion.div>
                          );
                        },
                      )
                  )}

                </div>

              </GlassCard>
            </motion.div>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* RESUME AI SCORE */}

            <motion.div
              variants={
                itemVariants
              }
            >
              <GlassCard className="overflow-hidden">

                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white">

                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-500/20 blur-2xl" />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="flex items-center gap-2">

                          <Sparkles className="h-4 w-4 text-indigo-300" />

                          <span className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-300">
                            AI Resume
                          </span>

                        </div>

                        <h2 className="mt-2 text-lg font-bold">
                          Resume health
                        </h2>

                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <FileText className="h-5 w-5" />
                      </div>

                    </div>

                    {resumesQuery.isLoading ||
                    analysisQuery.isLoading ? (
                      <div className="mt-7">
                        <LoadingBlock className="h-24 w-24 rounded-full bg-white/10" />
                      </div>
                    ) : !resumes[0] ? (
                      <div className="mt-6">

                        <p className="text-sm text-slate-300">
                          Upload your resume
                          to get an
                          AI-powered score
                          and improvement
                          suggestions.
                        </p>

                        <Link
                          href="/candidate/resume"
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-slate-100"
                        >
                          <Plus className="h-3.5 w-3.5" />

                          Upload resume
                        </Link>

                      </div>
                    ) : (
                      <div className="mt-6 flex items-center gap-5">

                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/10">

                          <svg
                            className="absolute inset-0 h-full w-full -rotate-90"
                            viewBox="0 0 100 100"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="44"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="7"
                              className="text-white/10"
                            />

                            <motion.circle
                              cx="50"
                              cy="50"
                              r="44"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeDasharray="276"
                              initial={{
                                strokeDashoffset:
                                  276,
                              }}
                              animate={{
                                strokeDashoffset:
                                  276 -
                                  (276 *
                                    resumeScore) /
                                    100,
                              }}
                              transition={{
                                duration: 1.2,
                              }}
                              className="text-indigo-400"
                            />
                          </svg>

                          <div className="relative text-center">

                            <p className="text-2xl font-bold">
                              {
                                resumeScore
                              }
                            </p>

                            <p className="text-[8px] uppercase tracking-wider text-slate-400">
                              Score
                            </p>

                          </div>

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold">
                            {resumes[0]
                              ?.fileName ??
                              "Your resume"}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {resumeScore >=
                            80
                              ? "Excellent resume strength."
                              : resumeScore >=
                                  60
                                ? "Good foundation. A few improvements can help."
                                : "Your resume has room for improvement."}
                          </p>

                          <Link
                            href="/candidate/resume"
                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white"
                          >
                            Improve resume

                            <ArrowRight className="h-3 w-3" />
                          </Link>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {analysis && (
                  <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white">

                    <ScoreMini
                      label="Skills"
                      value={
                        analysis.skillsScore ??
                        0
                      }
                    />

                    <ScoreMini
                      label="Experience"
                      value={
                        analysis.experienceScore ??
                        0
                      }
                    />

                    <ScoreMini
                      label="Education"
                      value={
                        analysis.educationScore ??
                        0
                      }
                    />

                  </div>
                )}

              </GlassCard>
            </motion.div>

            {/* UPCOMING INTERVIEWS */}

            <motion.div
              variants={
                itemVariants
              }
            >
              <GlassCard className="overflow-hidden">

                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">

                  <div>

                    <h2 className="font-bold text-white">
                      Upcoming interviews
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Be ready for your next
                      conversation.
                    </p>

                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <CalendarDays className="h-4 w-4" />
                  </div>

                </div>

                <div className="p-4">

                  {interviewsQuery.isLoading ? (
                    <div className="space-y-3">

                      {[1, 2].map(
                        (item) => (
                          <LoadingBlock
                            key={
                              item
                            }
                            className="h-20"
                          />
                        ),
                      )}

                    </div>
                  ) : upcomingInterviews.length ===
                    0 ? (
                    <EmptyState
                      icon={
                        CalendarDays
                      }
                      title="No upcoming interviews"
                      description="When a recruiter schedules an interview, it will appear here."
                    />
                  ) : (
                    <div className="space-y-3">

                      {upcomingInterviews.map(
                        (
                          interview,
                        ) => (
                          <div
                            key={
                              interview.id
                            }
                            className="rounded-2xl border border-blue-400/10 bg-blue-500/5 p-4"
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <h3 className="truncate text-sm font-bold text-white">
                                  {interview.title ??
                                    "Job Interview"}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                  {formatInterviewDate(
                                    interview.scheduledAt,
                                  )}
                                </p>

                              </div>

                              <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-blue-300">
                                {
                                  interview.durationMinutes
                                }{" "}
                                min
                              </span>

                            </div>

                            <div className="mt-3 flex items-center justify-between">

                              <div className="flex items-center gap-2 text-[11px] text-slate-400">

                                <Clock3 className="h-3.5 w-3.5" />

                                {formatInterviewTime(
                                  interview.scheduledAt,
                                )}

                                <span className="text-slate-600">
                                  •
                                </span>

                                {interview.type.replace(
                                  "_",
                                  " ",
                                )}

                              </div>

                              {interview.meetingUrl && (
                                <a
                                  href={
                                    interview.meetingUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-bold text-blue-300 hover:text-blue-200"
                                >
                                  Join meeting
                                </a>
                              )}

                            </div>

                          </div>
                        ),
                      )}

                    </div>
                  )}

                  {upcomingInterviews.length >
                    0 && (
                    <Link
                      href="/candidate/interviews"
                      className="mt-4 flex items-center justify-center gap-1 rounded-xl bg-white/[0.04] py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      View interviews

                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}

                </div>

              </GlassCard>
            </motion.div>

            {/* SKILLS */}

            <motion.div
              variants={
                itemVariants
              }
            >
              <GlassCard className="p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="font-bold text-white">
                      Your skills
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Skills used for job matching.
                    </p>

                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    <BarChart3 className="h-4 w-4" />
                  </div>

                </div>

                {displayedSkills.length ===
                0 ? (
                  <div className="mt-5">

                    <EmptyState
                      icon={
                        BarChart3
                      }
                      title="No skills added"
                      description="Add your technical and professional skills to improve matching."
                      href="/candidate/profile"
                      action="Add skills"
                    />

                  </div>
                ) : (
                  <>
                    <div className="mt-5 flex flex-wrap gap-2">

                      {displayedSkills.map(
                        (
                          skill,
                          index,
                        ) => {
                          const skillName =
                            typeof skill ===
                            "string"
                              ? skill
                              : skill.name ??
                                "";

                          if (
                            !skillName.trim()
                          ) {
                            return null;
                          }

                          return (
                            <motion.span
                              key={`${skillName}-${index}`}
                              initial={{
                                opacity: 0,
                                scale: 0.9,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                delay:
                                  index *
                                  0.03,
                              }}
                              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:border-indigo-400/20 hover:bg-indigo-500/10 hover:text-indigo-300"
                            >
                              {
                                skillName
                              }
                            </motion.span>
                          );
                        },
                      )}

                    </div>

                    {profile &&
                      profile.skills.length >
                        8 && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowAllSkills(
                              (
                                current,
                              ) =>
                                !current,
                            )
                          }
                          className="mt-4 text-xs font-semibold text-indigo-300 hover:text-indigo-200"
                        >
                          {showAllSkills
                            ? "Show less"
                            : `Show all ${profile.skills.length} skills`}
                        </button>
                      )}

                  </>
                )}

              </GlassCard>
            </motion.div>

          </div>

        </div>

        {/* CAREER TOOLS */}

        <motion.div
          variants={
            itemVariants
          }
        >

          <div className="mb-4">

            <h2 className="text-lg font-bold text-white">
              Career tools
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Everything you need to move
              your career forward.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickAction
              href="/candidate/jobs"
              icon={Search}
              title="Find jobs"
              description="Discover opportunities matching your skills."
              className="from-indigo-950/60 to-slate-950"
            />

            <QuickAction
              href="/candidate/resume"
              icon={FileText}
              title="Improve resume"
              description="Analyze your resume with AI."
              className="from-cyan-950/60 to-slate-950"
            />

            <QuickAction
              href="/candidate/interview-practice"
              icon={
                MessageCircle
              }
              title="Practice interview"
              description="Prepare for technical and HR questions."
              className="from-blue-950/60 to-slate-950"
            />

            <QuickAction
              href="/candidate/profile"
              icon={
                UserRound
              }
              title="Update profile"
              description="Keep your candidate profile complete."
              className="from-emerald-950/60 to-slate-950"
            />

          </div>

        </motion.div>

        {/* PROFILE SNAPSHOT */}

        <motion.div
          variants={
            itemVariants
          }
        >
          <GlassCard className="overflow-hidden">

            <div className="grid lg:grid-cols-[auto_1fr_auto] lg:items-center">

              <div className="flex items-center gap-4 border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-6">

                {profile?.image ? (
                  <img
                    src={
                      profile.image
                    }
                    alt={
                      profile.name ??
                      "Candidate"
                    }
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                    {getInitials(
                      profile?.name,
                    )}
                  </div>
                )}

                <div>

                  <h2 className="font-bold text-white">
                    {profile?.name ??
                      "Candidate"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {profile?.experience ??
                      "Experience not added"}
                  </p>

                  {profile?.location && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">

                      <MapPin className="h-3 w-3" />

                      {
                        profile.location
                      }

                    </p>
                  )}

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 lg:p-6">

                <ProfileMetric
                  icon={
                    BarChart3
                  }
                  label="Skills"
                  value={
                    profile?.skills
                      .length ?? 0
                  }
                />

                <ProfileMetric
                  icon={
                    GraduationCap
                  }
                  label="Education"
                  value={
                    profile?.education
                      .length ?? 0
                  }
                />

                <ProfileMetric
                  icon={
                    Award
                  }
                  label="Projects"
                  value={
                    profile?.projects
                      .length ?? 0
                  }
                />

                <ProfileMetric
                  icon={
                    FileText
                  }
                  label="Resumes"
                  value={
                    resumes.length
                  }
                />

              </div>

              <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0 lg:p-6">

                <Link
                  href="/candidate/profile"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Manage profile

                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

              </div>

            </div>

          </GlassCard>
        </motion.div>

        {/* MOBILE ACTIONS */}

        <div className="flex gap-3 sm:hidden">

          <Link
            href="/candidate/jobs"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold text-slate-300 shadow-sm"
          >
            <Search className="h-4 w-4" />

            Find jobs
          </Link>

          <Link
            href="/candidate/applications"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-950"
          >
            <BriefcaseBusiness className="h-4 w-4" />

            Applications
          </Link>

        </div>

        {isLoading && (
          <p className="text-center text-[10px] text-slate-500">
            Loading your career
            dashboard...
          </p>
        )}

      </motion.div>

    </main>
  );
}
