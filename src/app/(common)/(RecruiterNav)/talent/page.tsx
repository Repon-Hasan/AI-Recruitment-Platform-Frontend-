"use client";

import { useEffect, useState } from "react";

import CandidatesPage from "@/components/recruiter/candidates/CandidatesPage";

export interface RecruiterJob {
  id: string;
  title: string;
}

interface JobsApiResponse {
  success?: boolean;
  message?: string;
  data?:
    | RecruiterJob[]
    | {
        jobs?: RecruiterJob[];
        data?: RecruiterJob[];
      };
  jobs?: RecruiterJob[];
}

export default function CandidatesRoute() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:5000/api/v1/job/my-jobs",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load jobs (${response.status})`,
          );
        }

        const json =
          (await response.json()) as JobsApiResponse;

        console.log(
          "Recruiter jobs API response:",
          json,
        );

        /*
         * ----------------------------------------------------
         * Handle different possible backend response shapes.
         *
         * Shape 1:
         * {
         *   success: true,
         *   data: {
         *     jobs: [...]
         *   }
         * }
         *
         * Shape 2:
         * {
         *   success: true,
         *   data: [...]
         * }
         *
         * Shape 3:
         * {
         *   success: true,
         *   jobs: [...]
         * }
         * ----------------------------------------------------
         */

        let recruiterJobs: RecruiterJob[] = [];

        if (Array.isArray(json.data)) {
          recruiterJobs = json.data;
        } else if (
          json.data &&
          typeof json.data === "object" &&
          Array.isArray(json.data.jobs)
        ) {
          recruiterJobs = json.data.jobs;
        } else if (
          json.data &&
          typeof json.data === "object" &&
          Array.isArray(json.data.data)
        ) {
          recruiterJobs = json.data.data;
        } else if (Array.isArray(json.jobs)) {
          recruiterJobs = json.jobs;
        }

        /*
         * ----------------------------------------------------
         * Only keep valid jobs.
         * ----------------------------------------------------
         */

        const normalizedJobs = recruiterJobs
          .filter(
            (job) =>
              typeof job?.id === "string" &&
              job.id.trim().length > 0 &&
              typeof job?.title === "string",
          )
          .map((job) => ({
            id: job.id,
            title: job.title,
          }));

        console.log(
          "Normalized recruiter jobs:",
          normalizedJobs,
        );

        if (!mounted) {
          return;
        }

        setJobs(normalizedJobs);

        if (normalizedJobs.length === 0) {
          setError(
            "No recruiter jobs were found. Please create a job first.",
          );
        }
      } catch (err) {
        console.error(
          "Failed to load recruiter jobs:",
          err,
        );

        if (!mounted) {
          return;
        }

        setJobs([]);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load recruiter jobs.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-20 lg:mt-12">
        <CandidatesPage
          jobs={jobs}
        />
      </div>
    </div>
  );
}