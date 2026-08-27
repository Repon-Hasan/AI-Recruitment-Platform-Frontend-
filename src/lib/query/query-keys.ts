export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  jobs: {
    all: ["jobs"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["jobs", "list", filters] as const,
    detail: (id: string) => ["jobs", "detail", id] as const,
    recommendations: ["jobs", "recommendations"] as const,
  },
  applications: {
    all: ["applications"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["applications", "list", filters] as const,
    detail: (id: string) => ["applications", "detail", id] as const,
  },
  resumes: {
    all: ["resumes"] as const,
    detail: (id: string) => ["resumes", "detail", id] as const,
    analysis: (id: string) => ["resumes", "analysis", id] as const,
  },
  candidates: {
    profile: ["candidates", "profile"] as const,
    detail: (id: string) => ["candidates", "detail", id] as const,
    matches: (jobId: string) => ["candidates", "matches", jobId] as const,
  },
  interviews: {
    all: ["interviews"] as const,
    detail: (id: string) => ["interviews", "detail", id] as const,
  },
  dashboard: {
    candidate: ["dashboard", "candidate"] as const,
    recruiter: ["dashboard", "recruiter"] as const,
    admin: ["dashboard", "admin"] as const,
  },
};