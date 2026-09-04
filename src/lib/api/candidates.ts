import { apiClient } from "@/lib/api/client";

/* ============================================================
   TYPES
============================================================ */

export interface CandidateSkill {
  id?: string;
  name?: string;
  priority?: string;
  level?: string;

  [key: string]: unknown;
}

export interface Candidate {
  id?: string;
  userId?: string;

  name?: string;
  email?: string;

  image?: string | null;
  profileImage?: string | null;
  avatar?: string | null;

  title?: string | null;
  headline?: string | null;
  bio?: string | null;

  location?: string | null;

  experience?: number | null;
  yearsOfExperience?: number | null;

  skills?: CandidateSkill[] | string[];

  resumeUrl?: string | null;
  resume?: string | null;

  phone?: string | null;

  candidateProfile?: {
    id?: string;

    name?: string;
    title?: string;
    headline?: string;
    bio?: string;
    location?: string;

    experience?: number;
    yearsOfExperience?: number;

    skills?: CandidateSkill[] | string[];

    resumeUrl?: string | null;

    [key: string]: unknown;
  };

  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string | null;

    [key: string]: unknown;
  };

  [key: string]: unknown;
}

/* ============================================================
   JOB
============================================================ */

export interface Job {
  id: string;

  title: string;

  description?: string | null;

  location?: string | null;

  requiredSkills?: CandidateSkill[] | string[];

  [key: string]: unknown;
}

/* ============================================================
   JOB MATCH
============================================================ */

export interface JobMatch {
  id?: string;

  jobId?: string;

  candidateId?: string;

  candidateProfileId?: string;

  jobApplicationId?: string;

  matchScore?: number | null;

  score?: number | null;

  percentage?: number | null;

  skillsScore?: number | null;

  experienceScore?: number | null;

  educationScore?: number | null;

  explanation?: string | null;

  summary?: string | null;

  candidate?: Candidate;

  [key: string]: unknown;
}

/* ============================================================
   MATCH SUMMARY
============================================================ */

export interface JobMatchSummary {
  summary?: string;

  explanation?: string;

  matchScore?: number;

  score?: number;

  strengths?: string[];

  weaknesses?: string[];

  matchedSkills?: string[];

  missingSkills?: string[];

  [key: string]: unknown;
}

/* ============================================================
   SKILL GAP
============================================================ */

export interface SkillGap {
  id?: string;

  jobApplicationId?: string;

  candidateProfileId?: string;

  overallGapScore?: number;

  score?: number;

  missingSkills?: string[];

  matchedSkills?: string[];

  recommendations?: string[];

  [key: string]: unknown;
}

/* ============================================================
   AI RECRUITER ASSISTANT
============================================================ */

export interface RecruiterAssistantResponse {
  answer?: string;

  response?: string;

  message?: string;

  candidates?: Candidate[];

  results?: JobMatch[];

  matches?: JobMatch[];

  [key: string]: unknown;
}

/* ============================================================
   API RESPONSE HELPERS
============================================================ */

/**
 * Handles responses such as:
 *
 * {
 *   data: [...]
 * }
 *
 * or:
 *
 * {
 *   data: {
 *     candidates: [...]
 *   }
 * }
 */
function unwrapData<T>(response: unknown): T {
  if (!response || typeof response !== "object") {
    return response as T;
  }

  const result = response as {
    data?: unknown;
  };

  const data = result.data;

  /**
   * Backend response:
   *
   * {
   *   data: {
   *     data: [...]
   *   }
   * }
   */
  if (
    data &&
    typeof data === "object" &&
    "data" in data
  ) {
    return (data as { data?: T }).data as T;
  }

  return data as T;
}

/**
 * Safely return an array.
 */
function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  return [];
}

/* ============================================================
   CANDIDATE API
============================================================ */

export const candidatesApi = {
  /**
   * ==========================================================
   * GET ALL CANDIDATES
   *
   * GET /auth/allCandidates
   * ==========================================================
   */
  async getAllCandidates(): Promise<Candidate[]> {
    const response = await apiClient<unknown>(
      "/api/v1/auth/allCandidates",
      {
        method: "GET",
      },
    );

    const data = unwrapData<unknown>(response);

    /**
     * Example:
     *
     * {
     *   data: [...]
     * }
     */
    if (Array.isArray(data)) {
      return data as Candidate[];
    }

    /**
     * Example:
     *
     * {
     *   data: {
     *     candidates: [...]
     *   }
     * }
     */
    if (
      data &&
      typeof data === "object"
    ) {
      const object =
        data as Record<string, unknown>;

      if (Array.isArray(object.candidates)) {
        return object.candidates as Candidate[];
      }

      if (Array.isArray(object.users)) {
        return object.users as Candidate[];
      }

      if (Array.isArray(object.data)) {
        return object.data as Candidate[];
      }
    }

    return [];
  },

  /* ==========================================================
     JOB MATCHES
  ========================================================== */

  /**
   * Get all candidate matches for a job.
   *
   * GET /job-matches/job/:jobId
   */
  async getJobMatches(
    jobId: string,
  ): Promise<JobMatch[]> {
    const response = await apiClient<unknown>(
      `/api/v1/job-matches/job/${encodeURIComponent(jobId)}`,
      {
        method: "GET",
      },
    );

    const data = unwrapData<unknown>(response);

    /**
     * Direct array response
     */
    if (Array.isArray(data)) {
      return data as JobMatch[];
    }

    /**
     * Object response
     */
    if (
      data &&
      typeof data === "object"
    ) {
      const object =
        data as Record<string, unknown>;

      if (Array.isArray(object.matches)) {
        return object.matches as JobMatch[];
      }

      if (Array.isArray(object.jobMatches)) {
        return object.jobMatches as JobMatch[];
      }

      if (Array.isArray(object.data)) {
        return object.data as JobMatch[];
      }
    }

    return [];
  },

  /* ==========================================================
     SINGLE MATCH
  ========================================================== */

  /**
   * GET /job-matches/:matchId
   */
  async getMatch(
    matchId: string,
  ): Promise<JobMatch | null> {
    const response = await apiClient<unknown>(
      `/api/v1/job-matches/${encodeURIComponent(matchId)}`,
      {
        method: "GET",
      },
    );

    const data =
      unwrapData<JobMatch | null>(response);

    return data ?? null;
  },

  /* ==========================================================
     MATCH SUMMARY
  ========================================================== */

  /**
   * GET /job-matches/:matchId/summary
   */
  async getMatchSummary(
    matchId: string,
  ): Promise<JobMatchSummary | null> {
    const response =
      await apiClient<unknown>(
        `/api/v1/job-matches/${encodeURIComponent(
          matchId,
        )}/summary`,
        {
          method: "GET",
        },
      );

    const data =
      unwrapData<JobMatchSummary | null>(
        response,
      );

    return data ?? null;
  },

  /* ==========================================================
     SKILL GAP
  ========================================================== */

  /**
   * GET /skill-gap/:applicationId
   */
  async getSkillGap(
    applicationId: string,
  ): Promise<SkillGap | null> {
    const response =
      await apiClient<unknown>(
        `/api/v1/skill-gap/${encodeURIComponent(
          applicationId,
        )}`,
        {
          method: "GET",
        },
      );

    const data =
      unwrapData<SkillGap | null>(
        response,
      );

    return data ?? null;
  },

  /* ==========================================================
     AI RECRUITER ASSISTANT
  ========================================================== */

  /**
   * POST /ai-recruiter/assistant
   *
   * Example:
   *
   * {
   *   "jobId": "15f6465e-4599-4ef1-b26e-f078de36b2be",
   *   "query": "Show me the best 5 candidates for this React developer position",
   *   "limit": 5
   * }
   */
  async askRecruiterAssistant(
    jobId: string,
    query: string,
    limit = 5,
  ): Promise<RecruiterAssistantResponse> {
    const response =
      await apiClient<unknown>(
        "/api/v1/ai-recruiter/assistant",
        {
          method: "POST",

          body: JSON.stringify({
            jobId,
            query,
            limit,
          }),
        },
      );

    const data =
      unwrapData<RecruiterAssistantResponse>(
        response,
      );

    return data ?? {};
  },
};