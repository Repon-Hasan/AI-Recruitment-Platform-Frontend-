"use client";

import { useEffect, useState } from "react";
import CandidatesPage from "@/components/recruiter/candidates/CandidatesPage";
import { Navbar } from "@/components/layout/navbar";

export interface RecruiterJob {
  id: string;
  title: string;
}

export default function CandidatesRoute() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:5000/api/v1/job/my-jobs",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load jobs (${response.status})`,
          );
        }

        const json = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: {
            jobs?: Array<{
              id: string;
              title: string;
            }>;
          };
        };

        if (!mounted) return;

        const recruiterJobs: RecruiterJob[] =
          json.data?.jobs?.map((job) => ({
            id: job.id,
            title: job.title,
          })) ?? [];

        setJobs(recruiterJobs);
      } catch (err) {
        if (!mounted) return;

        console.error("Failed to load recruiter jobs:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load jobs",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
<div className="relative min-h-screen">


      {/* Candidates */}
      <div className="relative z-20 lg:mt-12">
        <CandidatesPage jobs={jobs} />
      </div>
    </div>
  );
}