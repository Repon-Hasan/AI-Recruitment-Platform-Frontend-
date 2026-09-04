"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  candidatesApi,
  type Candidate,
  type JobMatch,
  type JobMatchSummary,
  type SkillGap,
} from "@/lib/api/candidates";

import ParticleWave from "@/components/ui/particle-wave";

/* =========================================================
   HELPERS
========================================================= */

function getName(candidate: Candidate): string {
  return (
    candidate.name ??
    candidate.candidateProfile?.name ??
    candidate.user?.name ??
    "Unnamed Candidate"
  );
}

function getTitle(candidate: Candidate): string {
  return (
    candidate.title ??
    candidate.headline ??
    candidate.candidateProfile?.title ??
    candidate.candidateProfile?.headline ??
    "Professional Candidate"
  );
}

function getLocation(candidate: Candidate): string {
  return (
    candidate.location ??
    candidate.candidateProfile?.location ??
    "Location not specified"
  );
}

function getExperience(candidate: Candidate): number {
  return (
    candidate.experience ??
    candidate.yearsOfExperience ??
    candidate.candidateProfile?.experience ??
    candidate.candidateProfile?.yearsOfExperience ??
    0
  );
}

function getSkills(candidate: Candidate): string[] {
  const skills =
    candidate.skills ??
    candidate.candidateProfile?.skills ??
    [];

  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) =>
      typeof skill === "string"
        ? skill
        : skill.name ?? "",
    )
    .filter(Boolean);
}

function getScore(
  match: JobMatch | null,
): number | null {
  if (!match) {
    return null;
  }

  const score =
    match.matchScore ??
    match.score ??
    match.percentage ??
    null;

  if (typeof score !== "number") {
    return null;
  }

  return Math.round(
    score <= 1 ? score * 100 : score,
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function CandidateProfilePage() {
  const params = useParams<{
    candidateId: string;
  }>();

  const candidateId = params.candidateId;

  const [candidate, setCandidate] =
    useState<Candidate | null>(null);

  const [match, setMatch] =
    useState<JobMatch | null>(null);

  const [summary, setSummary] =
    useState<JobMatchSummary | null>(null);

  const [skillGap, setSkillGap] =
    useState<SkillGap | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================================
     LOAD CANDIDATE
  ========================================================= */

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const candidates =
          await candidatesApi.getAllCandidates();

        const found =
          candidates.find(
            (item) =>
              item.id === candidateId ||
              item.candidateProfile?.id ===
                candidateId ||
              item.userId === candidateId,
          ) ?? null;

        setCandidate(found);

        /*
         * The job-match endpoint requires a MATCH ID,
         * not necessarily a candidate ID.
         *
         * Therefore, once a job is selected on the
         * discovery page, the selected match should be
         * passed to this page if you want full
         * match-summary/skill-gap data.
         */
      } catch (error) {
        console.error(
          "Failed to load candidate:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      void load();
    }
  }, [candidateId]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent text-white">
        {/* ===================================================
            PARTICLE WAVE BACKGROUND
        =================================================== */}

        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-90">
            <ParticleWave />
          </div>

          {/* Dark readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/65 to-slate-950/90" />

          {/* Animated glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]"
          />
        </div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            Loading candidate profile...
          </p>
        </motion.div>
      </main>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!candidate) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-6 text-white">
        {/* ===================================================
            PARTICLE WAVE
        =================================================== */}

        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-90">
            <ParticleWave />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/65 to-slate-950/90" />

          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -20, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[140px]"
          />

          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[140px]"
          />
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/55 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-2xl"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <UserRound className="h-8 w-8 text-slate-400" />
          </div>

          <h1 className="mt-5 text-2xl font-black tracking-tight text-white">
            Candidate not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            We couldn&apos;t find the candidate profile
            you&apos;re looking for.
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-6 h-11 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/candidates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to candidates
            </Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  /* =========================================================
     DATA
  ========================================================= */

  const name = getName(candidate);
  const title = getTitle(candidate);
  const location = getLocation(candidate);
  const experience = getExperience(candidate);
  const skills = getSkills(candidate);
  const score = getScore(match);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-white">
      {/* =====================================================
          PARTICLE WAVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Wave */}
        <div className="absolute inset-40 z-20 opacity-110">
          <ParticleWave />
        </div>

        {/* Main readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/65 to-slate-950/95" />

        {/* Left animated glow */}
        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-48 top-24 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]"
        />

        {/* Right animated glow */}
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-48 top-[30%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]"
        />

        {/* Bottom glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-200px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[150px]"
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
        {/* ===================================================
            BACK BUTTON
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.45,
          }}
        >
          <Button
            asChild
            variant="ghost"
            className="mb-6 rounded-xl border border-transparent text-slate-300 transition-all hover:border-white/10 hover:bg-white/5 hover:text-white"
          >
            <Link href="/candidates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to candidates
            </Link>
          </Button>
        </motion.div>

        {/* ===================================================
            PROFILE HEADER
        =================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-2xl shadow-black/30 backdrop-blur-2xl"
        >
          {/* Header background */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/25 via-purple-600/10 to-transparent" />

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
            />

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/3 -top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"
            />
          </div>

          {/* Bottom gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/50 to-transparent" />

          <div className="relative px-6 pb-7 pt-8 sm:px-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              {/* =================================================
                  PROFILE INFORMATION
              ================================================= */}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                {/* Avatar */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.75,
                    rotate: -5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.55,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.04,
                    rotate: 1,
                  }}
                  className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-slate-950/80 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-slate-900 text-2xl font-black text-indigo-300 shadow-xl shadow-indigo-950/40"
                >
                  <motion.div
                    animate={{
                      opacity: [0.2, 0.45, 0.2],
                      scale: [0.9, 1.05, 0.9],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-xl"
                  />

                  <span className="relative z-10">
                    {initials}
                  </span>
                </motion.div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      {name}
                    </h1>

                    <motion.span
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.35,
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300"
                    >
                      <Sparkles className="h-3 w-3" />
                      Candidate
                    </motion.span>
                  </div>

                  <p className="mt-1.5 text-sm font-medium text-slate-300 sm:text-base">
                    {title}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                      {location}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-3.5 w-3.5 text-indigo-400" />
                      {experience}{" "}
                      {experience === 1
                        ? "year"
                        : "years"}{" "}
                      experience
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.25,
                  duration: 0.5,
                }}
                className="flex flex-wrap gap-2"
              >
                <Button
                  asChild
                  className="h-10 rounded-xl border border-indigo-400/20 bg-indigo-600 px-4 text-white shadow-lg shadow-indigo-950/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-900/40"
                >
                  <Link
                    href={`/recruiter/messages?candidateId=${encodeURIComponent(
                      candidateId,
                    )}`}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Link>
                </Button>

                {candidate.email && (
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-xl border-white/10 bg-white/5 px-4 text-slate-200 backdrop-blur-xl hover:bg-white/10 hover:text-white"
                  >
                    <a
                      href={`mailto:${candidate.email}`}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                )}

                {candidate.resumeUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-xl border-white/10 bg-white/5 px-4 text-slate-200 backdrop-blur-xl hover:bg-white/10 hover:text-white"
                  >
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Resume
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="space-y-6">
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
                delay: 0.15,
                duration: 0.5,
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/45 p-6 shadow-xl shadow-black/20 backdrop-blur-2xl transition-all duration-300 hover:border-indigo-400/15 hover:bg-slate-950/50 sm:p-7"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                  <UserRound className="h-5 w-5 text-indigo-400" />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    About Candidate
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Professional background
                  </p>
                </div>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-300">
                {candidate.bio ??
                  candidate.candidateProfile?.bio ??
                  "No candidate summary is available."}
              </p>
            </motion.section>

            {/* =================================================
                SKILLS
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
                delay: 0.22,
                duration: 0.5,
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/45 p-6 shadow-xl shadow-black/20 backdrop-blur-2xl transition-all duration-300 hover:border-purple-400/15 hover:bg-slate-950/50 sm:p-7"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Skills
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Technical capabilities
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          0.25 + index * 0.035,
                        duration: 0.3,
                      }}
                      whileHover={{
                        y: -2,
                        scale: 1.03,
                      }}
                      className="cursor-default rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-indigo-200"
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills listed.
                  </p>
                )}
              </div>
            </motion.section>

            {/* =================================================
                AI SUMMARY
            ================================================= */}

            {summary && (
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
                  duration: 0.5,
                }}
                className="relative overflow-hidden rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.06] p-6 shadow-xl shadow-indigo-950/20 backdrop-blur-xl sm:p-7"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.3, 0.15],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"
                />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                    </div>

                    <div>
                      <h2 className="font-bold text-white">
                        AI Candidate Analysis
                      </h2>

                      <p className="mt-0.5 text-xs text-indigo-300/70">
                        Intelligent candidate insights
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-300">
                    {summary.summary ??
                      summary.explanation ??
                      "No AI summary available."}
                  </p>
                </div>
              </motion.section>
            )}

            {/* =================================================
                SKILL GAP
            ================================================= */}

            {skillGap && (
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
                  duration: 0.5,
                }}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-6 shadow-xl shadow-black/20 backdrop-blur-2xl sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                    <Target className="h-5 w-5 text-purple-400" />
                  </div>

                  <div>
                    <h2 className="font-bold text-white">
                      Skill Gap Analysis
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Match strengths and missing skills
                    </p>
                  </div>
                </div>

                {/* Missing skills */}
                {skillGap.missingSkills &&
                  skillGap.missingSkills.length >
                    0 && (
                    <div className="mt-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Missing skills
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {skillGap.missingSkills.map(
                          (skill) => (
                            <motion.span
                              key={skill}
                              initial={{
                                opacity: 0,
                                scale: 0.9,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              className="rounded-lg border border-red-400/10 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-300"
                            >
                              {skill}
                            </motion.span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Matched skills */}
                {skillGap.matchedSkills &&
                  skillGap.matchedSkills.length >
                    0 && (
                    <div className="mt-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Matched skills
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {skillGap.matchedSkills.map(
                          (skill) => (
                            <motion.span
                              key={skill}
                              initial={{
                                opacity: 0,
                                scale: 0.9,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              {skill}
                            </motion.span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </motion.section>
            )}
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {/* =================================================
                AI MATCH
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.55,
              }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl"
            >
              {/* Animated glow */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.1, 0.25, 0.1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                    </div>

                    <div>
                      <h2 className="font-bold text-white">
                        AI Match
                      </h2>

                      <p className="text-[11px] text-slate-500">
                        Candidate compatibility
                      </p>
                    </div>
                  </div>

                  {score !== null && (
                    <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-1 text-[10px] font-bold text-indigo-300">
                      AI
                    </span>
                  )}
                </div>

                {/* Score */}
                <div className="mt-7 text-center">
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.75,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.4,
                      duration: 0.6,
                    }}
                    className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/[0.04]"
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-2 rounded-full border-4 border-indigo-500/10 border-t-indigo-400/50"
                    />

                    <div className="absolute inset-4 rounded-full border border-purple-500/10" />

                    <div className="relative">
                      <p className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-4xl font-black text-transparent">
                        {score !== null
                          ? `${score}%`
                          : "—"}
                      </p>

                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                        Match score
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {experience}{" "}
                      {experience === 1
                        ? "year"
                        : "years"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Skills
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {skills.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* =================================================
                RECRUITER ACTIONS
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.55,
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Recruiter Actions
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    Manage this candidate
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2.5">
                <Button className="h-11 w-full rounded-xl border border-indigo-400/20 bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-900/40">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Shortlist Candidate
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full rounded-xl border-white/10 bg-white/5 font-semibold text-slate-200 backdrop-blur-xl hover:bg-white/10 hover:text-white"
                >
                  <Link
                    href={`/recruiter/messages?candidateId=${encodeURIComponent(
                      candidateId,
                    )}`}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Conversation
                  </Link>
                </Button>
              </div>
            </motion.section>
          </aside>
        </div>
      </div>
    </main>
  );
}