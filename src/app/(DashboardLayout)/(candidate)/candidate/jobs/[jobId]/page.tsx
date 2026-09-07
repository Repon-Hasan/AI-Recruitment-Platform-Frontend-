
"use client";

import { use, useEffect, useRef } from "react";

import type { ReactNode } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { motion } from "motion/react";

import { toast } from "sonner";

import type { Job } from "@/types/job";

import {
  useCalculateJobMatch,
  useJob,
  useJobMatch,
  useMyApplications,
} from "../useJobs";

import ApplyJobDialog from "../ApplyJobDialog";
import { MyApplication } from "@/lib/api/jobs.api";

/* =========================================================
   PAGE TYPES
========================================================= */

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

/* =========================================================
   PAGE
========================================================= */

export default function JobDetailsPage({
  params,
}: PageProps) {
  const { jobId } = use(params);

  /* -------------------------------------------------------
     JOB
  ------------------------------------------------------- */

  const {
    data: job,
    isLoading: jobLoading,
  } = useJob(jobId);

  /* -------------------------------------------------------
     MY APPLICATIONS
  ------------------------------------------------------- */

  const {
    data: myApplications,
    isLoading: applicationsLoading,
  } = useMyApplications();

  /* -------------------------------------------------------
     EXISTING MATCH
  ------------------------------------------------------- */

  const {
    data: existingMatch,
    isLoading: existingMatchLoading,
  } = useJobMatch(jobId);

  /* -------------------------------------------------------
     CALCULATE MATCH
  ------------------------------------------------------- */

  const calculateMatch = useCalculateJobMatch();

  /*
   * Prevent duplicate calculation calls in React Strict Mode.
   */
  const calculationStarted = useRef(false);

  useEffect(() => {
    if (!jobId) return;

    /*
     * If an existing match already exists,
     * there is no need to calculate again.
     */
    if (existingMatch) return;

    /*
     * Prevent duplicate mutation calls.
     */
    if (calculationStarted.current) return;

    calculationStarted.current = true;

    calculateMatch.mutate(jobId);
  }, [
    jobId,
    existingMatch,
    calculateMatch,
  ]);

  /* -------------------------------------------------------
     APPLICATION STATUS
  ------------------------------------------------------- */

  /*
   * Check whether the current candidate has already
   * applied to this job.
   *
   * Supports both:
   *
   * 1. data = application[]
   *
   * 2. data = { applications: application[] }
   *
   * This keeps the page safe if your API service unwraps
   * the response differently.
   */

const applications: MyApplication[] = Array.isArray(myApplications)
  ? myApplications
  : myApplications?.applications ?? [];

const alreadyApplied = applications.some(
  (application) => application.jobId === jobId,
);

  /* -------------------------------------------------------
     MATCH DATA
  ------------------------------------------------------- */

  /*
   * Prefer newly calculated match.
   *
   * If calculation has not completed yet, use the
   * existing cached match if available.
   */
  const match =
    calculateMatch.data ?? existingMatch;

  const matchLoading =
    existingMatchLoading ||
    calculateMatch.isPending;

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  if (jobLoading) {
    return <JobDetailsSkeleton />;
  }

  /* -------------------------------------------------------
     JOB NOT FOUND
  ------------------------------------------------------- */

  if (!job) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Job not found
          </h1>

          <Link
            href="/jobs"
            className="mt-4 inline-block text-blue-400"
          >
            Back to jobs
          </Link>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------
     MATCH SCORE
  ------------------------------------------------------- */

  const score =
    match?.overallMatchPercentage ?? 0;

  /* -------------------------------------------------------
     MATCHED SKILLS
  ------------------------------------------------------- */

  const matchedSkills =
    match?.matchedSkills ?? [];

  /* -------------------------------------------------------
     MISSING SKILLS
  ------------------------------------------------------- */

  const missingHigh =
    match?.missingSkills?.high ?? [];

  const missingMedium =
    match?.missingSkills?.medium ?? [];

  const missingLow =
    match?.missingSkills?.low ?? [];

  const missingSkills = [
    ...missingHigh,
    ...missingMedium,
    ...missingLow,
  ];

  /* -------------------------------------------------------
     AI SUMMARY
  ------------------------------------------------------- */

  const aiRecommendation =
    match?.recommendation ??
    "AI analysis is being prepared for your profile.";

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 lg:px-8">

          <Link
            href="/jobs"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">

            {/* =================================================
                JOB INFORMATION
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >

              <div className="flex items-start gap-5">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20">

                  <BriefcaseBusiness className="h-8 w-8 text-blue-300" />

                </div>

                <div>

                  <span className="text-sm text-blue-400">
                    {job.company?.name ||
                      "AI Recruitment Platform"}
                  </span>

                  <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    {job.title}
                  </h1>

                </div>

              </div>

              <div className="mt-8 flex flex-wrap gap-4">

                {job.location && (
                  <InfoPill
                    icon={<MapPin />}
                    text={job.location}
                  />
                )}

                {job.employmentType && (
                  <InfoPill
                    icon={<BriefcaseBusiness />}
                    text={formatValue(
                      job.employmentType,
                    )}
                  />
                )}

                {job.experienceLevel && (
                  <InfoPill
                    icon={<TrendingUp />}
                    text={formatValue(
                      job.experienceLevel,
                    )}
                  />
                )}

                {job.deadline && (
                  <InfoPill
                    icon={<CalendarDays />}
                    text={`Deadline ${new Date(
                      job.deadline,
                    ).toLocaleDateString()}`}
                  />
                )}

              </div>

            </motion.div>

            {/* =================================================
                MATCH SCORE
            ================================================= */}

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
                delay: 0.2,
                duration: 0.6,
              }}
            >

              <MatchScoreCard
                score={score}
                loading={matchLoading}
              />

            </motion.div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

          {/* =================================================
              MAIN
          ================================================= */}

          <div className="space-y-10">

            {/* =================================================
                ABOUT
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
            >

              <SectionTitle>
                About this position
              </SectionTitle>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

                <p className="whitespace-pre-line leading-8 text-slate-300">
                  {job.description}
                </p>

              </div>

            </motion.section>

            {/* =================================================
                REQUIRED SKILLS
            ================================================= */}

            <section>

              <SectionTitle>
                Required skills
              </SectionTitle>

              <div className="grid gap-3 sm:grid-cols-2">

                {job.requiredSkills?.map(
                  (skill) => (
                    <motion.div
                      key={skill.name}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >

                      <div className="flex items-center gap-3">

                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                        <span>
                          {skill.name}
                        </span>

                      </div>

                      <span className="text-xs capitalize text-slate-500">
                        {skill?.name ||
                          "Required"}
                      </span>

                    </motion.div>
                  ),
                )}

              </div>

            </section>

            {/* =================================================
                AI APPLICATION ANALYSIS
            ================================================= */}

            <section>

              <SectionTitle>

                <span className="flex items-center gap-2">

                  <Sparkles className="h-5 w-5 text-blue-400" />

                  AI application analysis

                </span>

              </SectionTitle>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.05] p-7">

                {matchLoading ? (

                  <div className="space-y-3">

                    <div className="h-4 animate-pulse rounded bg-white/10" />

                    <div className="h-4 animate-pulse rounded bg-white/10" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />

                  </div>

                ) : calculateMatch.isError ? (

                  <div className="text-sm text-amber-300">

                    AI match analysis could not
                    be calculated yet.

                    <p className="mt-2 text-slate-400">

                      Please make sure your profile
                      has a resume with an available
                      embedding.

                    </p>

                  </div>

                ) : (

                  <>

                    <p className="leading-7 text-slate-300">
                      {aiRecommendation}
                    </p>

                    {/* =========================================
                        MATCHED SKILLS
                    ========================================= */}

                    {matchedSkills.length > 0 && (

                      <div className="mt-7">

                        <h4 className="font-semibold">
                          Your strengths
                        </h4>

                        <div className="mt-3 space-y-2">

                          {matchedSkills.map(
                            (skill) => (

                              <div
                                key={skill}
                                className="flex gap-2 text-sm text-slate-300"
                              >

                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                                {skill}

                              </div>

                            ),
                          )}

                        </div>

                      </div>

                    )}

                    {/* =========================================
                        RECOMMENDATIONS
                    ========================================= */}

                    {missingSkills.length > 0 && (

                      <div className="mt-7">

                        <h4 className="font-semibold">
                          Recommendations
                        </h4>

                        <div className="mt-3 space-y-2">

                          {missingSkills
                            .slice(0, 5)
                            .map(
                              (skill) => (

                                <div
                                  key={skill}
                                  className="text-sm text-slate-300"
                                >
                                  • Improve your{" "}
                                  {skill} skills
                                </div>

                              ),
                            )}

                        </div>

                      </div>

                    )}

                  </>

                )}

              </div>

            </section>

            {/* =================================================
                SKILL GAP
            ================================================= */}

            <section>

              <SectionTitle>
                Skill gap analysis
              </SectionTitle>

              <SkillGapSection
                matchedSkills={matchedSkills}
                missingHigh={missingHigh}
                missingMedium={missingMedium}
                missingLow={missingLow}
                loading={matchLoading}
              />

            </section>

          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-5">

            <div className="sticky top-24 space-y-5">

              {/* ===============================================
                  APPLICATION CARD
              =============================================== */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="mb-5">

                  <p className="text-sm text-slate-500">
                    Salary
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {formatSalary(job)}
                  </p>

                </div>

                <div className="mb-6 border-t border-white/10 pt-5">

                  <p className="text-sm text-slate-500">
                    Application deadline
                  </p>

                  <p className="mt-1 font-medium">

                    {job.deadline
                      ? new Date(
                          job.deadline,
                        ).toLocaleDateString()
                      : "Open"}

                  </p>

                </div>

                {/* =============================================
                    APPLY BUTTON
                ============================================= */}

                {applicationsLoading ? (

                  <button
                    type="button"
                    disabled
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white opacity-60"
                  >
                    Checking application...
                  </button>

                ) : alreadyApplied ? (

                  <button
                    type="button"
                    aria-disabled="true"
                    onClick={() => {
                      toast.info(
                        "You have already applied for this job.",
                        {
                          description:
                            "You cannot submit another application for the same job.",
                        },
                      );
                    }}
                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 font-semibold text-emerald-300 opacity-80"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Already Applied
                  </button>

                ) : (

                  <ApplyJobDialog
                    jobId={job.id}
                    jobTitle={job.title}
                  />

                )}

              </div>

              {/* ===============================================
                  AI MATCHING INFORMATION
              =============================================== */}

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10">

                  <Target className="h-5 w-5 text-blue-400" />

                </div>

                <h3 className="mt-4 font-semibold">
                  AI-powered matching
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">

                  Your profile is automatically
                  compared with this job&apos;s
                  requirements to identify your
                  strengths and skill gaps.

                </p>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   MATCH SCORE CARD
========================================================= */

function MatchScoreCard({
  score,
  loading,
}: {
  score: number;
  loading: boolean;
}) {
  const normalizedScore =
    Math.max(
      0,
      Math.min(
        100,
        Number(score) || 0,
      ),
    );

  return (
    <div className="rounded-3xl border border-blue-400/20 bg-blue-400/[0.05] p-7 backdrop-blur-xl">

      <div className="flex items-center gap-2 text-sm text-blue-300">

        <Sparkles className="h-4 w-4" />

        AI Match

      </div>

      {loading ? (

        <div className="mt-5 h-20 animate-pulse rounded-xl bg-white/10" />

      ) : (

        <div className="mt-5 flex items-center gap-6">

          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-blue-400/20">

            <div className="text-center">

              <div className="text-3xl font-bold">
                {Math.round(normalizedScore)}%
              </div>

              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Match
              </div>

            </div>

          </div>

          <div>

            <p className="font-semibold">

              {normalizedScore >= 80
                ? "Excellent match"
                : normalizedScore >= 60
                  ? "Good match"
                  : "Potential match"}

            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">

              Based on your skills,
              resume and job requirements.

            </p>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   SKILL GAP SECTION
========================================================= */

function SkillGapSection({
  matchedSkills,
  missingHigh,
  missingMedium,
  missingLow,
  loading,
}: {
  matchedSkills: string[];
  missingHigh: string[];
  missingMedium: string[];
  missingLow: string[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">

        {[1, 2, 3].map((item) => (

          <div
            key={item}
            className="h-16 animate-pulse rounded-xl bg-white/5"
          />

        ))}

      </div>
    );
  }

  const hasMatched =
    matchedSkills.length > 0;

  const hasMissing =
    missingHigh.length > 0 ||
    missingMedium.length > 0 ||
    missingLow.length > 0;

  if (!hasMatched && !hasMissing) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">

        AI skill-gap analysis is not
        available yet.

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =====================================================
          MATCHED SKILLS
      ===================================================== */}

      {hasMatched && (

        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-6">

          <h3 className="flex items-center gap-2 font-semibold">

            <CheckCircle2 className="h-5 w-5 text-emerald-400" />

            Skills you have

          </h3>

          <div className="mt-4 flex flex-wrap gap-2">

            {matchedSkills.map(
              (skill) => (

                <span
                  key={skill}
                  className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300"
                >
                  {skill}
                </span>

              ),
            )}

          </div>

        </div>

      )}

      {/* =====================================================
          HIGH PRIORITY
      ===================================================== */}

      {missingHigh.length > 0 && (

        <SkillPriorityBlock
          title="High priority skills"
          skills={missingHigh}
          description="These skills are important for this position."
        />

      )}

      {/* =====================================================
          MEDIUM PRIORITY
      ===================================================== */}

      {missingMedium.length > 0 && (

        <SkillPriorityBlock
          title="Medium priority skills"
          skills={missingMedium}
          description="Improving these skills can strengthen your application."
        />

      )}

      {/* =====================================================
          LOW PRIORITY
      ===================================================== */}

      {missingLow.length > 0 && (

        <SkillPriorityBlock
          title="Skills to consider"
          skills={missingLow}
          description="These skills may further improve your profile."
        />

      )}

    </div>
  );
}

/* =========================================================
   SKILL PRIORITY BLOCK
========================================================= */

function SkillPriorityBlock({
  title,
  skills,
  description,
}: {
  title: string;
  skills: string[];
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-6">

      <h3 className="flex items-center gap-2 font-semibold">

        <XCircle className="h-5 w-5 text-amber-400" />

        {title}

      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">

        {skills.map(
          (skill) => (

            <span
              key={skill}
              className="rounded-lg bg-amber-400/10 px-3 py-1.5 text-sm text-amber-300"
            >
              {skill}
            </span>

          ),
        )}

      </div>

    </div>
  );
}

/* =========================================================
   INFO PILL
========================================================= */

function InfoPill({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">

      <span className="h-4 w-4 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>

      {text}

    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h2 className="mb-5 text-2xl font-bold">
      {children}
    </h2>
  );
}

/* =========================================================
   FORMAT VALUE
========================================================= */

function formatValue(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

/* =========================================================
   FORMAT SALARY
========================================================= */

function formatSalary(job: Job) {
  if (
    job.salaryMin == null &&
    job.salaryMax == null
  ) {
    return "Salary not disclosed";
  }

  const currency =
    job.salaryCurrency || "BDT";

  if (
    job.salaryMin != null &&
    job.salaryMax != null
  ) {
    return `${currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
  }

  if (job.salaryMin != null) {
    return `${currency} ${job.salaryMin.toLocaleString()}`;
  }

  if (job.salaryMax != null) {
    return `${currency} ${job.salaryMax.toLocaleString()}`;
  }

  return "Salary not disclosed";
}

/* =========================================================
   JOB DETAILS SKELETON
========================================================= */

function JobDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-32">

      <div className="mx-auto max-w-7xl animate-pulse space-y-10">

        <div className="h-8 w-32 rounded bg-white/10" />

        <div className="h-20 w-2/3 rounded bg-white/10" />

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="h-96 rounded-2xl bg-white/5 lg:col-span-2" />

          <div className="h-80 rounded-2xl bg-white/5" />

        </div>

      </div>

    </main>
  );
}

