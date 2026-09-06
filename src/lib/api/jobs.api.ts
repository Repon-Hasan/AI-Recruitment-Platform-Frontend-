
import type {
  ApiResponse,
  Job,
  JobMatch,
  MatchSummary,
  SkillGapResponse,
} from "@/types/job";

import { apiClient } from "./client";

/* =========================================================
   JOB FILTERS
========================================================= */

export type JobFilters = {
  keyword?: string;
  location?: string;
  remoteType?: string;
  employmentType?: string;
  experienceLevel?: string;
  status?: string;
  page?: number;
  limit?: number;
};

/* =========================================================
   JOB RESPONSE
========================================================= */

export interface JobsResponse {
  data: Job[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/* =========================================================
   ENUM TYPES
========================================================= */

export type JobStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED"
  | "ARCHIVED"
  | string;

export type RemoteType =
  | "REMOTE"
  | "HYBRID"
  | "ONSITE"
  | string;

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY"
  | string;

export type ExperienceLevel =
  | "ENTRY"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "LEAD"
  | string;

/* =========================================================
   JOB SKILL
========================================================= */

export interface JobSkill {
  id: string;
  jobId: string;
  name: string;
  priority: string;
}

/* =========================================================
   JOB COUNTS
========================================================= */

export interface JobCounts {
  jobApplications: number;
  matches: number;
}

/* =========================================================
   RECRUITER JOB
========================================================= */

export interface RecruiterJob {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  image: string | null;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  deadline: string | null;
  status: JobStatus;
  publishedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  requiredSkills: JobSkill[];
  _count: JobCounts;
}

/* =========================================================
   MY JOBS RESPONSE
========================================================= */

interface MyJobsResponse {
  success: boolean;
  message: string;
  data: RecruiterJob[];
}

/* =========================================================
   CANDIDATE JOB MATCH
========================================================= */

/**
 * Backend calculateJobMatch() / getMyJobMatch() response
 *
 * Important:
 * Backend uses:
 * - overallMatchPercentage
 * - semanticMatchPercentage
 * - skillMatchPercentage
 * - experienceMatchPercentage
 * - educationMatchPercentage
 * - keywordMatchPercentage
 * - matchedSkills
 * - missingSkills
 */

export interface CandidateJobMatch {
  jobMatchId: string;

  overallMatchPercentage: number;
  semanticMatchPercentage: number;
  skillMatchPercentage: number;
  experienceMatchPercentage: number;
  educationMatchPercentage: number;
  keywordMatchPercentage: number;

  matchedSkills: string[];

  missingSkills: {
    high: string[];
    medium: string[];
    low: string[];
  };

  recommendation: string;

  matchLevel: string;
}

/* =========================================================
   GET CANDIDATE JOBS
   GET /api/v1/job/candidate
========================================================= */

export async function getJobs(
  filters?: JobFilters,
): Promise<Job[]> {
  const params = new URLSearchParams();

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  const endpoint = query
    ? `/api/v1/job/candidate?${query}`
    : "/api/v1/job/candidate";

  const response = await apiClient<ApiResponse<Job[]>>(
    endpoint,
  );

  return response.data;
}

/* =========================================================
   GET SINGLE JOB
   GET /api/v1/job/:id
========================================================= */

export async function getJob(
  jobId: string,
): Promise<Job> {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response = await apiClient<ApiResponse<Job>>(
    `/api/v1/job/${jobId}`,
  );

  return response.data;
}

/* =========================================================
   CALCULATE JOB MATCH
   POST /api/v1/job-matches/:jobId/calculate
========================================================= */

/**
 * This is the important function.
 *
 * Your backend does NOT automatically calculate a match
 * when GET /job-matches/:jobId is called.
 *
 * First call this endpoint.
 */
export async function calculateJobMatch(
  jobId: string,
): Promise<CandidateJobMatch> {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response =
    await apiClient<ApiResponse<CandidateJobMatch>>(
      `/api/v1/job-matches/${jobId}/calculate`,
      {
        method: "POST",
      },
    );

  return response.data;
}

/* =========================================================
   GET EXISTING JOB MATCH
   GET /api/v1/job-matches/:jobId
========================================================= */

export async function getJobMatch(
  jobId: string,
): Promise<CandidateJobMatch> {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response =
    await apiClient<ApiResponse<CandidateJobMatch>>(
      `/api/v1/job-matches/${jobId}`,
      {
        method: "GET",
      },
    );

  return response.data;
}

/* =========================================================
   GET SKILL GAP
   GET /api/v1/skill-gap/:jobId
========================================================= */

export async function getSkillGap(
  jobId: string,
): Promise<SkillGapResponse> {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response =
    await apiClient<ApiResponse<SkillGapResponse>>(
      `/api/v1/skill-gap/${jobId}`,
      {
        method: "GET",
      },
    );

  return response.data;
}

/* =========================================================
   GET MATCH SUMMARY
   GET /api/v1/job-matches/:jobId/summary
========================================================= */

/**
 * IMPORTANT:
 *
 * Your current backend getJobMatchSummary() checks:
 *
 * job.company.userId
 *
 * Therefore this endpoint is recruiter-oriented.
 *
 * Keep this function available for recruiter pages,
 * but DO NOT call it from the candidate job details page
 * unless the backend has a candidate-specific summary endpoint.
 */
export async function getMatchSummary(
  jobId: string,
): Promise<MatchSummary> {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response =
    await apiClient<ApiResponse<MatchSummary>>(
      `/api/v1/job-matches/${jobId}/summary`,
      {
        method: "GET",
      },
    );

  return response.data;
}

/* =========================================================
   CREATE JOB
   POST /job/create
========================================================= */

export async function createJob(
  payload: Partial<Job>,
): Promise<Job> {
  const response = await apiClient<ApiResponse<Job>>(
    "/job/create",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

/* =========================================================
   UPDATE JOB
   PATCH /job/:id
========================================================= */

export async function updateJob(
  id: string,
  payload: Partial<Job>,
): Promise<Job> {
  if (!id) {
    throw new Error("Job ID is required");
  }

  const response = await apiClient<ApiResponse<Job>>(
    `/job/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

/* =========================================================
   DELETE JOB
   DELETE /job/:id
========================================================= */

export async function deleteJob(
  id: string,
): Promise<void> {
  if (!id) {
    throw new Error("Job ID is required");
  }

  await apiClient<void>(
    `/job/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* =========================================================
   APPLY TO JOB
   POST /candidate/apply
========================================================= */

export async function applyToJob(payload: {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}) {
  if (!payload.jobId) {
    throw new Error("Job ID is required");
  }

  return apiClient(
    "/candidate/apply",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
export interface MyApplication {
  id: string;
  candidateProfileId: string;
  jobId: string;
  coverLetter: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface MyApplicationsResponse {
  applications: MyApplication[];
}
export async function getMyApplications(): Promise<MyApplicationsResponse> {
  return apiClient("/api/v1/candidate/my/application", {
    method: "GET",
  });
}

 

export async function getMyApplication(applicationId: string): Promise<MyApplicationsResponse> {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient(`/api/v1/candidate/my/applicationId/${applicationId}`, {
    method: "GET",
  });
}

export async function deleteMyApplication(applicationId: string) {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient(`/api/v1/candidate/my/application/${applicationId}`, {
    method: "DELETE",
  });
}

/* =========================================================
   SEARCH JOBS
   GET /job/my/search
========================================================= */

export async function searchJobs(
  keyword: string,
): Promise<Job[]> {
  const response = await apiClient<ApiResponse<Job[]>>(
    `/job/my/search?keyword=${encodeURIComponent(keyword)}`,
  );

  return response.data;
}

/* =========================================================
   RECRUITER MY JOBS
   GET /api/v1/job/my-jobs
========================================================= */

export const jobsApi = {
  async getMyJobs(): Promise<RecruiterJob[]> {
    const response =
      await apiClient<MyJobsResponse>(
        "/api/v1/job/my-jobs",
      );

    return response.data;
  },

  /* -------------------------------------------------------
     Candidate Job Match
  ------------------------------------------------------- */

  async calculateJobMatch(
    jobId: string,
  ): Promise<CandidateJobMatch> {
    return calculateJobMatch(jobId);
  },

  async getJobMatch(
    jobId: string,
  ): Promise<CandidateJobMatch> {
    return getJobMatch(jobId);
  },

  /* -------------------------------------------------------
     Skill Gap
  ------------------------------------------------------- */

  async getSkillGap(
    jobId: string,
  ): Promise<SkillGapResponse> {
    return getSkillGap(jobId);
  },

  /* -------------------------------------------------------
     Match Summary
     Recruiter only with current backend
  ------------------------------------------------------- */

  async getMatchSummary(
    jobId: string,
  ): Promise<MatchSummary> {
    return getMatchSummary(jobId);
  },
};

