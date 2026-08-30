

import type {
  ApiResponse,
  Job,
  JobMatch,
  MatchSummary,
  SkillGapResponse,
} from "@/types/job";
import { apiClient } from "./client";

export interface JobsResponse {
  data: Job[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * GET /api/v1/job
 */
export async function getJobs(): Promise<Job[]> {
  const response = await apiClient<ApiResponse<Job[]>>(
    "/job/candidate"
  );

  return response.data;
}

/**
 * GET /api/v1/job/:id
 *
 * If your backend currently uses another endpoint
 * for a single job, change this one function.
 */
export async function getJob(
  jobId: string
): Promise<Job> {
  const response = await apiClient<ApiResponse<Job>>(
    `/job/${jobId}`
  );

  return response.data;
}

/**
 * GET /api/v1/skill-gap/:jobId
 */
export async function getSkillGap(
  jobId: string
): Promise<SkillGapResponse> {
  const response =
    await apiClient<ApiResponse<SkillGapResponse>>(
      `/skill-gap/${jobId}`
    );

  return response.data;
}

/**
 * GET /api/v1/job-matches/:jobId
 */
export async function getJobMatch(
  jobId: string
): Promise<JobMatch> {
  const response =
    await apiClient<ApiResponse<JobMatch>>(
      `/job-matches/${jobId}`
    );

  return response.data;
}

/**
 * GET /api/v1/job-matches/:jobId/summary
 */
export async function getMatchSummary(
  jobId: string
): Promise<MatchSummary> {
  const response =
    await apiClient<ApiResponse<MatchSummary>>(
      `/job-matches/${jobId}/summary`
    );

  return response.data;
}

/**
 * POST /api/v1/candidate/apply
 */
export async function applyToJob(payload: {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}) {
  return apiClient(
    "/candidate/apply",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function searchJobs(
  keyword: string,
): Promise<Job[]> {
  const response = await apiClient<ApiResponse<Job[]>>(
    `/job/my/search?keyword=${encodeURIComponent(keyword)}`,
  );

  return response.data;
}