"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Sparkles,
  Users,
} from "lucide-react";
import ParticleWave from "@/components/ui/particle-wave";

export function HowItWorksHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950/70">
      <div className="absolute inset-0 z-40 opacity-100">
          <ParticleWave />
          </div>
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[90px] sm:h-96 sm:w-96 sm:blur-[120px]"
        />

        <motion.div
          animate={{ x: [0, -24, 0], y: [0, 18, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 top-40 h-56 w-56 rounded-full bg-purple-600/10 blur-[80px] sm:right-0 sm:h-72 sm:w-72 sm:blur-[100px]"
        />

        <motion.div
          animate={{ x: [0, 28, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-fuchsia-600/10 blur-[80px] sm:h-64 sm:w-64"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[28px_28px] opacity-70 sm:bg-size-[40px_40px]" />

        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.14)_1px,transparent_1px)] bg-size-[32px_32px] opacity-30"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pb-32 lg:pt-40">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300"
            >
              <Sparkles className="h-4 w-4" />

              How HireAI Works
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              From application to opportunity,
              <span className="block bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            >
              HireAI connects candidates and recruiters through intelligent
              resume analysis, semantic job matching, AI-powered screening,
              communication, and application tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
              >
                Find Jobs
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/register?role=recruiter"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <Users className="h-4 w-4" />
                Hire Talent
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {[
                "AI Resume Analysis",
                "Smart Job Matching",
                "Recruiter Screening",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />

                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* AI visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-indigo-600/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    AI Matching Engine
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    Candidate → Job
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-500/10 p-3">
                  <BrainCircuit className="h-6 w-6 text-indigo-400" />
                </div>
              </div>

              <div className="space-y-5">
                <MatchItem
                  label="React & Next.js"
                  value={95}
                />

                <MatchItem
                  label="TypeScript"
                  value={92}
                />

                <MatchItem
                  label="Experience"
                  value={88}
                />

                <MatchItem
                  label="Location"
                  value={100}
                />
              </div>

              <div className="mt-8 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-5 text-center">
                <p className="text-sm text-indigo-300">
                  Overall Match Score
                </p>

                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-2 text-5xl font-bold text-white"
                >
                  94%
                </motion.p>

                <p className="mt-2 text-sm text-slate-400">
                  Excellent candidate-job fit
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MatchItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-300">{label}</span>

        <span className="text-sm font-medium text-indigo-300">
          {value}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
        />
      </div>
    </div>
  );
}