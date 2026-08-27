import { apiClient } from "./client";
import type { Job } from "@/types/job";

export interface JobFilters {
  keyword?: string;
  location?: string;
  workMode?: string;
  employmentType?: string;
  experienceLevel?: string;
  skills?: string[];
}

export interface JobsResponse {
  data: Job[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getJobs(
  filters?: JobFilters,
): Promise<JobsResponse> {
  const params = new URLSearchParams();

  if (filters?.keyword) params.set("keyword", filters.keyword);
  if (filters?.location) params.set("location", filters.location);
  if (filters?.workMode) params.set("workMode", filters.workMode);
  if (filters?.employmentType) {
    params.set("employmentType", filters.employmentType);
  }
  if (filters?.experienceLevel) {
    params.set("experienceLevel", filters.experienceLevel);
  }

  return apiClient<JobsResponse>(`/jobs/search?${params.toString()}`);
}

export async function getJob(id: string) {
  return apiClient<Job>(`/jobs/${id}`);
}

export async function createJob(payload: unknown) {
  return apiClient<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateJob(id: string, payload: unknown) {
  return apiClient<Job>(`/jobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteJob(id: string) {
  return apiClient<void>(`/jobs/${id}`, {
    method: "DELETE",
  });
}