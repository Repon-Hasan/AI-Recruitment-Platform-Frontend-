"use client";

import { motion } from "motion/react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ResumeScoreCard } from "@/components/resume/resume-score-card";
import { RecommendedJobs } from "@/components/jobs/recommended-jobs";
//import { ApplicationsOverview } from "./applications-overview";

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function CandidateDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Good morning 👋"
        description="Here’s what's happening with your career."
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Resume Score"
          value="86%"
          description="+8% this month"
        />

        <StatCard
          title="Applications"
          value="12"
          description="3 this week"
        />

        <StatCard
          title="Interviews"
          value="3"
          description="1 upcoming"
        />

        <StatCard
          title="Job Matches"
          value="27"
          description="5 new matches"
        />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* <div className="xl:col-span-2">
          <ApplicationsOverview />
        </div> */}

        <ResumeScoreCard />
      </div>

      <div className="grid gap-6">
        <RecommendedJobs />
      </div>
    </div>
  );
}