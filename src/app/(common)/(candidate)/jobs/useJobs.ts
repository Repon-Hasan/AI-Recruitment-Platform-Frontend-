"use client";

import { applyToJob, getJob, getJobMatch, getJobs, getMatchSummary, getSkillGap, searchJobs } from "@/lib/api/jobs.api";
import { ApiResponse } from "@/types/api.types";
import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";



export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
}

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: Boolean(jobId),
  });
}

export function useSearchJobs(
  keyword: string,
) {
  const normalizedKeyword = keyword.trim();

  return useQuery({
    queryKey: [
      "candidate-jobs-search",
      normalizedKeyword,
    ],

    queryFn: () =>
      searchJobs(normalizedKeyword),

    enabled: normalizedKeyword.length > 0,

    staleTime: 30_000,

    refetchOnWindowFocus: false,
  });
}

export function useJobMatch(jobId: string) {
  return useQuery({
    queryKey: ["job-match", jobId],
    queryFn: () => getJobMatch(jobId),
    enabled: Boolean(jobId),
  });
}

export function useSkillGap(jobId: string) {
  return useQuery({
    queryKey: ["skill-gap", jobId],
    queryFn: () => getSkillGap(jobId),
    enabled: Boolean(jobId),
  });
}

export function useMatchSummary(jobId: string) {
  return useQuery({
    queryKey: ["match-summary", jobId],
    queryFn: () => getMatchSummary(jobId),
    enabled: Boolean(jobId),
  });
}

export function useApplyToJob() {
  return useMutation({
    mutationFn: applyToJob,
  });
}