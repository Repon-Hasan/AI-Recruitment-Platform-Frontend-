
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "motion/react";

import {
  AlertCircle,
  ArrowDownUp,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import CandidateCard from "./CandidateCard";
import CandidateFilters from "./CandidateFilters";
import AIAssistantPanel from "./AIAssistantPanel";

import {
  candidatesApi,
  type Candidate,
  type JobMatch,
  type RecruiterAssistantResponse,
} from "@/lib/api/candidates";

import ParticleWave from "@/components/ui/particle-wave";
import { Navbar } from "@/components/layout/navbar";

interface CandidatesPageProps {
  jobs?: Array<{
    id: string;
    title: string;
  }>;
}

type SortOption =
  | "match"
  | "name"
  | "experience";

/* ==========================================================
   HELPERS
========================================================== */

function getCandidateName(
  candidate: Candidate,
): string {
  return (
    candidate.name ??
    candidate.candidateProfile?.name ??
    candidate.user?.name ??
    "Unnamed Candidate"
  );
}

function getCandidateTitle(
  candidate: Candidate,
): string {
  return (
    candidate.title ??
    candidate.headline ??
    candidate.candidateProfile?.title ??
    candidate.candidateProfile?.headline ??
    ""
  );
}

function getCandidateLocation(
  candidate: Candidate,
): string {
  return (
    candidate.location ??
    candidate.candidateProfile?.location ??
    ""
  );
}

function getExperience(
  candidate: Candidate,
): number {
  return (
    candidate.experience ??
    candidate.yearsOfExperience ??
    candidate.candidateProfile?.experience ??
    candidate.candidateProfile?.yearsOfExperience ??
    0
  );
}

function getSkills(
  candidate: Candidate,
): string[] {
  const skills =
    candidate.skills ??
    candidate.candidateProfile?.skills ??
    [];

  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return skill;
      }

      return skill.name ?? "";
    })
    .filter(Boolean);
}

function getMatchCandidateId(
  match: JobMatch,
): string | undefined {
  return (
    match.candidateId ??
    match.candidateProfileId ??
    match.candidate?.id ??
    match.candidate?.candidateProfile?.id
  );
}

function getScore(
  match?: JobMatch,
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

function getCandidateId(
  candidate: Candidate,
): string | undefined {
  return (
    candidate.id ??
    candidate.candidateProfile?.id ??
    candidate.userId
  );
}

function normalizeSearch(
  value: string,
): string {
  return value.trim().toLowerCase();
}

/* ==========================================================
   PAGE
========================================================== */

export default function CandidatesPage({
  jobs = [],
}: CandidatesPageProps) {
  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [matches, setMatches] =
    useState<JobMatch[]>([]);

  const [selectedJobId, setSelectedJobId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [matchesLoading, setMatchesLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [skill, setSkill] =
    useState("");

  const [minExperience, setMinExperience] =
    useState("");

  const [minScore, setMinScore] =
    useState("");

  const [sort, setSort] =
    useState<SortOption>("match");

  const [showAssistant, setShowAssistant] =
    useState(false);

  /* ==========================================================
     LOAD CANDIDATES
  ========================================================== */

  const loadCandidates =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await candidatesApi.getAllCandidates();

        setCandidates(result);
      } catch (err) {
        console.error(
          "Failed to load candidates:",
          err,
        );

        setError(
          "Unable to load candidates. Please check your API and authentication.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCandidates();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadCandidates]);

  /* ==========================================================
     LOAD AI MATCHES WHEN JOB CHANGES
  ========================================================== */

  useEffect(() => {
    if (!selectedJobId) {
      return;
    }

    let cancelled = false;

    async function loadMatches() {
      try {
        setMatchesLoading(true);

        const result =
          await candidatesApi.getJobMatches(
            selectedJobId,
          );

        if (!cancelled) {
          setMatches(result);
        }
      } catch (err) {
        console.error(
          "Failed to load job matches:",
          err,
        );

        if (!cancelled) {
          setMatches([]);
        }
      } finally {
        if (!cancelled) {
          setMatchesLoading(false);
        }
      }
    }

    void loadMatches();

    return () => {
      cancelled = true;
    };
  }, [selectedJobId]);

  /* ==========================================================
     MATCH LOOKUP
  ========================================================== */

  const matchByCandidateId =
    useMemo(() => {
      const map = new Map<
        string,
        JobMatch
      >();

      if (!selectedJobId) {
        return map;
      }

      for (const match of matches) {
        const candidateId =
          getMatchCandidateId(match);

        if (candidateId) {
          map.set(candidateId, match);
        }
      }

      return map;
    }, [matches, selectedJobId]);

  /* ==========================================================
     FILTER + SORT
  ========================================================== */

  const filteredCandidates =
    useMemo(() => {
      const searchValue =
        normalizeSearch(search);

      const locationValue =
        normalizeSearch(location);

      const skillValue =
        normalizeSearch(skill);

      const experienceValue =
        minExperience
          ? Number(minExperience)
          : 0;

      const scoreValue =
        minScore ? Number(minScore) : 0;

      const result =
        candidates.filter(
          (candidate) => {
            const name =
              normalizeSearch(
                getCandidateName(
                  candidate,
                ),
              );

            const title =
              normalizeSearch(
                getCandidateTitle(
                  candidate,
                ),
              );

            const candidateLocation =
              normalizeSearch(
                getCandidateLocation(
                  candidate,
                ),
              );

            const candidateSkills =
              getSkills(candidate).map(
                normalizeSearch,
              );

            const experience =
              getExperience(candidate);

            const candidateId =
              getCandidateId(candidate);

            const match =
              candidateId
                ? matchByCandidateId.get(
                    candidateId,
                  )
                : undefined;

            const score =
              getScore(match) ?? 0;

            const searchableText =
              [
                name,
                title,
                candidateLocation,
                ...candidateSkills,
              ].join(" ");

            if (
              searchValue &&
              !searchableText.includes(
                searchValue,
              )
            ) {
              return false;
            }

            if (
              locationValue &&
              !candidateLocation.includes(
                locationValue,
              )
            ) {
              return false;
            }

            if (
              skillValue &&
              !candidateSkills.some(
                (candidateSkill) =>
                  candidateSkill.includes(
                    skillValue,
                  ),
              )
            ) {
              return false;
            }

            if (
              experienceValue > 0 &&
              experience < experienceValue
            ) {
              return false;
            }

            if (
              scoreValue > 0 &&
              score < scoreValue
            ) {
              return false;
            }

            return true;
          },
        );

      return result.sort(
        (a, b) => {
          const aId =
            getCandidateId(a);

          const bId =
            getCandidateId(b);

          const aMatch = aId
            ? matchByCandidateId.get(aId)
            : undefined;

          const bMatch = bId
            ? matchByCandidateId.get(bId)
            : undefined;

          if (sort === "name") {
            return getCandidateName(
              a,
            ).localeCompare(
              getCandidateName(b),
            );
          }

          if (sort === "experience") {
            return (
              getExperience(b) -
              getExperience(a)
            );
          }

          return (
            (getScore(bMatch) ?? -1) -
            (getScore(aMatch) ?? -1)
          );
        },
      );
    }, [
      candidates,
      search,
      location,
      skill,
      minExperience,
      minScore,
      sort,
      matchByCandidateId,
    ]);

  /* ==========================================================
     AI ASSISTANT RESULTS
  ========================================================== */

  function handleAssistantResults(
    response: RecruiterAssistantResponse,
  ) {
    const assistantMatches =
      response.matches ??
      response.results ??
      [];

    if (assistantMatches.length > 0) {
      setMatches(assistantMatches);
    }

    setSort("match");
  }

  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  function clearFilters() {
    setSearch("");
    setLocation("");
    setSkill("");
    setMinExperience("");
    setMinScore("");
  }

  /* ==========================================================
     STATS
  ========================================================== */

  const strongMatches = useMemo(() => {
    return matches.filter(
      (match) =>
        (getScore(match) ?? 0) >= 80,
    ).length;
  }, [matches]);

  const selectedJob =
    jobs.find(
      (job) => job.id === selectedJobId,
    );

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-transparent
        text-white
      "
    >
        
      
      {/* =====================================================
          PARTICLE BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          opacity-100
        "
      >
        <ParticleWave />
      </div>

      {/* =====================================================
          SUBTLE PAGE OVERLAY

          Keeps text readable without hiding ParticleWave.
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-slate-950/20
        "
      />
          {/* Navbar */}


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1600px]
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div
                className="
                  mb-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-indigo-400/25
                  bg-indigo-500/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-indigo-300
                  shadow-lg
                  shadow-indigo-950/20
                  backdrop-blur-md
                "
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Talent Discovery
              </div>

              <h1
                className="
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]
                  sm:text-4xl
                "
              >
                Find Top Talent
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-300
                  sm:text-base
                "
              >
                Discover qualified candidates,
                compare AI match scores, and find
                the right person for your next hire.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void loadCandidates()
              }
              disabled={loading}
              className="
                w-fit
                rounded-xl
                border-white/15
                bg-white/5
                text-slate-200
                shadow-lg
                shadow-black/10
                backdrop-blur-md
                transition-all
                hover:border-indigo-400/30
                hover:bg-white/10
                hover:text-white
              "
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* ===================================================
            JOB SELECTOR
        =================================================== */}

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
            delay: 0.05,
          }}
          className="
            mb-6
            rounded-2xl
            border
            border-white/10
            bg-slate-950/45
            p-5
            shadow-2xl
            shadow-black/20
            backdrop-blur-xl
          "
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-indigo-400/20
                  bg-indigo-500/10
                  text-indigo-300
                "
              >
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Find candidates for a job
                </p>

                <p className="text-xs text-slate-400">
                  Select a job to activate AI
                  matching.
                </p>
              </div>
            </div>

            <div className="relative flex-1 lg:max-w-xl">
              <select
                value={selectedJobId}
                onChange={(event) =>
                  setSelectedJobId(
                    event.target.value,
                  )
                }
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-white/10
                  bg-slate-900/80
                  px-4
                  pr-10
                  text-sm
                  font-medium
                  text-slate-200
                  outline-none
                  transition
                  hover:border-white/20
                  focus:border-indigo-400/40
                  focus:ring-2
                  focus:ring-indigo-500/20
                "
              >
                <option
                  value=""
                  className="bg-slate-900 text-slate-200"
                >
                  All candidates — select a job for AI
                  matching
                </option>

                {jobs.map((job) => (
                  <option
                    key={job.id}
                    value={job.id}
                    className="bg-slate-900 text-slate-200"
                  >
                    {job.title}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />
            </div>

            {selectedJobId && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-emerald-400/15
                  bg-emerald-500/10
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-emerald-300
                "
              >
                <CheckCircle2 className="h-4 w-4" />

                {matchesLoading
                  ? "Analyzing..."
                  : `${strongMatches} strong matches`}
              </div>
            )}
          </div>
        </motion.section>

        {/* ===================================================
            AI ASSISTANT
        =================================================== */}

        {selectedJobId && (
          <div className="mb-6">
            {showAssistant ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowAssistant(false)
                    }
                    className="
                      rounded-xl
                      text-slate-300
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    Hide AI Assistant
                  </Button>
                </div>

                <AIAssistantPanel
                  jobId={selectedJobId}
                  onResults={
                    handleAssistantResults
                  }
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setShowAssistant(true)
                }
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-indigo-400/15
                  bg-indigo-500/[0.06]
                  p-4
                  text-left
                  shadow-xl
                  shadow-indigo-950/10
                  backdrop-blur-xl
                  transition-all
                  hover:border-indigo-400/30
                  hover:bg-indigo-500/[0.10]
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-indigo-400/20
                    bg-indigo-500/10
                    text-indigo-300
                  "
                >
                  <Sparkles
                    className="
                      h-5
                      w-5
                      transition-transform
                      group-hover:scale-110
                    "
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-white">
                    Ask AI Recruiter Assistant
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    &quot;Show me the best 5 candidates
                    for this React developer position&quot;
                  </p>
                </div>

                <Search className="h-4 w-4 text-slate-400 transition-colors group-hover:text-indigo-300" />
              </button>
            )}
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-400/20
              bg-red-500/10
              p-4
              backdrop-blur-xl
            "
          >
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />

            <div>
              <p className="text-sm font-semibold text-red-200">
                Could not load candidates
              </p>

              <p className="mt-1 text-xs text-red-300/70">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* =================================================
              FILTERS
          ================================================= */}

          <CandidateFilters
            search={search}
            location={location}
            minExperience={
              minExperience
            }
            skill={skill}
            minScore={minScore}
            onSearchChange={setSearch}
            onLocationChange={
              setLocation
            }
            onExperienceChange={
              setMinExperience
            }
            onSkillChange={setSkill}
            onMinScoreChange={
              setMinScore
            }
            onClear={clearFilters}
          />

          {/* =================================================
              CANDIDATES
          ================================================= */}

          <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-300" />

                  <h2 className="text-lg font-bold text-white">
                    Candidates
                  </h2>

                  <span
                    className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      px-2
                      py-0.5
                      text-xs
                      font-semibold
                      text-slate-300
                    "
                  >
                    {filteredCandidates.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedJob
                    ? `Ranked for ${selectedJob.title}`
                    : "Browse all available candidates"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4 text-slate-400" />

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target
                        .value as SortOption,
                    )
                  }
                  className="
                    h-9
                    rounded-lg
                    border
                    border-white/10
                    bg-slate-900/80
                    px-3
                    text-xs
                    font-medium
                    text-slate-200
                    outline-none
                    transition
                    hover:border-white/20
                    focus:border-indigo-400/40
                    focus:ring-2
                    focus:ring-indigo-500/20
                  "
                >
                  <option
                    value="match"
                    className="bg-slate-900"
                  >
                    AI Match
                  </option>

                  <option
                    value="name"
                    className="bg-slate-900"
                  >
                    Name
                  </option>

                  <option
                    value="experience"
                    className="bg-slate-900"
                  >
                    Experience
                  </option>
                </select>
              </div>
            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-64
                      animate-pulse
                      rounded-2xl
                      border
                      border-white/10
                      bg-slate-900/40
                      backdrop-blur-xl
                    "
                  />
                ))}
              </div>
            ) : filteredCandidates.length ===
              0 ? (
              /* ===============================================
                 EMPTY STATE
              =============================================== */

              <div
                className="
                  flex
                  min-h-[420px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-white/15
                  bg-slate-950/40
                  px-6
                  text-center
                  shadow-xl
                  shadow-black/10
                  backdrop-blur-xl
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                  "
                >
                  <Search className="h-6 w-6 text-slate-400" />
                </div>

                <h3 className="mt-4 text-base font-bold text-white">
                  No candidates found
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-400">
                  Try changing your search or
                  filter criteria.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    clearFilters
                  }
                  className="
                    mt-5
                    rounded-xl
                    border-white/10
                    bg-white/5
                    text-slate-300
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              /* ===============================================
                 CANDIDATE GRID
              =============================================== */

              <div className="grid gap-4 xl:grid-cols-2">
                {filteredCandidates.map(
                  (
                    candidate,
                    index,
                  ) => {
                    const candidateId =
                      getCandidateId(
                        candidate,
                      );

                    const match =
                      candidateId
                        ? matchByCandidateId.get(
                            candidateId,
                          )
                        : undefined;

                    return (
                      <CandidateCard
                        key={
                          candidateId ??
                          `candidate-${index}`
                        }
                        candidate={
                          candidate
                        }
                        match={match}
                        index={index}
                      />
                    );
                  },
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

