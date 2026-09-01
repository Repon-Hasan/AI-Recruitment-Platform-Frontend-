

import type {
  ApiResponse,
  Job,
  JobMatch,
  MatchSummary,
  SkillGapResponse,
} from "@/types/job";
import { apiClient } from "./client";

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
export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  const params = new URLSearchParams();

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const endpoint = query ? `/job/candidate?${query}` : "/job/candidate";

  const response = await apiClient<ApiResponse<Job[]>>(endpoint);

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
export async function createJob(payload: Partial<Job>): Promise<Job> {
  const response = await apiClient<ApiResponse<Job>>("/job/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateJob(
  id: string,
  payload: Partial<Job>,
): Promise<Job> {
  const response = await apiClient<ApiResponse<Job>>(`/job/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteJob(id: string): Promise<void> {
  await apiClient<void>(`/job/${id}`, { method: "DELETE" });
}

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