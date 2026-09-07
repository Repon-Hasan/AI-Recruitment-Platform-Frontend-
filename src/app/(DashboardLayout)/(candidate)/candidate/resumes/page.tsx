"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

import {
  resumeApi,
  type Resume,
  type ResumeAnalysis,
} from "@/lib/api/resume.api";

import ParticleWave from "@/components/ui/particle-wave";
import { ResumeScoreCard } from "@/components/resume/resume-score-card";

/* ==========================================================================
   Types
   ========================================================================== */

interface JobMatch {
  jobId: string;
  title: string;
  company?: string | null;
  companyName?: string | null;
  location?: string | null;
  description?: string | null;
  employmentType?: string | null;
  remote?: boolean | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  matchScore: number;
  similarity?: number | null;
  matchedSkills?: string[];
  missingSkills?: string[];
  requiredSkills?: string[];
  experience?: string | null;
  createdAt?: string | null;
}

interface JobMatchResponse {
  success: boolean;
  message?: string;
  data: JobMatch[] | null;
}

/* ==========================================================================
   Page
   ========================================================================== */

export default function ResumePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* ==================================================================
          Background
      ================================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute right-0 top-[500px] h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* ==================================================================
          Hero
      ================================================================== */}

      <section className="relative border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Hero text */}

            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-medium text-primary">
                    Career Profile
                  </p>

                  <p className="text-xs text-muted-foreground">
                    AI-powered career tools
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Resume &{" "}
                <span className="text-primary">AI Analysis</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Manage your resumes, analyze your professional profile,
                improve your resume quality, and prepare it for intelligent
                job matching.
              </p>
            </div>

            {/* Feature cards */}

            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              <FeatureCard
                icon={Upload}
                title="Upload"
                description="Resume"
              />

              <FeatureCard
                icon={Sparkles}
                title="AI Analysis"
                description="Insights"
              />

              <FeatureCard
                icon={Brain}
                title="Smart Match"
                description="Jobs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          Main
      ================================================================== */}

      <section className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* ================================================================
              Resume Score
          ================================================================= */}

          <section>
            <SectionHeader
              title="Resume Overview"
              description="See how strong your resume is and identify areas for improvement."
              icon={Sparkles}
            />

            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <ResumeScoreCard />
            </div>
          </section>

          {/* ================================================================
              Resume Manager
          ================================================================= */}

          <section>
            <SectionHeader
              title="Manage Your Resumes"
              description="Upload, select, analyze, and prepare your resume for AI-powered recruitment."
              icon={FileText}
            />

            <ResumeManager />
          </section>

          {/* ================================================================
              Smart Job Matching
          ================================================================= */}

          <section>
            <SectionHeader
              title="Smart Job Matching"
              description="Use your resume profile to discover jobs that best match your skills and experience."
              icon={Brain}
            />

            <SmartJobMatching />
          </section>
        </div>
      </section>
    </main>
  );
}

/* ==========================================================================
   Resume Manager
   ========================================================================== */

function ResumeManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ========================================================================
     Helpers
  ======================================================================== */

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const getErrorMessage = useCallback(
    (error: unknown, fallback: string): string => {
      if (error instanceof Error && error.message) {
        return error.message;
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        const message = (error as { message?: unknown }).message;

        if (typeof message === "string" && message) {
          return message;
        }
      }

      return fallback;
    },
    [],
  );

  /* ========================================================================
     Load Resumes
  ======================================================================== */

  const loadResumes = useCallback(async (): Promise<Resume[]> => {
    try {
      setLoading(true);
      setError("");

      const response = await resumeApi.getMyResumes();

      const resumeList: Resume[] = Array.isArray(response.data)
        ? response.data
        : [];

      setResumes(resumeList);

      setSelectedResume((current) => {
        if (resumeList.length === 0) {
          return null;
        }

        if (!current) {
          return resumeList[0];
        }

        const updatedResume = resumeList.find(
          (resume) => resume.id === current.id,
        );

        return updatedResume ?? resumeList[0];
      });

      return resumeList;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to load resumes.",
      );

      setError(message);
      toast.error(message);

      return [];
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  /* ========================================================================
     Initial Load
  ======================================================================== */

  useEffect(() => {
    void loadResumes();
  }, [loadResumes]);

  /* ========================================================================
     Clear messages automatically
  ======================================================================== */

  useEffect(() => {
    if (!error && !success) {
      return;
    }

    const timer = window.setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [error, success]);

  /* ========================================================================
     Select Resume
  ======================================================================== */

  const handleSelectResume = (resume: Resume) => {
    setSelectedResume(resume);
    setAnalysis(resume.analysis ?? null);
    clearMessages();
  };

  /* ========================================================================
     Upload
  ======================================================================== */

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearMessages();

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      const message =
        "Only PDF and DOCX resume files are allowed.";

      setError(message);
      toast.error(message);

      event.target.value = "";

      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      const message =
        "Resume file must be smaller than 10MB.";

      setError(message);
      toast.error(message);

      event.target.value = "";

      return;
    }

    try {
      setUploading(true);

      const response = await resumeApi.uploadResume(file);

      const successMessage =
        response.message ||
        "Resume uploaded successfully.";

      setSuccess(successMessage);
      toast.success(successMessage);

      const refreshedResumes = await loadResumes();

      const uploadedResume = refreshedResumes[0];

      if (uploadedResume) {
        setSelectedResume(uploadedResume);
        setAnalysis(uploadedResume.analysis ?? null);
      }
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to upload resume.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  /* ========================================================================
     Analyze
  ======================================================================== */

  const handleAnalyze = async () => {
    if (!selectedResume) {
      const message = "Please select a resume first.";

      setError(message);
      toast.error(message);

      return;
    }

    try {
      setAnalyzing(true);
      clearMessages();

      const response = await resumeApi.analyzeResume(
        selectedResume.id,
      );

      const result: ResumeAnalysis | null =
        response.data ?? null;

      setAnalysis(result);

      setSelectedResume((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          analysis: result,
        };
      });

      setResumes((current) =>
        current.map((resume) =>
          resume.id === selectedResume.id
            ? {
                ...resume,
                analysis: result,
              }
            : resume,
        ),
      );

      const successMessage =
        response.message ||
        "Resume analyzed successfully.";

      setSuccess(successMessage);
      toast.success(successMessage);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to analyze resume.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  };

  /* ========================================================================
     Get Existing Analysis
  ======================================================================== */

  const handleGetAnalysis = async () => {
    if (!selectedResume) {
      const message = "Please select a resume first.";

      setError(message);
      toast.error(message);

      return;
    }

    try {
      setAnalyzing(true);
      clearMessages();

      const response =
        await resumeApi.getResumeAnalysis(
          selectedResume.id,
        );

      const result: ResumeAnalysis | null =
        response.data ?? null;

      setAnalysis(result);

      setSelectedResume((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          analysis: result,
        };
      });

      setResumes((current) =>
        current.map((resume) =>
          resume.id === selectedResume.id
            ? {
                ...resume,
                analysis: result,
              }
            : resume,
        ),
      );

      if (result) {
        const message =
          "Resume analysis loaded successfully.";

        setSuccess(message);
        toast.success(message);
      } else {
        const message =
          "No analysis has been generated for this resume yet.";

        setSuccess(message);
        toast.info(message);
      }
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to load resume analysis.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  };

  /* ========================================================================
     Ingest
  ======================================================================== */

  const handleIngest = async () => {
    if (!selectedResume) {
      const message = "Please select a resume first.";

      setError(message);
      toast.error(message);

      return;
    }

    try {
      setIngesting(true);
      clearMessages();

      const response =
        await resumeApi.ingestResume(
          selectedResume.id,
        );

      const successMessage =
        response.message ||
        "Resume ingested successfully.";

      setSuccess(successMessage);
      toast.success(successMessage);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to ingest resume.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setIngesting(false);
    }
  };

  /* ========================================================================
     Delete
  ======================================================================== */

  const handleDelete = async () => {
    if (!selectedResume) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        selectedResume.fileName ?? "this resume"
      }"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      clearMessages();

      const response =
        await resumeApi.deleteResume(
          selectedResume.id,
        );

      setAnalysis(null);
      setSelectedResume(null);

      const successMessage =
        response.message ||
        "Resume deleted successfully.";

      setSuccess(successMessage);
      toast.success(successMessage);

      await loadResumes();
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to delete resume.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  /* ========================================================================
     Busy State
  ======================================================================== */

  const isBusy =
    uploading ||
    analyzing ||
    ingesting ||
    deleting;

  /* ========================================================================
     UI
  ======================================================================== */

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* ==================================================================
          Particle Background
      ================================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <ParticleWave />
      </div>

      {/* ==================================================================
          Content
      ================================================================== */}

      <div className="relative z-10">
        {/* =================================================================
            Header
        ================================================================= */}

        <div className="border-b bg-background/80 px-5 py-5 backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Resume Manager
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    {resumes.length}{" "}
                    {resumes.length === 1
                      ? "resume"
                      : "resumes"}{" "}
                    available
                  </p>
                </div>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Upload your resume, analyze it with AI, and
                prepare it for semantic job matching.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {uploading
                  ? "Uploading..."
                  : "Upload Resume"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          </div>
        </div>

        {/* =================================================================
            Messages
        ================================================================= */}

        {(error || success) && (
          <div className="space-y-2 border-b bg-background/80 px-5 py-4 backdrop-blur-xl sm:px-6">
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{success}</span>
              </div>
            )}
          </div>
        )}

        {/* =================================================================
            Main Manager Layout
        ================================================================= */}

        <div className="grid md:grid-cols-[300px_minmax(0,1fr)]">
          {/* ===============================================================
              Left
          ================================================================ */}

          <aside className="border-b p-5 md:border-b-0 md:border-r">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Your Resumes
                </h3>

                <p className="text-xs text-muted-foreground">
                  Select a resume to manage
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="rounded-lg border p-2 transition hover:bg-muted disabled:opacity-50"
                aria-label="Upload resume"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Loading resumes...
                </p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  No resume uploaded
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Upload a PDF or DOCX resume to start
                  using the AI tools.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploading}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {resumes.map((resume) => {
                  const isSelected =
                    selectedResume?.id === resume.id;

                  const hasAnalysis =
                    Boolean(resume.analysis);

                  return (
                    <button
                      key={resume.id}
                      type="button"
                      onClick={() =>
                        handleSelectResume(resume)
                      }
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            isSelected
                              ? "bg-primary/10"
                              : "bg-muted"
                          }`}
                        >
                          <FileText
                            className={`h-5 w-5 ${
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {resume.fileName ??
                              "Resume"}
                          </p>

                          {resume.createdAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Uploaded{" "}
                              {new Date(
                                resume.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          )}

                          {hasAnalysis && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Analyzed
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* ===============================================================
              Right
          ================================================================ */}

          <div className="min-w-0 p-5 sm:p-6">
            {!selectedResume ? (
              <div className="flex min-h-[420px] items-center justify-center text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    Select a resume
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Select an uploaded resume from the
                    left panel to view details, run AI
                    analysis, or ingest it into the RAG
                    system.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* =========================================================
                    Selected Resume
                ========================================================== */}

                <section className="rounded-2xl border bg-background/70 p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0 rounded-xl bg-primary/10 p-3">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {selectedResume.fileName ??
                            "Resume"}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedResume.fileType ??
                            "Resume file"}
                        </p>

                        {selectedResume.createdAt && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Uploaded{" "}
                            {new Date(
                              selectedResume.createdAt,
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isBusy}
                      className="shrink-0 rounded-lg p-2 text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Delete resume"
                    >
                      {deleting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Metadata */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {selectedResume.fileSize != null && (
                      <div className="rounded-xl bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          File Size
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {(
                            selectedResume.fileSize /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    )}

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Type
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedResume.fileType ===
                        "application/pdf"
                          ? "PDF"
                          : "DOCX"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        AI Analysis
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedResume.analysis
                          ? "Available"
                          : "Not generated"}
                      </p>
                    </div>
                  </div>

                  {/* View Resume */}

                  {(selectedResume.fileUrl ||
                    selectedResume.url) && (
                    <a
                      href={
                        selectedResume.fileUrl ??
                        selectedResume.url ??
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Resume
                    </a>
                  )}
                </section>

                {/* =========================================================
                    AI Tools
                ========================================================== */}

                <section className="mt-6">
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />

                      <h3 className="font-semibold">
                        AI Resume Tools
                      </h3>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Analyze your resume or prepare it
                      for semantic search and recruiter AI.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Analyze */}

                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={
                        analyzing ||
                        ingesting ||
                        deleting
                      }
                      className="group rounded-xl border p-4 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-primary/10 p-2">
                          {analyzing ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-primary" />
                          )}
                        </div>

                        <span className="text-xs text-muted-foreground">
                          AI
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        Analyze Resume
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Generate an AI quality, skills and
                        career analysis.
                      </p>
                    </button>

                    {/* Existing Analysis */}

                    <button
                      type="button"
                      onClick={handleGetAnalysis}
                      disabled={
                        analyzing ||
                        ingesting ||
                        deleting
                      }
                      className="group rounded-xl border p-4 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-blue-500/10 p-2">
                          {analyzing ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          ) : (
                            <Brain className="h-4 w-4 text-blue-600" />
                          )}
                        </div>

                        <span className="text-xs text-muted-foreground">
                          Saved
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        View Analysis
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Load the analysis already stored
                        for this resume.
                      </p>
                    </button>

                    {/* Ingest */}

                    <button
                      type="button"
                      onClick={handleIngest}
                      disabled={
                        ingesting ||
                        analyzing ||
                        deleting
                      }
                      className="group rounded-xl border p-4 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-violet-500/10 p-2">
                          {ingesting ? (
                            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-violet-600" />
                          )}
                        </div>

                        <span className="text-xs text-muted-foreground">
                          RAG
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        Ingest Resume
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Chunk and embed the resume for
                        semantic search.
                      </p>
                    </button>
                  </div>
                </section>

                {/* =========================================================
                    Analysis
                ========================================================== */}

                {analysis && (
                  <section className="mt-6 rounded-2xl border bg-background/70 p-5 backdrop-blur-sm">
                    {/* Header */}

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>

                          <div>
                            <h3 className="font-semibold">
                              Resume Analysis
                            </h3>

                            <p className="text-xs text-muted-foreground">
                              AI-generated resume
                              evaluation
                            </p>
                          </div>
                        </div>
                      </div>

                      {typeof analysis.overallScore ===
                        "number" && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {analysis.overallScore}
                          </p>

                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Overall Score
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Overall Score */}

                    {typeof analysis.overallScore ===
                      "number" && (
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Resume Quality
                          </span>

                          <span className="text-sm font-semibold">
                            {analysis.overallScore}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  analysis.overallScore,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Score Cards */}

                    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
                      <ScoreCard
                        label="Skills"
                        value={analysis.skillsScore}
                      />

                      <ScoreCard
                        label="Experience"
                        value={
                          analysis.experienceScore
                        }
                      />

                      <ScoreCard
                        label="Education"
                        value={
                          analysis.educationScore
                        }
                      />

                      <ScoreCard
                        label="Projects"
                        value={
                          analysis.projectsScore
                        }
                      />

                      <ScoreCard
                        label="Certifications"
                        value={
                          analysis.certificationsScore
                        }
                      />
                    </div>

                    {/* Summary */}

                    {analysis.summary && (
                      <AnalysisSection title="Summary">
                        <p className="text-sm leading-6 text-muted-foreground">
                          {analysis.summary}
                        </p>
                      </AnalysisSection>
                    )}

                    {/* Skills */}

                    {analysis.skills &&
                      analysis.skills.length > 0 && (
                        <AnalysisSection title="Skills">
                          <div className="flex flex-wrap gap-2">
                            {analysis.skills.map(
                              (skill, index) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ),
                            )}
                          </div>
                        </AnalysisSection>
                      )}

                    {/* Strengths */}

                    {analysis.strengths &&
                      analysis.strengths.length > 0 && (
                        <AnalysisSection title="Strengths">
                          <BulletList
                            items={analysis.strengths}
                          />
                        </AnalysisSection>
                      )}

                    {/* Weaknesses */}

                    {analysis.weaknesses &&
                      analysis.weaknesses.length > 0 && (
                        <AnalysisSection title="Areas to Improve">
                          <BulletList
                            items={analysis.weaknesses}
                          />
                        </AnalysisSection>
                      )}

                    {/* Suggestions */}

                    {analysis.suggestions &&
                      analysis.suggestions.length > 0 && (
                        <AnalysisSection title="Suggestions">
                          <BulletList
                            items={analysis.suggestions}
                          />
                        </AnalysisSection>
                      )}

                    {/* Missing Skills */}

                    {analysis.missingSkills &&
                      analysis.missingSkills.length > 0 && (
                        <AnalysisSection title="Missing Skills">
                          <div className="flex flex-wrap gap-2">
                            {analysis.missingSkills.map(
                              (
                                skill: string,
                                index: number,
                              ) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-600"
                                >
                                  {skill}
                                </span>
                              ),
                            )}
                          </div>
                        </AnalysisSection>
                      )}
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Smart Job Matching
   ========================================================================== */

function SmartJobMatching() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  /* ========================================================================
     API URL
  ======================================================================== */

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000";

  /* ========================================================================
     Error Helper
  ======================================================================== */

  const getErrorMessage = (
    error: unknown,
    fallback: string,
  ): string => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      const message = (error as { message?: unknown })
        .message;

      if (
        typeof message === "string" &&
        message.length > 0
      ) {
        return message;
      }
    }

    return fallback;
  };

  /* ========================================================================
     Find Matching Jobs
  ======================================================================== */

  const findMatchingJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/v1/candidate/job-matches`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      let result: JobMatchResponse;

      try {
        result =
          (await response.json()) as JobMatchResponse;
      } catch {
        throw new Error(
          "The server returned an invalid response.",
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to find matching jobs.",
        );
      }

      const jobMatches = Array.isArray(result.data)
        ? result.data
        : [];

      setMatches(jobMatches);
      setLoaded(true);

      if (jobMatches.length === 0) {
        toast.info(
          "No matching jobs found for your resume.",
        );
      } else {
        toast.success(
          `${jobMatches.length} matching jobs found.`,
        );
      }
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to find matching jobs.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================================
     Match Score
  ======================================================================== */

  const getMatchScore = (score: number): number => {
    if (!Number.isFinite(score)) {
      return 0;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  };

  /* ========================================================================
     Match Label
  ======================================================================== */

  const getMatchLabel = (
    score: number,
  ): string => {
    if (score >= 90) {
      return "Excellent Match";
    }

    if (score >= 80) {
      return "Strong Match";
    }

    if (score >= 70) {
      return "Good Match";
    }

    if (score >= 60) {
      return "Potential Match";
    }

    return "Low Match";
  };

  /* ========================================================================
     UI
  ======================================================================== */

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Decorative Background */}

      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative p-6 sm:p-8">
        {/* ================================================================
            Header
        ================================================================= */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">
                Find Jobs That Match Your Resume
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Our intelligent matching system compares
                your resume profile with available jobs
                using skills, experience, education and
                semantic similarity.
              </p>
            </div>
          </div>

          {/* ==============================================================
              Button
          ============================================================== */}

          <button
            type="button"
            onClick={findMatchingJobs}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Finding Jobs...
              </>
            ) : loaded ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Matches
              </>
            ) : (
              <>
                Find Matching Jobs
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* ================================================================
            Error
        ================================================================= */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-medium">
                Matching failed
              </p>

              <p className="mt-1 text-xs">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ================================================================
            Initial State
        ================================================================= */}

        {!loaded && !loading && !error && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MatchFeature
              icon={Brain}
              title="AI Similarity"
              description="Compare your resume with job descriptions using semantic similarity."
            />

            <MatchFeature
              icon={CheckCircle2}
              title="Skill Matching"
              description="Identify skills that match the job requirements."
            />

            <MatchFeature
              icon={BriefcaseBusiness}
              title="Career Fit"
              description="Consider experience and profile relevance to rank opportunities."
            />
          </div>
        )}

        {/* ================================================================
            Loading
        ================================================================= */}

        {loading && (
          <div className="mt-8 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-7 w-7 animate-pulse text-primary" />
            </div>

            <h4 className="mt-4 font-semibold">
              Analyzing your career profile
            </h4>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              We are comparing your resume with
              available jobs. This may take a few seconds.
            </p>
          </div>
        )}

        {/* ================================================================
            No Results
        ================================================================= */}

        {loaded &&
          !loading &&
          !error &&
          matches.length === 0 && (
            <div className="mt-8 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <BriefcaseBusiness className="h-7 w-7 text-muted-foreground" />
              </div>

              <h4 className="mt-4 font-semibold">
                No matching jobs found
              </h4>

              <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                Try analyzing and ingesting your latest
                resume first, or upload a stronger resume
                with more relevant skills.
              </p>
            </div>
          )}

        {/* ================================================================
            Results
        ================================================================= */}

        {matches.length > 0 && !loading && (
          <div className="mt-8">
            {/* Results Header */}

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold">
                  Recommended Jobs
                </h4>

                <p className="text-sm text-muted-foreground">
                  {matches.length} jobs matched with your
                  resume profile.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Ranked
              </div>
            </div>

            {/* Results */}

            <div className="grid gap-4">
              {matches.map((job) => {
                const score = getMatchScore(
                  job.matchScore,
                );

                const company =
                  job.company ??
                  job.companyName ??
                  "Company";

                return (
                  <JobMatchCard
                    key={job.jobId}
                    job={job}
                    score={score}
                    matchLabel={getMatchLabel(score)}
                    company={company}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Job Match Card
   ========================================================================== */

function JobMatchCard({
  job,
  score,
  matchLabel,
  company,
}: {
  job: JobMatch;
  score: number;
  matchLabel: string;
  company: string;
}) {
  const jobUrl = `/jobs/${job.jobId}`;

  return (
    <article className="rounded-2xl border bg-background/70 p-5 transition hover:border-primary/30 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* ================================================================
            Job Information
        ================================================================= */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-base font-semibold">
                {job.title}
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                {company}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {job.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                )}

                {job.employmentType && (
                  <>
                    <span>•</span>

                    <span>
                      {job.employmentType}
                    </span>
                  </>
                )}

                {job.remote === true && (
                  <>
                    <span>•</span>

                    <span className="font-medium text-primary">
                      Remote
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ==============================================================
              Job Description
          ============================================================== */}

          {job.description && (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {job.description}
            </p>
          )}

          {/* ==============================================================
              Experience
          ============================================================== */}

          {job.experience && (
            <div className="mt-3 inline-flex rounded-lg bg-muted/50 px-3 py-1.5 text-xs">
              <span className="text-muted-foreground">
                Experience:
              </span>

              <span className="ml-1 font-medium">
                {job.experience}
              </span>
            </div>
          )}
        </div>

        {/* ================================================================
            Match Score
        ================================================================= */}

        <div className="shrink-0 lg:w-32 lg:text-right">
          <div className="flex items-center gap-3 lg:block">
            <div>
              <p className="text-3xl font-bold text-primary">
                {score}%
              </p>

              <p className="text-xs font-medium">
                {matchLabel}
              </p>
            </div>

            <div className="flex-1 lg:mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          Skills
      ================================================================= */}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* Matched Skills */}

        <div className="rounded-xl border bg-green-500/5 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />

            <h5 className="text-sm font-semibold">
              Matched Skills
            </h5>
          </div>

          {job.matchedSkills &&
          job.matchedSkills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.matchedSkills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700"
                  >
                    {skill}
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              No specific matched skills returned.
            </p>
          )}
        </div>

        {/* Missing Skills */}

        <div className="rounded-xl border bg-orange-500/5 p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-orange-600" />

            <h5 className="text-sm font-semibold">
              Skills to Improve
            </h5>
          </div>

          {job.missingSkills &&
          job.missingSkills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.missingSkills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-700"
                  >
                    {skill}
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Great! No major missing skills detected.
            </p>
          )}
        </div>
      </div>

      {/* ================================================================
          Footer
      ================================================================= */}

      <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {typeof job.similarity === "number" && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              Semantic:{" "}
              {Math.round(
                job.similarity > 1
                  ? job.similarity
                  : job.similarity * 100,
              )}
              %
            </span>
          )}

          {job.requiredSkills &&
            job.requiredSkills.length > 0 && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                {job.requiredSkills.length} required
                skills
              </span>
            )}
        </div>

        <a
          href={jobUrl}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          View Job
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

/* ==========================================================================
   Match Feature
   ========================================================================== */

function MatchFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-background/70 p-4 backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <p className="mt-3 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* ==========================================================================
   Feature Card
   ========================================================================== */

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-background/80 px-3 py-4 text-center shadow-sm backdrop-blur transition hover:border-primary/30 hover:bg-primary/5">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>

      <p className="mt-2 text-xs font-semibold">
        {title}
      </p>

      <p className="mt-0.5 text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* ==========================================================================
   Section Header
   ========================================================================== */

function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: ElementType;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />

        <h2 className="text-xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>

      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* ==========================================================================
   Score Card
   ========================================================================== */

function ScoreCard({
  label,
  value,
}: {
  label: string;
  value?: number | null;
}) {
  if (typeof value !== "number") {
    return null;
  }

  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-lg font-semibold">
          {value}
        </p>

        <span className="text-[10px] text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   Analysis Section
   ========================================================================== */

function AnalysisSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6 border-t pt-5">
      <h4 className="mb-2 text-sm font-semibold">
        {title}
      </h4>

      {children}
    </div>
  );
}

/* ==========================================================================
   Bullet List
   ========================================================================== */

function BulletList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-2 text-sm leading-6 text-muted-foreground"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}