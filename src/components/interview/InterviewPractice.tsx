
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  Award,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Loader2,
  MessageSquare,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

/* =========================================================
   TYPES
========================================================= */

type ExperienceLevel = "JUNIOR" | "MID" | "SENIOR";

type InterviewType =
  | "TECHNICAL"
  | "BEHAVIORAL"
  | "SYSTEM_DESIGN"
  | "MIXED";

interface Job {
  id: string;
  title: string;
  company?: {
    name?: string;
  } | null;
  location?: string | null;
}

interface Application {
  id: string;
  candidateProfileId: string;
  jobId: string;
  coverLetter?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;

  /*
   * Your backend may already return job.
   * Keeping it optional prevents TypeScript errors
   * if some applications don't contain it.
   */
  job?: Job | null;
}

interface ApplicationsResponse {
  success: boolean;
  message: string;
  data?: Application[];
}

interface InterviewQuestion {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  expectedAnswer?: string;
  evaluationPoints?: string[];
  followUpQuestions?: string[];
}

interface StartInterviewResponse {
  success: boolean;
  message: string;
  data?: {
    sessionId: string;
    questionNumber: number;
    question: InterviewQuestion;
  };
}

interface Evaluation {
  technicalAccuracy: number;
  communication: number;
  confidence: number;
  completeness: number;
  overall: number;
  feedback: string;
}

interface AnswerResponse {
  success: boolean;
  message: string;
  data?: {
    evaluation: Evaluation;
    nextQuestion: InterviewQuestion;
  };
}

interface GeneratedQuestions {
  technical: InterviewQuestion[];
  behavioral: InterviewQuestion[];
  systemDesign: InterviewQuestion[];
  project: InterviewQuestion[];
  followUp: InterviewQuestion[];
  scenarioBased: InterviewQuestion[];
  problemSolving: InterviewQuestion[];
  hrAndCulture: InterviewQuestion[];
  roleSpecific: InterviewQuestion[];
  advancedChallenge: InterviewQuestion[];
}

interface QuestionBankResponse {
  success: boolean;
  message: string;
  data?: {
    job: {
      id: string;
      title: string;
      company: string;
    };
    candidate: {
      experienceLevel: string;
    };
    interview: {
      type: string;
    };
    totalQuestions: number;
    questions: GeneratedQuestions;
  };
}

/* =========================================================
   OPTIONS
========================================================= */

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "JUNIOR",
    label: "Junior",
    description: "Fundamentals, projects & practical skills",
  },
  {
    value: "MID",
    label: "Mid Level",
    description: "Production experience & architecture",
  },
  {
    value: "SENIOR",
    label: "Senior",
    description: "System design & technical decisions",
  },
];

const INTERVIEW_TYPES: {
  value: InterviewType;
  label: string;
  description: string;
  icon: typeof Code2;
}[] = [
  {
    value: "TECHNICAL",
    label: "Technical",
    description: "Programming, APIs, databases & engineering",
    icon: Code2,
  },
  {
    value: "BEHAVIORAL",
    label: "Behavioral",
    description: "Communication, teamwork & situations",
    icon: Users,
  },
  {
    value: "SYSTEM_DESIGN",
    label: "System Design",
    description: "Architecture, scalability & reliability",
    icon: Target,
  },
  {
    value: "MIXED",
    label: "Mixed",
    description: "A balanced interview experience",
    icon: Sparkles,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getDifficultyClass(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "medium":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    case "hard":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function getStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "ACCEPTED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "SHORTLISTED":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";

    case "INTERVIEW":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";

    case "REVIEWING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    case "REJECTED":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    case "WITHDRAWN":
      return "border-slate-500/20 bg-slate-500/10 text-slate-400";

    default:
      return "border-white/10 bg-white/5 text-slate-400";
  }
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* =========================================================
   SCORE BAR
========================================================= */

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}</span>

        <span className="font-semibold text-white">
          {safeValue}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-700"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Brain;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <Icon className="h-5 w-5 text-violet-400" />
        </div>

        <Zap className="h-4 w-4 text-cyan-400" />
      </div>

      <p className="text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-300">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function InterviewPractice() {
  /* -------------------------------------------------------
     APPLICATIONS
  ------------------------------------------------------- */

  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string>("");

  const [applicationDropdownOpen, setApplicationDropdownOpen] =
    useState(false);

  /* -------------------------------------------------------
     INTERVIEW CONFIG
  ------------------------------------------------------- */

  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("JUNIOR");

  const [interviewType, setInterviewType] =
    useState<InterviewType>("TECHNICAL");

  /* -------------------------------------------------------
     INTERVIEW SESSION
  ------------------------------------------------------- */

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [question, setQuestion] =
    useState<InterviewQuestion | null>(null);

  const [questionNumber, setQuestionNumber] =
    useState<number>(0);

  const [answer, setAnswer] = useState("");

  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);

  /* -------------------------------------------------------
     QUESTION BANK
  ------------------------------------------------------- */

  const [questionBank, setQuestionBank] =
    useState<QuestionBankResponse["data"] | null>(null);

  const [showQuestionBank, setShowQuestionBank] =
    useState(false);

  const [activeBankCategory, setActiveBankCategory] =
    useState("technical");

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  const [loadingStart, setLoadingStart] =
    useState(false);

  const [loadingAnswer, setLoadingAnswer] =
    useState(false);

  const [loadingQuestions, setLoadingQuestions] =
    useState(false);

  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  const [error, setError] = useState("");

  /* =========================================================
     SELECTED APPLICATION
  ========================================================= */

  const selectedApplication = useMemo(() => {
    return applications.find(
      (application) =>
        application.id === selectedApplicationId
    );
  }, [applications, selectedApplicationId]);

  const selectedJobId =
    selectedApplication?.jobId ?? "";

  const selectedJob =
    selectedApplication?.job ?? null;

  const selectedJobTitle =
    selectedJob?.title || "Selected job";

  const selectedCompany =
    selectedJob?.company?.name || "Company";

  /* =========================================================
     LOAD APPLICATIONS
  ========================================================= */

  const loadApplications = useCallback(async () => {
    setApplicationsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/candidate/my/application`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result: ApplicationsResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load your applications."
        );
      }

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setApplications(data);

      if (data.length > 0) {
        setSelectedApplicationId(
          (previous) => previous || data[0].id
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your applications."
      );
    } finally {
      setApplicationsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  /* =========================================================
     START INTERVIEW
  ========================================================= */

  const startInterview = useCallback(async () => {
    if (!selectedJobId) {
      setError(
        "Please select a job application first."
      );
      return;
    }

    setLoadingStart(true);
    setError("");
    setEvaluation(null);
    setAnswer("");
    setQuestion(null);
    setSessionId(null);
    setQuestionNumber(0);

    try {
      const response = await fetch(
        `${API_BASE_URL}/interviewPractices/practice/start`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: selectedJobId,
            experienceLevel,
            interviewType,
          }),
        }
      );

      const result: StartInterviewResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to start interview."
        );
      }

      setSessionId(result.data.sessionId);
      setQuestion(result.data.question);
      setQuestionNumber(result.data.questionNumber);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start interview."
      );
    } finally {
      setLoadingStart(false);
    }
  }, [
    selectedJobId,
    experienceLevel,
    interviewType,
  ]);

  /* =========================================================
     SUBMIT ANSWER
  ========================================================= */

  const submitAnswer = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (!sessionId) {
        setError(
          "Your interview session is not active."
        );
        return;
      }

      if (!answer.trim()) {
        setError(
          "Please write an answer before submitting."
        );
        return;
      }

      setLoadingAnswer(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/interviewPractices/practice/answer`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              answer: answer.trim(),
            }),
          }
        );

        const result: AnswerResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.message ||
              "Unable to evaluate your answer."
          );
        }

        setEvaluation(result.data.evaluation);

        if (result.data.nextQuestion) {
          setQuestion(
            result.data.nextQuestion
          );

          setQuestionNumber(
            (previous) => previous + 1
          );
        }

        setAnswer("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to evaluate your answer."
        );
      } finally {
        setLoadingAnswer(false);
      }
    },
    [sessionId, answer]
  );

  /* =========================================================
     GENERATE QUESTION BANK
  ========================================================= */

  const generateQuestionBank = useCallback(async () => {
    if (!selectedJobId) {
      setError(
        "Please select a job application first."
      );
      return;
    }

    setLoadingQuestions(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/interview/questions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: selectedJobId,
            experienceLevel,
            interviewType,
          }),
        }
      );

      const result: QuestionBankResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to generate question bank."
        );
      }

      setQuestionBank(result.data);
      setShowQuestionBank(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate question bank."
      );
    } finally {
      setLoadingQuestions(false);
    }
  }, [
    selectedJobId,
    experienceLevel,
    interviewType,
  ]);

  /* =========================================================
     RESET
  ========================================================= */

  const resetInterview = useCallback(() => {
    setSessionId(null);
    setQuestion(null);
    setQuestionNumber(0);
    setAnswer("");
    setEvaluation(null);
    setError("");
  }, []);

  /* =========================================================
     ACTIVE INTERVIEW
  ========================================================= */

  const hasActiveInterview =
    Boolean(sessionId && question);

  /* =========================================================
     ACTIVE QUESTION BANK
  ========================================================= */

  const activeQuestions =
    questionBank?.questions
      ? questionBank.questions[
          activeBankCategory as keyof GeneratedQuestions
        ] ?? []
      : [];

  /* =========================================================
     SELECTED INTERVIEW TYPE
  ========================================================= */

  const selectedInterviewType = useMemo(
    () =>
      INTERVIEW_TYPES.find(
        (item) => item.value === interviewType
      ),
    [interviewType]
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute right-0 top-[40%] h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[120px]" />

        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI Interview Practice
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Practice like you're in a{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                real interview
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Practice with AI-generated interview
              questions and receive instant feedback on
              your technical accuracy, communication,
              confidence and completeness.
            </p>
          </div>

          {hasActiveInterview && (
            <button
              type="button"
              onClick={resetInterview}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              End Practice
            </button>
          )}
        </header>

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Brain}
            label="AI Questions"
            value="55"
            description="Generated for your role"
          />

          <StatCard
            icon={Target}
            label="Evaluation Areas"
            value="4"
            description="Core interview metrics"
          />

          <StatCard
            icon={MessageSquare}
            label="Real-time Feedback"
            value="AI"
            description="After every answer"
          />

          <StatCard
            icon={Trophy}
            label="Practice Mode"
            value="Live"
            description="One question at a time"
          />
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-300/80">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs text-red-300/70 hover:text-red-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {!hasActiveInterview ? (
          <>
            {/* =================================================
                CONFIGURATION
            ================================================== */}

            <section className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
              {/* LEFT */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-6">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                    <Brain className="h-5 w-5 text-violet-400" />
                  </div>

                  <h2 className="text-xl font-bold">
                    Configure your interview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select one of your applications and
                    choose your interview preferences.
                  </p>
                </div>

                {/* ==========================================
                    APPLICATION SELECTOR
                =========================================== */}

                <div className="mb-7">
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Select a job
                  </label>

                  {applicationsLoading ? (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-violet-400" />

                      <span className="text-sm text-slate-500">
                        Loading your applications...
                      </span>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />

                        <div>
                          <p className="text-sm font-semibold text-amber-300">
                            No applications found
                          </p>

                          <p className="mt-1 text-xs leading-5 text-amber-300/60">
                            Apply to a job first before
                            starting an AI interview.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setApplicationDropdownOpen(
                            (previous) => !previous
                          )
                        }
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-violet-500/30 hover:bg-white/[0.03]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                            <BriefcaseBusiness className="h-5 w-5 text-violet-400" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {selectedJobTitle}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {selectedCompany}
                            </p>
                          </div>
                        </div>

                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                            applicationDropdownOpen
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {applicationDropdownOpen && (
                        <div className="absolute z-30 mt-2 max-h-[360px] w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1020] p-2 shadow-2xl">
                          {applications.map(
                            (application) => {
                              const job =
                                application.job;

                              const isSelected =
                                application.id ===
                                selectedApplicationId;

                              return (
                                <button
                                  key={application.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedApplicationId(
                                      application.id
                                    );

                                    setApplicationDropdownOpen(
                                      false
                                    );

                                    setQuestionBank(null);
                                    setShowQuestionBank(
                                      false
                                    );
                                  }}
                                  className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition last:mb-0 ${
                                    isSelected
                                      ? "bg-violet-500/10"
                                      : "hover:bg-white/5"
                                  }`}
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-200">
                                      {job?.title ||
                                        "Job application"}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-slate-500">
                                      {job?.company
                                        ?.name ||
                                        "Company"}
                                    </p>
                                  </div>

                                  <span
                                    className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${getStatusClass(
                                      application.status
                                    )}`}
                                  >
                                    {formatStatus(
                                      application.status
                                    )}
                                  </span>

                                  {isSelected && (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected application details */}

                  {selectedApplication && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClass(
                          selectedApplication.status
                        )}`}
                      >
                        {formatStatus(
                          selectedApplication.status
                        )}
                      </span>

                      {selectedJob?.location && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                          {selectedJob.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* ==========================================
                    EXPERIENCE
                =========================================== */}

                <div className="mb-7">
                  <p className="mb-3 text-sm font-semibold text-slate-200">
                    Experience level
                  </p>

                  <div className="grid gap-2">
                    {EXPERIENCE_OPTIONS.map(
                      (option) => {
                        const active =
                          experienceLevel ===
                          option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setExperienceLevel(
                                option.value
                              )
                            }
                            className={`group flex items-center justify-between rounded-xl border p-3 text-left transition ${
                              active
                                ? "border-violet-500/40 bg-violet-500/10"
                                : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.03]"
                            }`}
                          >
                            <div>
                              <p
                                className={`text-sm font-semibold ${
                                  active
                                    ? "text-violet-300"
                                    : "text-slate-200"
                                }`}
                              >
                                {option.label}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {option.description}
                              </p>
                            </div>

                            {active && (
                              <CheckCircle2 className="h-5 w-5 text-violet-400" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* ==========================================
                    INTERVIEW TYPE
                =========================================== */}

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-200">
                    Interview type
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {INTERVIEW_TYPES.map(
                      (option) => {
                        const active =
                          interviewType ===
                          option.value;

                        const Icon = option.icon;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setInterviewType(
                                option.value
                              )
                            }
                            className={`rounded-xl border p-3 text-left transition ${
                              active
                                ? "border-cyan-500/30 bg-cyan-500/10"
                                : "border-white/10 bg-black/10 hover:border-white/20"
                            }`}
                          >
                            <Icon
                              className={`mb-2 h-5 w-5 ${
                                active
                                  ? "text-cyan-400"
                                  : "text-slate-500"
                              }`}
                            />

                            <p className="text-sm font-semibold text-slate-200">
                              {option.label}
                            </p>

                            <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                              {option.description}
                            </p>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* =================================================
                  RIGHT START CARD
              ================================================== */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/[0.09] via-white/[0.035] to-cyan-500/[0.05] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                        <Sparkles className="h-6 w-6 text-violet-400" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                          AI Powered
                        </p>

                        <h2 className="text-xl font-bold">
                          Mock Interview
                        </h2>
                      </div>
                    </div>

                    {/* Selected job */}
                    {selectedApplication && (
                      <div className="mb-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          Practicing for
                        </p>

                        <p className="mt-2 text-lg font-bold text-white">
                          {selectedJobTitle}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {selectedCompany}
                        </p>

                        <div className="mt-3">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClass(
                              selectedApplication.status
                            )}`}
                          >
                            {formatStatus(
                              selectedApplication.status
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          icon: Brain,
                          title: "Adaptive questions",
                          text: "Questions are generated for your selected role.",
                        },
                        {
                          icon: Target,
                          title: "Detailed scoring",
                          text: "Get scores across four important areas.",
                        },
                        {
                          icon: MessageSquare,
                          title: "Instant feedback",
                          text: "Understand what you did well and what to improve.",
                        },
                        {
                          icon: Trophy,
                          title: "Interview confidence",
                          text: "Practice until you feel ready.",
                        },
                      ].map((feature) => {
                        const Icon = feature.icon;

                        return (
                          <div
                            key={feature.title}
                            className="rounded-2xl border border-white/10 bg-black/10 p-4"
                          >
                            <Icon className="mb-3 h-5 w-5 text-cyan-400" />

                            <p className="text-sm font-semibold text-slate-200">
                              {feature.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {feature.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Selected interview
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {selectedInterviewType?.label}
                        </p>
                      </div>

                      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                        {experienceLevel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={startInterview}
                      disabled={
                        loadingStart ||
                        applicationsLoading ||
                        !selectedApplication
                      }
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loadingStart ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Starting interview...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 fill-current" />
                          Start AI Interview
                          <ArrowIcon />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={generateQuestionBank}
                      disabled={
                        loadingQuestions ||
                        applicationsLoading ||
                        !selectedApplication
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loadingQuestions ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating 55 questions...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4" />
                          Generate Question Bank
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                QUESTION BANK
            ================================================== */}

            {showQuestionBank && questionBank && (
              <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                        <Brain className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold">
                          AI Question Bank
                        </h2>

                        <p className="text-sm text-slate-500">
                          {questionBank.job.title} ·{" "}
                          {questionBank.job.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                    {questionBank.totalQuestions} Questions
                  </span>
                </div>

                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {Object.entries(
                    questionBank.questions
                  ).map(([key, questions]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setActiveBankCategory(key)
                      }
                      className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        activeBankCategory === key
                          ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                          : "border-white/10 bg-white/[0.02] text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {key
                        .replace(
                          /([A-Z])/g,
                          " $1"
                        )
                        .replace(
                          /^./,
                          (char) =>
                            char.toUpperCase()
                        )}{" "}
                      ({questions.length})
                    </button>
                  ))}
                </div>

                <div className="grid gap-3">
                  {activeQuestions.map(
                    (item, index) => (
                      <div
                        key={`${activeBankCategory}-${index}`}
                        className="rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-white/20"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-300">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2 py-1 text-[10px] font-bold ${getDifficultyClass(
                                  item.difficulty
                                )}`}
                              >
                                {item.difficulty}
                              </span>

                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-400">
                                {item.category}
                              </span>
                            </div>

                            <p className="text-sm font-medium leading-6 text-slate-200">
                              {item.question}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </>
        ) : (
          /* =====================================================
             ACTIVE INTERVIEW
          ====================================================== */

          <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* =================================================
                MAIN
            ================================================== */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              {/* Top */}
              <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                    <Brain className="h-5 w-5 text-violet-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                      Live Practice
                    </p>

                    <h2 className="text-lg font-bold">
                      AI Interview Session
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    Question {questionNumber}
                  </span>
                </div>
              </div>

              {/* Current job */}
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                <BriefcaseBusiness className="h-4 w-4 text-violet-400" />

                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedJobTitle}
                  </p>

                  <p className="text-xs text-slate-500">
                    {selectedCompany}
                  </p>
                </div>

                <span
                  className={`ml-auto rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClass(
                    selectedApplication?.status ||
                      ""
                  )}`}
                >
                  {formatStatus(
                    selectedApplication?.status ||
                      "APPLICATION"
                  )}
                </span>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {question?.difficulty && (
                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getDifficultyClass(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>
                  )}

                  {question?.category && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
                      {question.category}
                    </span>
                  )}
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.08] to-transparent p-6 sm:p-8">
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

                  <div className="relative">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-400">
                      Interviewer asks
                    </p>

                    <h3 className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                      {question?.question ||
                        "Preparing your next question..."}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Answer */}
              <form onSubmit={submitAnswer}>
                <div className="mb-3 flex items-center justify-between">
                  <label
                    htmlFor="answer"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Your answer
                  </label>

                  <span className="text-xs text-slate-600">
                    {answer.length} characters
                  </span>
                </div>

                <textarea
                  id="answer"
                  value={answer}
                  onChange={(event) =>
                    setAnswer(event.target.value)
                  }
                  placeholder="Explain your answer as if you're speaking directly to the interviewer..."
                  rows={9}
                  disabled={loadingAnswer}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-500/40 focus:ring-4 focus:ring-violet-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setAnswer("")}
                    disabled={
                      loadingAnswer || !answer
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    disabled={
                      loadingAnswer ||
                      !answer.trim()
                    }
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingAnswer ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        Submit Answer
                        <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Evaluation */}
              {evaluation && (
                <div className="mt-8 border-t border-white/10 pt-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Award className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                      <h3 className="font-bold text-white">
                        AI Evaluation
                      </h3>

                      <p className="text-xs text-slate-500">
                        Feedback from your latest answer
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/10 p-6">
                      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-violet-500/20">
                        <div className="text-center">
                          <p className="text-3xl font-black text-white">
                            {evaluation.overall}
                          </p>

                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Overall
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-500">
                        Score out of 100
                      </p>
                    </div>

                    <div className="space-y-5 rounded-2xl border border-white/10 bg-black/10 p-5">
                      <ScoreBar
                        label="Technical Accuracy"
                        value={
                          evaluation.technicalAccuracy
                        }
                      />

                      <ScoreBar
                        label="Communication"
                        value={
                          evaluation.communication
                        }
                      />

                      <ScoreBar
                        label="Confidence"
                        value={
                          evaluation.confidence
                        }
                      />

                      <ScoreBar
                        label="Completeness"
                        value={
                          evaluation.completeness
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.04] p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-cyan-400" />

                      <p className="text-sm font-semibold text-cyan-300">
                        AI Feedback
                      </p>
                    </div>

                    <p className="text-sm leading-7 text-slate-300">
                      {evaluation.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                SIDEBAR
            ================================================== */}

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                    <Target className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Session details
                    </h3>

                    <p className="text-xs text-slate-500">
                      Current configuration
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-black/10 px-3 py-3">
                    <span className="text-xs text-slate-500">
                      Experience
                    </span>

                    <span className="text-xs font-bold text-white">
                      {experienceLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/10 px-3 py-3">
                    <span className="text-xs text-slate-500">
                      Interview
                    </span>

                    <span className="text-xs font-bold text-white">
                      {interviewType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/10 px-3 py-3">
                    <span className="text-xs text-slate-500">
                      Question
                    </span>

                    <span className="text-xs font-bold text-violet-300">
                      #{questionNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Interview tips
                    </h3>

                    <p className="text-xs text-slate-500">
                      Improve your responses
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Explain your reasoning, not just the final answer.",
                    "Use concrete examples from your projects.",
                    "Mention trade-offs when discussing technical decisions.",
                    "Keep your answer structured and easy to follow.",
                  ].map((tip) => (
                    <div
                      key={tip}
                      className="flex gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                      <p className="text-xs leading-5 text-slate-400">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {question && (
                <div className="rounded-3xl border border-violet-500/10 bg-violet-500/[0.035] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Question category
                  </p>

                  <p className="mt-2 text-lg font-bold text-white">
                    {question.category}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Difficulty
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getDifficultyClass(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      Keep going
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      After you submit your answer, AI
                      evaluates it and prepares the next
                      question.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL ICON COMPONENT
   Avoids repeating inline ArrowRight JSX logic.
========================================================= */

function ArrowIcon() {
  return (
    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
  );
}

