
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  resumeApi,
  type Resume,
  type ResumeAnalysis,
} from "@/lib/api/resume.api";

interface ResumeManagerProps {
  open: boolean;
  onClose: () => void;
  onResumeChange?: () => void;
}

export default function ResumeManager({
  open,
  onClose,
  onResumeChange,
}: ResumeManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] =
    useState<Resume | null>(null);
  const [analysis, setAnalysis] =
    useState<ResumeAnalysis | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     Helpers
  ========================================================= */

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const getErrorMessage = useCallback(
    (err: unknown, fallback: string): string => {
      if (err instanceof Error && err.message) {
        return err.message;
      }

      return fallback;
    },
    [],
  );

  /* =========================================================
     Load Resumes
  ========================================================= */

  const loadResumes = useCallback(async (): Promise<Resume[]> => {
    try {
      setLoading(true);
      setError("");

      const response = await resumeApi.getMyResumes();

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   data: result
       * }
       *
       * result = prisma.resume.findMany(...)
       *
       * Therefore response.data is the array directly.
       */

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
      setError(
        getErrorMessage(err, "Failed to load resumes."),
      );

      return [];
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  /* =========================================================
     Load resumes when modal opens
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadResumes();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, loadResumes]);

  /* =========================================================
     Clear messages automatically
  ========================================================= */

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

  /* =========================================================
     Select Resume
  ========================================================= */

  const handleSelectResume = useCallback(
    (resume: Resume) => {
      setSelectedResume(resume);

      /*
       * Analysis belongs to the selected resume.
       * Clear previous resume's analysis immediately.
       */
      setAnalysis(null);

      clearMessages();
    },
    [clearMessages],
  );

  /* =========================================================
     Upload Resume
  ========================================================= */

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearMessages();

    /*
     * Backend supports:
     * - application/pdf
     * - application/vnd.openxmlformats-officedocument.wordprocessingml.document
     */

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only PDF and DOCX resume files are allowed.",
      );

      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Resume file must be smaller than 10MB.",
      );

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      /*
       * Backend:
       *
       * POST /resume/upload
       *
       * multipart/form-data
       * field name = "resume"
       */

      const response = await resumeApi.uploadResume(file);

      setSuccess(
        response.message ||
          "Resume uploaded successfully.",
      );

      /*
       * Refresh list so the newly created resume
       * definitely appears.
       */
      const refreshedResumes = await loadResumes();

      /*
       * Usually the newly uploaded resume is first
       * because the backend returns newest first.
       */
      const uploadedResume = refreshedResumes[0];

      if (uploadedResume) {
        setSelectedResume(uploadedResume);
        setAnalysis(uploadedResume?.analysis ?? null);
      }

      onResumeChange?.();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to upload resume.",
        ),
      );
    } finally {
      setUploading(false);

      /*
       * Allows selecting the same file again.
       */
      event.target.value = "";
    }
  };

  /* =========================================================
     Analyze Resume
  ========================================================= */

  const handleAnalyze = async (): Promise<void> => {
    if (!selectedResume) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setAnalyzing(true);
      clearMessages();

      /*
       * Backend:
       *
       * POST /resume/:id/analyze
       *
       * data = ResumeAnalysis
       */

      const response =
        await resumeApi.analyzeResume(
          selectedResume.id,
        );

      const result: ResumeAnalysis | null =
        response.data ?? null;

      setAnalysis(result);

      /*
       * Keep selected resume in sync.
       */
      setSelectedResume((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          analysis: result,
        };
      });

      /*
       * Also update the list item.
       */
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

      setSuccess(
        response.message ||
          "Resume analyzed successfully.",
      );

      onResumeChange?.();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to analyze resume.",
        ),
      );
    } finally {
      setAnalyzing(false);
    }
  };

  /* =========================================================
     Get Existing Analysis
  ========================================================= */

  const handleGetAnalysis = async (): Promise<void> => {
    if (!selectedResume) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setAnalyzing(true);
      clearMessages();

      /*
       * Backend:
       *
       * GET /resume/:id/analysis
       *
       * data = ResumeAnalysis | null
       */

      const response =
        await resumeApi.getResumeAnalysis(
          selectedResume.id,
        );

      const result: ResumeAnalysis | null =
        response.data ?? null;

      setAnalysis(result);

      if (result) {
        setSuccess(
          "Resume analysis loaded successfully.",
        );
      } else {
        setSuccess(
          "No analysis has been generated for this resume yet.",
        );
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to load resume analysis.",
        ),
      );
    } finally {
      setAnalyzing(false);
    }
  };

  /* =========================================================
     Ingest Resume
  ========================================================= */

  const handleIngest = async (): Promise<void> => {
    if (!selectedResume) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setIngesting(true);
      clearMessages();

      /*
       * Backend:
       *
       * POST /resume/:resumeId/ingest
       *
       * Creates:
       * - chunks
       * - embeddings
       * - records inside resume_chunks
       *
       * The service currently returns Promise<void>,
       * therefore response.data is not required.
       */

      const response =
        await resumeApi.ingestResume(
          selectedResume.id,
        );

      setSuccess(
        response.message ||
          "Resume ingested successfully.",
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to ingest resume.",
        ),
      );
    } finally {
      setIngesting(false);
    }
  };

  /* =========================================================
     Delete Resume
  ========================================================= */

  const handleDelete = async (): Promise<void> => {
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

      /*
       * Backend:
       *
       * DELETE /resume/:id
       */

      const response =
        await resumeApi.deleteResume(
          selectedResume.id,
        );

      setAnalysis(null);
      setSelectedResume(null);

      setSuccess(
        response.message ||
          "Resume deleted successfully.",
      );

      /*
       * Refresh remaining resumes.
       */
      await loadResumes();

      onResumeChange?.();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to delete resume.",
        ),
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     Close modal
  ========================================================= */

  const handleClose = (): void => {
    if (
      uploading ||
      analyzing ||
      ingesting ||
      deleting
    ) {
      return;
    }

    onClose();
  };

  /* =========================================================
     Don't render when closed
  ========================================================= */

  if (!open) {
    return null;
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative flex
          max-h-[90vh]
          w-full max-w-6xl
          flex-col
          overflow-hidden
          rounded-2xl
          border border-border
          bg-background
          shadow-2xl
        "
      >
        {/* =================================================
            Header
        ================================================= */}

        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>

              <h2 className="text-lg font-semibold">
                Manage Resume
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload, analyze, optimize and prepare
              your resume for AI-powered matching.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={
              uploading ||
              analyzing ||
              ingesting ||
              deleting
            }
            className="
              rounded-lg p-2
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close resume manager"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================
            Messages
        ================================================= */}

        {(error || success) && (
          <div className="space-y-2 px-6 pt-4">
            {error && (
              <div
                className="
                  flex items-start gap-2
                  rounded-xl
                  border border-destructive/30
                  bg-destructive/10
                  px-4 py-3
                  text-sm text-destructive
                "
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                className="
                  flex items-start gap-2
                  rounded-xl
                  border border-green-500/30
                  bg-green-500/10
                  px-4 py-3
                  text-sm text-green-600
                "
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>
        )}

        {/* =================================================
            Main Content
        ================================================= */}

        <div
          className="
            grid flex-1
            overflow-y-auto
            md:grid-cols-[320px_minmax(0,1fr)]
          "
        >
          {/* =================================================
              LEFT — Resume List
          ================================================= */}

          <aside
            className="
              border-b border-border
              p-5
              md:border-b-0
              md:border-r
            "
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">
                  Your Resumes
                </h3>

                <p className="text-xs text-muted-foreground">
                  {resumes.length}{" "}
                  {resumes.length === 1
                    ? "resume"
                    : "resumes"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="
                  flex items-center gap-2
                  rounded-lg
                  bg-primary
                  px-3 py-2
                  text-sm font-medium
                  text-primary-foreground
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {uploading
                  ? "Uploading..."
                  : "Upload"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleUpload}
              />
            </div>

            {/* Loading */}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Loading resumes...
                </p>
              </div>
            ) : resumes.length === 0 ? (
              /* Empty */

              <div
                className="
                  rounded-xl
                  border border-dashed
                  border-border
                  p-6
                  text-center
                "
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  No resume uploaded
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Upload a PDF or DOCX resume to
                  analyze it and use it for
                  AI-powered job matching.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploading}
                  className="
                    mt-4
                    rounded-lg
                    bg-primary
                    px-4 py-2
                    text-sm font-medium
                    text-primary-foreground
                    transition
                    hover:opacity-90
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              /* Resume List */

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
                      className={`
                        w-full
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition
                        ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:bg-muted/50"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`
                            rounded-lg
                            p-2
                            ${
                              isSelected
                                ? "bg-primary/10"
                                : "bg-muted"
                            }
                          `}
                        >
                          <FileText
                            className={`
                              h-5 w-5
                              ${
                                isSelected
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }
                            `}
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

          {/* =================================================
              RIGHT — Resume Details
          ================================================= */}

          <main className="min-w-0 p-6">
            {!selectedResume ? (
              <div className="flex min-h-[400px] items-center justify-center text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    Select a resume
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Select an uploaded resume from
                    the left panel to view its
                    details, run AI analysis, or
                    ingest it into the RAG system.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* =================================================
                    Selected Resume
                ================================================= */}

                <section className="rounded-2xl border border-border bg-card p-5">
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
                      disabled={
                        deleting ||
                        uploading ||
                        analyzing ||
                        ingesting
                      }
                      className="
                        shrink-0
                        rounded-lg
                        p-2
                        text-destructive
                        transition
                        hover:bg-destructive/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      aria-label="Delete resume"
                    >
                      {deleting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Resume Metadata */}

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
                      className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-border
                        px-4 py-2
                        text-sm
                        font-medium
                        transition
                        hover:bg-muted
                      "
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Resume
                    </a>
                  )}
                </section>

                {/* =================================================
                    AI Tools
                ================================================= */}

                <section className="mt-6">
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />

                      <h3 className="font-semibold">
                        AI Resume Tools
                      </h3>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Analyze your resume or prepare
                      it for semantic search and
                      recruiter AI.
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
                      className="
                        group
                        rounded-xl
                        border border-border
                        p-4
                        text-left
                        transition
                        hover:border-primary/50
                        hover:bg-primary/5
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
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
                        Generate an AI quality,
                        skills and career analysis.
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
                      className="
                        group
                        rounded-xl
                        border border-border
                        p-4
                        text-left
                        transition
                        hover:border-primary/50
                        hover:bg-primary/5
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
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
                        Load the analysis already
                        stored for this resume.
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
                      className="
                        group
                        rounded-xl
                        border border-border
                        p-4
                        text-left
                        transition
                        hover:border-primary/50
                        hover:bg-primary/5
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
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
                        Chunk and embed the resume
                        for semantic search.
                      </p>
                    </button>
                  </div>
                </section>

                {/* =================================================
                    Analysis
                ================================================= */}

                {analysis && (
                  <section className="mt-6 rounded-2xl border border-border bg-card p-5">
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
                              (
                                skill,
                                index,
                              ) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="
                                    rounded-full
                                    border
                                    border-border
                                    bg-muted/50
                                    px-3 py-1
                                    text-xs
                                    font-medium
                                  "
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
                      analysis.strengths.length >
                        0 && (
                        <AnalysisSection title="Strengths">
                          <BulletList
                            items={
                              analysis.strengths
                            }
                          />
                        </AnalysisSection>
                      )}

                    {/* Weaknesses */}

                    {analysis.weaknesses &&
                      analysis.weaknesses.length >
                        0 && (
                        <AnalysisSection title="Areas to Improve">
                          <BulletList
                            items={
                              analysis.weaknesses
                            }
                          />
                        </AnalysisSection>
                      )}

                    {/* Suggestions */}

                    {analysis.suggestions &&
                      analysis.suggestions.length >
                        0 && (
                        <AnalysisSection title="Suggestions">
                          <BulletList
                            items={
                              analysis.suggestions
                            }
                          />
                        </AnalysisSection>
                      )}

                    {/* Missing Skills */}

                    {analysis.missingSkills &&
                      analysis.missingSkills?.length >
                        0 && (
                        <AnalysisSection title="Missing Skills">
                          <div className="flex flex-wrap gap-2">
                            {analysis.missingSkills?.map(
                              (
                                skill:string,
                                index:number,
                              ) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="
                                    rounded-full
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    px-3 py-1
                                    text-xs
                                    text-orange-600
                                  "
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
          </main>
        </div>

        {/* =================================================
            Footer
        ================================================= */}

        <div className="flex justify-end border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={
              uploading ||
              analyzing ||
              ingesting ||
              deleting
            }
            className="
              rounded-lg
              border border-border
              px-4 py-2
              text-sm font-medium
              transition
              hover:bg-muted
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Score Card
========================================================= */

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
    <div className="rounded-xl border border-border bg-muted/30 p-3">
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

/* =========================================================
   Analysis Section
========================================================= */

function AnalysisSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6 border-t border-border pt-5">
      <h4 className="mb-2 text-sm font-semibold">
        {title}
      </h4>

      {children}
    </div>
  );
}

/* =========================================================
   Bullet List
========================================================= */

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
          className="
            flex
            gap-2
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

