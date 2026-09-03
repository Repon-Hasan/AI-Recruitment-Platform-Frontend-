// import { DashboardShell } from "@/components/layout/dashboard-shell";
// import { RecruiterDashboard } from "@/features/recruiter/recruiter-workspace";

// export default function RecruiterDashboardPage() {
//   return (
//     <DashboardShell role="recruiter">
//       <RecruiterDashboard />
//     </DashboardShell>
//   );
// }



"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { motion, type Variants } from "motion/react";

import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { recruiterApi } from "@/lib/api/recruiter.api";



interface RecruiterJob {
  id: string;
  title: string;
  status?: string | null;
  _count?: {
    jobApplications?: number;
  };
}

interface Application {
  id: string;
}

interface Company {
  id: string;
  name: string;
}

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

function Stat({
  icon: Icon,
  label,
  value,
  tone = "bg-primary/10 text-primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {label}
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight">
                {value}
              </p>
            </div>

            <div
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                ${tone}
              `}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [applications, setApplications] =
    useState<Application[]>([]);
  const [company, setCompany] =
    useState<Company | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const [
          jobsResult,
          applicationsResult,
          companyResult,
        ] = await Promise.all([
          recruiterApi
            .getJobs()
            .catch(() => []),

          recruiterApi
            .getApplications()
            .catch(() => []),

          recruiterApi
            .getCompany()
            .catch(() => null),
        ]);

        if (!mounted) return;

        setJobs(jobsResult || []);
        setApplications(
          applicationsResult || [],
        );
        setCompany(companyResult);
      } catch (error) {
        if (!mounted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard",
        );
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const published = jobs.filter(
    (job) => job.status === "PUBLISHED",
  ).length;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Recruiter command center
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Build your next great team
              {company
                ? ` at ${company.name}`
                : "."}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Keep your hiring pipeline moving
              with one calm, focused workspace.
            </p>
          </div>

          <Button asChild>
            <a href="/recruiter/jobs">
              <Plus className="mr-2 h-4 w-4" />
              Post a job
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.p
          variants={item}
          className="
            rounded-xl
            bg-destructive/10
            p-3
            text-sm
            text-destructive
          "
        >
          {error}
        </motion.p>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={BriefcaseBusiness}
          label="Total job posts"
          value={jobs.length}
        />

        <Stat
          icon={Sparkles}
          label="Published roles"
          value={published}
          tone="bg-emerald-500/10 text-emerald-600"
        />

        <Stat
          icon={Users}
          label="Applications"
          value={applications.length}
          tone="bg-blue-500/10 text-blue-600"
        />

        <Stat
          icon={Building2}
          label="Company profile"
          value={company ? "Ready" : "Setup"}
          tone="bg-amber-500/10 text-amber-600"
        />
      </div>

      {/* Main cards */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent jobs */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>
                Recent roles
              </CardTitle>

              <CardDescription>
                Your latest hiring activity
              </CardDescription>
            </CardHeader>

            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-2">
                  {jobs
                    .slice(0, 5)
                    .map((job) => (
                      <a
                        key={job.id}
                        href="/recruiter/jobs"
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          border
                          p-4
                          transition-all
                          hover:-translate-y-0.5
                          hover:bg-muted/50
                          hover:shadow-sm
                        "
                      >
                        <div>
                          <p className="font-medium">
                            {job.title}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {job._count
                              ?.jobApplications ||
                              0}{" "}
                            applicants ·{" "}
                            {job.status ||
                              "DRAFT"}
                          </p>
                        </div>

                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <BriefcaseBusiness className="mx-auto h-8 w-8 text-muted-foreground/40" />

                  <p className="mt-3 text-sm font-medium">
                    No jobs yet
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your next hire starts here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Assistant */}
        <motion.div variants={item}>
          <Card
            className="
              h-full
              overflow-hidden
              border-primary/20
              bg-gradient-to-br
              from-primary/10
              via-card
              to-card
            "
          >
            <CardHeader>
              <div
                className="
                  mb-2
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary
                  text-primary-foreground
                "
              >
                <Bot className="h-5 w-5" />
              </div>

              <CardTitle>
                AI recruiting copilot
              </CardTitle>

              <CardDescription>
                Ask about applicants, shortlist
                talent, or compare candidates.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                variant="outline"
                asChild
              >
                <Link href="/recruiter/applications/">
                  Open assistant
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}