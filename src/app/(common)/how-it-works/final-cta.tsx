"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-950/65 py-24 text-white sm:py-32">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50"
        >
          <Sparkles className="h-7 w-7 text-indigo-600" />
        </motion.div>

        <h2 className="mt-7 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Ready to make recruitment smarter?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Whether you&apos;re searching for your next opportunity or building your
          next team, HireAI brings the entire recruitment journey together.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </a>

          <a
            href="/jobs"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Explore Jobs
          </a>
        </div>
      </div>
    </section>
  );
}