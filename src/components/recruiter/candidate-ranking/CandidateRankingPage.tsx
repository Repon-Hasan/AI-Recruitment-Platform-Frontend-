"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

import RankingSkeleton from "./RankingSkeleton";
import RankingStats from "./RankingStats";
import CandidateFilters from "./CandidateFilters";
import CandidateCard from "./CandidateCard";

import {
  candidateRankingApi,
  type RankedCandidate,
} from "@/services/candidate-ranking.api";

interface CandidateRankingPageProps {
  jobId?: string;
}

type SortOption = "score" | "experience" | "recent";

export default function CandidateRankingPage({
  jobId: propJobId,
}: CandidateRankingPageProps) {
  const jobId = propJobId ?? "";

  // =========================================================
  // State
  // =========================================================

  const [applicants, setApplicants] = useState<RankedCandidate[]>(
    [],
  );

  const [rankedCandidates, setRankedCandidates] = useState<
    RankedCandidate[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);

  const [sortBy, setSortBy] =
    useState<SortOption>("score");

  const [showFilters, setShowFilters] = useState(false);

  // =========================================================
  // Load Applicants
  // =========================================================

  const loadApplicants = useCallback(async () => {
    if (!jobId) {
      setError("Job ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response =
        await candidateRankingApi.getApplicants(jobId);

      console.log(
        "✅ Candidate ranking response:",
        response,
      );

      setApplicants(response.data);

      // Important:
      // GET applicants should NOT automatically mean ranked.
      // Ranking happens only after clicking "Rank with AI".
      setRankedCandidates([]);
    } catch (err) {
      console.error(
        "❌ Failed to load applicants:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load applicants.",
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  // =========================================================
  // Initial Load
  // =========================================================

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void loadApplicants();
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [loadApplicants]);

  // =========================================================
  // AI Ranking
  // =========================================================

  const handleRankCandidates = async () => {
    if (!jobId) {
      setError("Job ID is missing.");
      return;
    }

    if (applicants.length === 0) {
      setError("There are no applicants to rank.");
      return;
    }

    try {
      setRanking(true);
      setError(null);

      console.log(
        "🤖 Starting AI candidate ranking...",
      );

      const response =
        await candidateRankingApi.rankApplicants(jobId);

      console.log(
        "🤖 AI ranking response:",
        response,
      );

      console.log(
        "👥 Ranked candidates:",
        response.data,
      );

      /*
       * IMPORTANT
       * -------------------------------------------------------
       * The backend now returns complete candidate information:
       *
       * {
       *   applicationId,
       *   candidateId,
       *   id,
       *   name,
       *   email,
       *   profileImage,
       *   phone,
       *   location,
       *   experience,
       *   skills,
       *   appliedAt,
       *   resume,
       *   education,
       *   linkedin,
       *   github,
       *   portfolio,
       *   score,
       *   matchScore,
       *   matchPercentage,
       *   breakdown,
       *   strengths,
       *   weaknesses,
       *   explanation
       * }
       *
       * Therefore DO NOT merge with applicants here.
       *
       * The previous code:
       *
       * {
       *   ...originalCandidate,
       *   ...rankedCandidate,
       * }
       *
       * could allow "Unknown Candidate" or empty fields from
       * the API mapper to overwrite the correct candidate data.
       */

      setRankedCandidates(response.data);
    } catch (err) {
      console.error(
        "❌ Failed to rank candidates:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to rank candidates.",
      );
    } finally {
      setRanking(false);
    }
  };

  // =========================================================
  // Ranking State
  // =========================================================

  const ranked = rankedCandidates.length > 0;

  const sourceCandidates = ranked
    ? rankedCandidates
    : applicants;

  // =========================================================
  // Filter / Search / Sort
  // =========================================================

  const candidates = useMemo(() => {
    const query = search.toLowerCase().trim();

    const filtered = sourceCandidates.filter(
      (candidate) => {
        const candidateName =
          candidate.name?.toLowerCase() ?? "";

        const candidateEmail =
          candidate.email?.toLowerCase() ?? "";

        const candidateLocation =
          candidate.location?.toLowerCase() ?? "";

        const matchesSearch =
          !query ||
          candidateName.includes(query) ||
          candidateEmail.includes(query) ||
          candidateLocation.includes(query) ||
          candidate.skills.some((skill) =>
            skill.toLowerCase().includes(query),
          );

        const score = Number(
          candidate.matchScore ??
            candidate.score ??
            0,
        );

        const matchesScore = score >= minScore;

        return (
          matchesSearch &&
          matchesScore
        );
      },
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "score") {
        return (
          Number(
            b.matchScore ??
              b.score ??
              0,
          ) -
          Number(
            a.matchScore ??
              a.score ??
              0,
          )
        );
      }

      if (sortBy === "experience") {
        return (
          Number(b.experience ?? 0) -
          Number(a.experience ?? 0)
        );
      }

      return (
        new Date(
          b.appliedAt ?? 0,
        ).getTime() -
        new Date(
          a.appliedAt ?? 0,
        ).getTime()
      );
    });
  }, [
    sourceCandidates,
    search,
    minScore,
    sortBy,
  ]);

  // =========================================================
  // Statistics
  // =========================================================

  const topScore = useMemo(() => {
    if (
      !ranked ||
      rankedCandidates.length === 0
    ) {
      return 0;
    }

    return Math.max(
      ...rankedCandidates.map(
        (candidate) =>
          Number(
            candidate.matchScore ??
              candidate.score ??
              0,
          ),
      ),
    );
  }, [
    ranked,
    rankedCandidates,
  ]);

  const averageScore = useMemo(() => {
    if (
      !ranked ||
      rankedCandidates.length === 0
    ) {
      return 0;
    }

    const total =
      rankedCandidates.reduce(
        (sum, candidate) =>
          sum +
          Number(
            candidate.matchScore ??
              candidate.score ??
              0,
          ),
        0,
      );

    return Math.round(
      total / rankedCandidates.length,
    );
  }, [
    ranked,
    rankedCandidates,
  ]);

  // =========================================================
  // Render
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-indigo-300/20
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -right-40
            top-20
            h-[550px]
            w-[550px]
            rounded-full
            bg-violet-300/20
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[-200px]
            left-1/3
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-300/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]
            bg-[size:40px_40px]
            opacity-30
          "
        />
      </div>

      {/* Content */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}

        <motion.header
          initial={{
            opacity: 0,
            y: -25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
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
                  delay: 0.15,
                }}
                className="
                  mb-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-indigo-200
                  bg-white/80
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-indigo-600
                  shadow-sm
                  backdrop-blur
                "
              >
                <Sparkles className="h-3.5 w-3.5" />

                AI-Powered Recruitment
              </motion.div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Rank Candidates
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Analyze applicants with AI,
                compare job compatibility,
                and identify the strongest
                candidates for your position.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/recruiter/dashboard"
                className="group inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
              >
                <Plus className="mr-2 h-4 w-4 rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                Back to Dashboard
              </a>
              {/* Filters */}

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (value) => !value,
                  )
                }
                className="
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:border-indigo-200
                  hover:bg-indigo-50
                "
              >
                <Filter className="h-4 w-4" />

                Filters
              </button>

              {/* Refresh */}

              <button
                type="button"
                onClick={() =>
                  void loadApplicants()
                }
                disabled={loading}
                className="
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  className={
                    loading
                      ? "h-4 w-4 animate-spin"
                      : "h-4 w-4"
                  }
                />

                Refresh
              </button>

              {/* AI Ranking */}

              <motion.button
                type="button"
                onClick={
                  handleRankCandidates
                }
                disabled={
                  ranking ||
                  loading ||
                  applicants.length === 0
                }
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  group
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  bg-slate-950
                  px-5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-indigo-500/20
                  transition-all
                  hover:bg-indigo-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {ranking ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />

                    AI is analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4 transition-transform group-hover:scale-110" />

                    Rank with AI
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Error */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="
                mb-6
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
                text-red-700
                shadow-sm
              "
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">
                  Something went wrong
                </p>

                <p className="mt-1 break-words text-xs">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setError(null)
                }
                className="rounded-lg p-1 transition hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}

        <RankingStats
          totalApplicants={
            applicants.length
          }
          ranked={ranked}
          topScore={topScore}
          averageScore={averageScore}
        />

        {/* Filters */}

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              className="overflow-hidden"
            >
              <CandidateFilters
                search={search}
                setSearch={setSearch}
                minScore={minScore}
                setMinScore={setMinScore}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="mb-6 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search candidates, skills, email, or location..."
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white/90
                pl-11
                pr-4
                text-sm
                text-slate-900
                shadow-sm
                outline-none
                transition-all
                placeholder:text-slate-400
                focus:border-indigo-400
                focus:ring-4
                focus:ring-indigo-100
              "
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
            <Users className="mr-2 h-4 w-4 text-slate-400" />

            <span className="text-sm font-bold text-slate-700">
              {candidates.length}
            </span>

            <span className="ml-1 text-sm text-slate-400">
              candidates
            </span>
          </div>
        </motion.div>

        {/* Candidates */}

        {loading ? (
          <RankingSkeleton />
        ) : candidates.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-12
              text-center
              shadow-sm
            "
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Users className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              No candidates found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are no applicants
              matching your current
              filters.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Ranked Banner */}

            {ranked && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-4
                  py-3
                "
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    AI ranking completed
                  </p>

                  <p className="text-xs text-emerald-600">
                    Candidates are ordered
                    by their estimated job
                    match.
                  </p>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {candidates.map(
                (candidate, index) => (
                  <motion.div
                    key={
                      candidate.applicationId ??
                      candidate.candidateId ??
                      candidate.id
                    }
                    layout
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                    }}
                    transition={{
                      duration: 0.3,
                      delay:
                        index * 0.04,
                    }}
                  >
                    <CandidateCard
                      candidate={candidate}
                      rank={
                        ranked
                          ? index + 1
                          : undefined
                      }
                      index={index}
                      ranked={ranked}
                    />
                  </motion.div>
                ),
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}