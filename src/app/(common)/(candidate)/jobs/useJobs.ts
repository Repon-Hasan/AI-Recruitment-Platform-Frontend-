
"use client";

import {
  applyToJob,
  calculateJobMatch,
  deleteMyApplication,
  getJob,
  getJobs,
  getMatchSummary,
  getMyApplication,
  getMyApplications,
  getSkillGap,
  searchJobs,
  type CandidateJobMatch,
  type JobFilters,
} from "@/lib/api/jobs.api";

import type { Job } from "@/types/job";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/* =========================================================
   GET ALL CANDIDATE JOBS
========================================================= */

export function useJobs(filters?: JobFilters) {
  return useQuery<Job[], Error>({
    queryKey: ["jobs", filters ?? null],
    queryFn: () => getJobs(filters),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

/* =========================================================
   GET SINGLE JOB
========================================================= */

export function useJob(jobId: string) {
  return useQuery<Job, Error>({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: Boolean(jobId),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

/* =========================================================
   SEARCH JOBS
========================================================= */

export function useSearchJobs(keyword: string) {
  const normalizedKeyword = keyword.trim();

  return useQuery<Job[], Error>({
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

/* =========================================================
   CALCULATE CANDIDATE JOB MATCH
========================================================= */

/**
 * Candidate Job Details should use this mutation.
 *
 * Backend:
 *
 * POST /api/v1/job-matches/:jobId/calculate
 *
 * This endpoint creates/updates the JobMatch record.
 */

export function useCalculateJobMatch() {
  const queryClient = useQueryClient();

  return useMutation<
    CandidateJobMatch,
    Error,
    string
  >({
    mutationFn: (jobId: string) =>
      calculateJobMatch(jobId),

    onSuccess: (data, jobId) => {
      /*
       * Store calculated result in React Query.
       */
      queryClient.setQueryData(
        ["job-match", jobId],
        data,
      );

      /*
       * Skill gap can be refreshed if your backend
       * has a separate skill-gap endpoint.
       */
      queryClient.invalidateQueries({
        queryKey: ["skill-gap", jobId],
      });
    },
  });
}

/* =========================================================
   GET EXISTING JOB MATCH
========================================================= */

/**
 * Keep this hook for other pages if needed.
 *
 * IMPORTANT:
 *
 * Do NOT use this hook on the candidate Job Details page
 * before calculation.
 */

export function useJobMatch(jobId: string) {
  return useQuery<CandidateJobMatch, Error>({
    queryKey: ["job-match", jobId],

    queryFn: async () => {
      throw new Error(
        "Existing job match should only be requested after calculation.",
      );
    },

    enabled: false,
  });
}

/* =========================================================
   SKILL GAP
========================================================= */

/**
 * Candidate Job Details does not need to call this
 * before calculation.
 *
 * Keep it available for pages that specifically need
 * the separate skill-gap endpoint.
 */

export function useSkillGap(jobId: string) {
  return useQuery({
    queryKey: ["skill-gap", jobId],

    queryFn: () => getSkillGap(jobId),

    enabled: false,

    staleTime: 60_000,

    refetchOnWindowFocus: false,

    retry: false,
  });
}

/* =========================================================
   MATCH SUMMARY
========================================================= */

/**
 * Current backend summary endpoint is recruiter-oriented.
 *
 * It checks the job company ownership.
 *
 * Keep this for recruiter pages only.
 */

export function useMatchSummary(jobId: string) {
  return useQuery({
    queryKey: ["match-summary", jobId],

    queryFn: () => getMatchSummary(jobId),

    enabled: Boolean(jobId),

    staleTime: 60_000,

    refetchOnWindowFocus: false,

    retry: false,
  });
}

/* =========================================================
   APPLY TO JOB
========================================================= */

export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyToJob,

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      if (variables?.jobId) {
        queryClient.invalidateQueries({
          queryKey: ["job", variables.jobId],
        });
      }

      // Refresh candidate's applications
      queryClient.invalidateQueries({
        queryKey: ["my-applications"],
      });
    },
  });
}

// =====================================================
// Get My Applications
// =====================================================

export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
  });
}

// =====================================================
// Get Single Application
// =====================================================

export function useMyApplication(applicationId: string) {
  return useQuery({
    queryKey: ["my-application", applicationId],
    queryFn: () => getMyApplication(applicationId),
    enabled: !!applicationId,
  });
}

// =====================================================
// Delete My Application
// =====================================================

export function useDeleteMyApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyApplication,

    onSuccess: (_data, applicationId) => {
      // Refresh application list
      queryClient.invalidateQueries({
        queryKey: ["my-applications"],
      });

      // Remove deleted application from cache
      queryClient.removeQueries({
        queryKey: ["my-application", applicationId],
      });

      // Refresh jobs
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      // Refresh specific application-related job cache if needed
      // This is optional because we don't have jobId here.
    },
  });
}



