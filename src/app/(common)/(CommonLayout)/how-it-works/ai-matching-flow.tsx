"use client";

import { motion } from "motion/react";
import {
  ArrowDown,
  BrainCircuit,
  FileText,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

export function AIMatchingFlow() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex rounded-xl bg-indigo-500/10 p-3">
            <BrainCircuit className="h-7 w-7 text-indigo-400" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-400">
            AI matching engine
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How AI connects candidates with jobs
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Instead of relying only on simple keyword matching, the platform
            can analyze multiple dimensions of candidate and job information to
            produce a more meaningful compatibility signal.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <FlowCard
            icon={FileText}
            title="Candidate data"
            items={[
              "Resume",
              "Skills",
              "Experience",
              "Education",
              "Projects",
            ]}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/10">
              <div className="absolute inset-3 animate-pulse rounded-full border border-purple-400/20" />

              <BrainCircuit className="relative h-12 w-12 text-indigo-400" />
            </div>

            <p className="mt-5 font-semibold text-white">
              AI Analysis
            </p>

            <p className="mt-2 text-center text-sm text-slate-400">
              Understands candidate and job requirements
            </p>
          </motion.div>

          <FlowCard
            icon={BriefcaseBusiness}
            title="Job requirements"
            items={[
              "Required skills",
              "Experience",
              "Education",
              "Location",
              "Preferences",
            ]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-2xl rounded-3xl border border-indigo-400/20 bg-white/[0.04] p-8 text-center backdrop-blur"
        >
          <Sparkles className="mx-auto h-6 w-6 text-indigo-400" />

          <h3 className="mt-4 text-xl font-semibold text-white">
            Example match result
          </h3>

          <div className="mt-6 text-6xl font-bold text-white">
            94%
          </div>

          <p className="mt-2 text-slate-400">
            Strong candidate-job compatibility
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["Skills", "96%"],
              ["Experience", "91%"],
              ["Education", "88%"],
              ["Location", "100%"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl bg-white/5 p-4 text-left"
              >
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">
                    {label}
                  </span>

                  <span className="text-sm font-semibold text-indigo-300">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FlowCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof FileText;
  title: string;
  items: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
    >
      <div className="inline-flex rounded-xl bg-white/5 p-3">
        <Icon className="h-6 w-6 text-indigo-400" />
      </div>

      <h3 className="mt-5 font-semibold text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 text-sm text-slate-400"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />

            {item}
          </div>
        ))}
      </div>
    </motion.div>
  );
}