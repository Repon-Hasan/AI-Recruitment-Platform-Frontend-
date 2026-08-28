"use client";

import { motion } from "motion/react";
import {
  BarChart3,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";

export default function IntelligenceSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        
        {/* AI CARD */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
            rotateY: -12,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            rotateY: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <div className="rounded-3xl border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <WandSparkles className="h-4 w-4 text-indigo-300" />

                <span className="text-sm font-medium">
                  Candidate intelligence
                </span>
              </div>

              <span className="text-xs text-emerald-300">
                Updated now
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-2xl bg-white/5 p-5">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-fuchsia-400 text-2xl font-semibold">
                  AR
                </div>

                <p className="mt-4 text-center font-semibold">
                  Alex Rahman
                </p>

                <p className="text-center text-xs text-slate-400">
                  Full-stack engineer
                </p>

                <div className="mt-5 flex justify-center">
                  <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    Strong match
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <ScoreBar
                  title="Technical fit"
                  value={92}
                  label="92%"
                />

                <ScoreBar
                  title="Experience fit"
                  value={86}
                  label="86%"
                />

                <ScoreBar
                  title="Culture alignment"
                  value={90}
                  label="90%"
                />

                <div className="rounded-2xl border border-indigo-300/15 bg-indigo-300/10 p-4 text-xs leading-5 text-indigo-100">
                  Strong evidence of shipping production
                  systems and mentoring cross-functional
                  teams.
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CONTENT */}

        <motion.div
          initial={{
            opacity: 0,
            x: 30,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-indigo-300">
            Intelligence, not automation
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Technology that makes the{" "}
            <span className="text-indigo-300">
              human signal louder.
            </span>
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-slate-400">
            AI handles the pattern-finding so people can
            focus on context, curiosity, and the
            conversations that make a great hire.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />

              <div>
                <p className="font-medium">
                  Responsible by default
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Transparent signals that support—not
                  replace—your judgment.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <BarChart3 className="mt-1 h-5 w-5 shrink-0 text-indigo-300" />

              <div>
                <p className="font-medium">
                  Built for clarity
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Useful insights at the moment you need
                  them.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ScoreBar({
  title,
  value,
  label,
}: {
  title: string;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-slate-400">
          {title}
        </span>

        <span className="text-indigo-300">
          {label}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: `${value}%`,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-indigo-400"
        />
      </div>
    </div>
  );
}