"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
        className="relative overflow-hidden rounded-[2rem] border border-indigo-300/20 bg-linear-to-br from-indigo-600/25 via-purple-600/15 to-fuchsia-600/20 p-8 text-center sm:p-16"
      >
        {/* animated glow */}

        <motion.div
          animate={{
            x: [0, 80, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[90px]"
        />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-indigo-200">
            Your next chapter starts here
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Make the next great connection count.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Join a recruitment experience designed around
            potential, precision, and people.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.div
              whileHover={{
                scale: 1.03,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-indigo-50"
              >
                Get started free

                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.03,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10"
              >
                <Play className="h-4 w-4" />

                See how it works
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* FOOTER */}

      <footer className="flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
            <Sparkles className="h-4 w-4" />
          </div>

          <span className="font-semibold">
            HireAI
          </span>
        </div>

        <p>
          Thoughtful hiring for the future of work.
        </p>

        <div className="flex gap-4">
          <Link
            href="/about"
            className="transition hover:text-white"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-white"
          >
            Contact
          </Link>

          <Link
            href="/reviews"
            className="transition hover:text-white"
          >
            Reviews
          </Link>
        </div>
      </footer>
    </section>
  );
}