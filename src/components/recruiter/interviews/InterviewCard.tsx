"use client";

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Video,
} from "lucide-react";

import { motion } from "motion/react";

import type {
  Interview,
} from "@/lib/api/interview";

interface Props {
  interview?: Interview | null;
  onSchedule: () => void;
}

export default function InterviewCard({
  interview,
  onSchedule,
}: Props) {
  if (!interview) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-3xl border border-dashed border-violet-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-50 p-3">
            <Video className="h-5 w-5 text-violet-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              No interview scheduled
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Schedule an interview with this candidate.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSchedule}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-500"
        >
          <CalendarDays className="h-4 w-4" />
          Schedule Interview
        </button>
      </motion.div>
    );
  }

  const date = new Date(
    interview.scheduledAt,
  );

  const isStarted =
    interview.status === "STARTED";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-sm"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-600">
              {isStarted
                ? "Interview in progress"
                : "Upcoming interview"}
            </p>

            <h3 className="text-xl font-semibold text-slate-900">
              {interview.title}
            </h3>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
            {interview.status}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <CalendarDays className="mb-2 h-4 w-4 text-violet-600" />

            <p className="text-xs text-slate-400">
              Date & time
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {date.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <Clock3 className="mb-2 h-4 w-4 text-violet-600" />

            <p className="text-xs text-slate-400">
              Duration
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {interview.durationMinutes}{" "}
              minutes
            </p>
          </div>
        </div>

        {interview.notes && (
          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              Interview notes
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {interview.notes}
            </p>
          </div>
        )}

        {interview.meetingUrl && (
          <a
            href={interview.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Video className="h-4 w-4" />

            {isStarted
              ? "Join Interview"
              : "Open Meeting"}

            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}