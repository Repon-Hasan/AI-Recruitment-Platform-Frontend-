"use client";

import {
  Award,
  Briefcase,
  ChevronRight,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { RankedCandidate } from "@/services/candidate-ranking.api";

interface CandidateCardProps {
  candidate: RankedCandidate;
  rank?: number;
  index: number;
  ranked: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-indigo-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function getScoreBackground(score: number): string {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-indigo-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export default function CandidateCard({
  candidate,
  rank,
  index,
  ranked,
}: CandidateCardProps) {
  const score = Math.max(
    0,
    Math.min(100, Number(candidate.matchScore ?? candidate.score ?? 0))
  );

  const safeRank = rank ?? 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/60 sm:p-6"
    >
      {/* Top Rank Highlight Accent */}
      {ranked && safeRank > 0 && safeRank <= 3 && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="absolute left-0 top-0 h-full w-1.5 origin-top bg-gradient-to-b from-indigo-500 via-violet-500 to-blue-500"
        />
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Rank Badge */}
        {ranked && safeRank > 0 && (
          <div className="flex shrink-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold transition-colors ${
                safeRank === 1
                  ? "bg-amber-100 text-amber-700"
                  : safeRank === 2
                  ? "bg-slate-100 text-slate-700"
                  : safeRank === 3
                  ? "bg-orange-100 text-orange-700"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {safeRank <= 3 ? <Award className="h-5 w-5" /> : `#${safeRank}`}
            </div>
          </div>
        )}

        {/* Avatar */}
        {candidate.profileImage ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-4 ring-slate-100">
            <Image
              src={candidate.profileImage}
              alt={`${candidate.name}'s profile picture`}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white ring-4 ring-indigo-50">
            {candidate.name?.charAt(0).toUpperCase() || "C"}
          </div>
        )}

        {/* Info Header */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-slate-950 sm:text-lg">
              {candidate.name}
            </h3>

            {ranked && score >= 85 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                <Sparkles className="h-3 w-3" />
                Top Match
              </span>
            )}
          </div>

          {candidate.email && (
            <p className="mt-1 truncate text-sm text-slate-500">
              {candidate.email}
            </p>
          )}

          {/* Meta Indicators */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            {candidate.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {candidate.location}
              </span>
            )}

            {candidate.experience != null && (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                {candidate.experience}{" "}
                {candidate.experience === 1 ? "year" : "years"} experience
              </span>
            )}
          </div>

          {/* Skills Badges */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {candidate.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}

              {candidate.skills.length > 6 && (
                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                  +{candidate.skills.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Score & Meter */}
        <div className="flex shrink-0 items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Match
            </p>
            <p className={`text-3xl font-black ${getScoreColor(score)}`}>
              {Math.round(score)}%
            </p>
          </div>

          <div className="relative hidden h-14 w-14 sm:block">
            <svg viewBox="0 0 36 36" className="-rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-100"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className={getScoreColor(score)}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${score} 100` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className={`h-4 w-4 ${getScoreColor(score)}`} />
            </div>
          </div>

          <button
            type="button"
            aria-label={`View ${candidate.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Dynamic Breakdown Section */}
      <AnimatePresence>
        {ranked && candidate.breakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 border-t border-slate-100 pt-5"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreItem label="Skills" value={candidate.breakdown.skillScore} />
              <ScoreItem label="Experience" value={candidate.breakdown.experienceScore} />
              <ScoreItem label="Semantic" value={candidate.breakdown.semanticScore} />
              <ScoreItem label="Location" value={candidate.breakdown.locationScore} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Explanation Section */}
      {ranked && candidate.explanation && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Analysis
            </span>
          </div>
          <p className="text-sm leading-6 text-slate-600">{candidate.explanation}</p>
        </div>
      )}

      {/* Resume Section */}
      {candidate.resumeUrl && (
        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <a
            href={candidate.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            View resume
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </motion.article>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500">{label}</span>
        <span className="text-[11px] font-bold text-slate-700">
          {Math.round(safeValue)}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${getScoreBackground(safeValue)}`}
        />
      </div>
    </div>
  );
}