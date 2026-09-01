"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createJob,
  updateJob,
  deleteJob,
} from "@/lib/api/jobs.api";

import { queryKeys } from "@/lib/query/query-keys";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.all,
      });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Parameters<typeof updateJob>[1]>;
    }) => updateJob(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.detail(variables.id),
      });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.all,
      });
    },
  });
}