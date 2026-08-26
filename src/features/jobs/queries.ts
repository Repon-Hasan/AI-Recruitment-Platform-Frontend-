import {
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  getJob,
  getJobs,
  type JobFilters,
} from "@/lib/api/jobs.api";

import { queryKeys } from "@/lib/query/query-keys";

export function jobsQueryOptions(filters?: JobFilters) {
  return queryOptions({
    queryKey: queryKeys.jobs.list(filters ? { ...filters } : undefined),
    queryFn: () => getJobs(filters),
    staleTime: 30 * 1000,
  });
}

export function jobQueryOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => getJob(id),
    enabled: Boolean(id),
  });
}

export function useJobs(filters?: JobFilters) {
  return useQuery(jobsQueryOptions(filters));
}

export function useJob(id: string) {
  return useQuery(jobQueryOptions(id));
}