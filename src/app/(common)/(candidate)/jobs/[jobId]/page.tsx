
"use client";

import { use } from "react";
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

import type { Job, SkillGap, SkillGapResponse } from "@/types/job";

import {
  useJob,
  useJobMatch,
  useSkillGap,
  useMatchSummary,
} from "../useJobs";
import ApplyJobDialog from "../ApplyJobDialog";




interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}


export default function JobDetailsPage({
  params,
}: PageProps) {
  /**
   * Next.js provides params as a Promise.
   *
   * Because this is a Client Component, React's use()
   * unwraps the Promise.
   */
  const { jobId } = use(params);

  /**
   * jobId is now guaranteed to be a string.
   */
  const {
    data: job,
    isLoading: jobLoading,
  } = useJob(jobId);

  const {
    data: match,
    isLoading: matchLoading,
  } = useJobMatch(jobId);

  const {
    data: skillGap,
    isLoading: gapLoading,
  } = useSkillGap(jobId);

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useMatchSummary(jobId);


  if (jobLoading) {
    return <JobDetailsSkeleton />;
  }


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


  const score =
    match?.score ??
    match?.matchScore ??
    0;


  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

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
                      job.employmentType
                    )}
                  />
                )}


                {job.experienceLevel && (
                  <InfoPill
                    icon={<TrendingUp />}
                    text={formatValue(
                      job.experienceLevel
                    )}
                  />
                )}


                {job.deadline && (
                  <InfoPill
                    icon={<CalendarDays />}
                    text={`Deadline ${new Date(
                      job.deadline
                    ).toLocaleDateString()}`}
                  />
                )}

              </div>

            </motion.div>


            {/* MATCH */}

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


      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

          {/* MAIN */}

          <div className="space-y-10">

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


            {/* REQUIRED SKILLS */}

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
                        {skill.name || "Required"}
                      </span>

                    </motion.div>
                  )
                )}

              </div>

            </section>


            {/* AI SUMMARY */}

            <section>

              <SectionTitle>
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />

                  AI application analysis
                </span>
              </SectionTitle>


              <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.05] p-7">

                {summaryLoading ? (
                  <div className="space-y-3">

                    <div className="h-4 animate-pulse rounded bg-white/10" />

                    <div className="h-4 animate-pulse rounded bg-white/10" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />

                  </div>
                ) : (
                  <>

                    <p className="leading-7 text-slate-300">
                      {summary?.summary ||
                        "AI analysis is being prepared for your profile."}
                    </p>


                    {summary?.strengths &&
                      summary.strengths.length > 0 && (
                        <div className="mt-7">

                          <h4 className="font-semibold">
                            Your strengths
                          </h4>


                          <div className="mt-3 space-y-2">

                            {summary.strengths.map(
                              (item) => (
                                <div
                                  key={item}
                                  className="flex gap-2 text-sm text-slate-300"
                                >

                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                                  {item}

                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}


                    {summary?.recommendations &&
                      summary.recommendations.length > 0 && (
                        <div className="mt-7">

                          <h4 className="font-semibold">
                            Recommendations
                          </h4>


                          <div className="mt-3 space-y-2">

                            {summary.recommendations.map(
                              (item) => (
                                <div
                                  key={item}
                                  className="text-sm text-slate-300"
                                >
                                  • {item}
                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                  </>
                )}

              </div>

            </section>


            {/* SKILL GAP */}

            <section>

              <SectionTitle>
                Skill gap analysis
              </SectionTitle>


              <SkillGapSection
                skillGap={skillGap}
                loading={gapLoading}
              />

            </section>

          </div>


          {/* SIDEBAR */}

          <aside className="space-y-5">

            <div className="sticky top-24 space-y-5">

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
                          job.deadline
                        ).toLocaleDateString()
                      : "Open"}
                  </p>

                </div>


                <ApplyJobDialog
                  jobId={job.id}
                  jobTitle={job.title}
                />

              </div>


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


/* ----------------------------- */
/* Components */
/* ----------------------------- */


function MatchScoreCard({
  score,
  loading,
}: {
  score: number;
  loading: boolean;
}) {
  const normalizedScore =
    Math.max(0, Math.min(100, score));


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
                {normalizedScore}%
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
              Based on your skills and
              experience.
            </p>

          </div>

        </div>
      )}

    </div>
  );
}


function SkillGapSection({
  skillGap,
  loading,
}: {
  skillGap: SkillGapResponse | undefined;
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


  const missing =
    skillGap?.missingSkills || [];

  const matched =
    skillGap?.skills || [];


  return (
    <div className="space-y-6">

      {matched.length > 0 && (
        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-6">

          <h3 className="flex items-center gap-2 font-semibold">

            <CheckCircle2 className="h-5 w-5 text-emerald-400" />

            Skills you have

          </h3>


          <div className="mt-4 flex flex-wrap gap-2">

            {matched.map(
              (skill) => (
                <span
                  key={skill.currentLevel}
                  className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300"
                >
                  {skill.requiredLevel}
                </span>
              )
            )}

          </div>

        </div>
      )}


      {missing.length > 0 && (
        <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-6">

          <h3 className="flex items-center gap-2 font-semibold">

            <XCircle className="h-5 w-5 text-amber-400" />

            Skills to improve

          </h3>


          <div className="mt-4 flex flex-wrap gap-2">

            {missing.map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-amber-400/10 px-3 py-1.5 text-sm text-amber-300"
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>
      )}


      {missing.length === 0 &&
        matched.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
            AI skill-gap analysis is not
            available yet.
          </div>
        )}

    </div>
  );
}


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


function formatValue(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}


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


