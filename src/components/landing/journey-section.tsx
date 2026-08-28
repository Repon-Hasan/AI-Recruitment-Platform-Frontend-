"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  GraduationCap,
  Users,
} from "lucide-react";

import { reveal } from "./animation";
import ParticleWave from "../ui/particle-wave";

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[.05] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function JourneySection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="absolute inset-0 z-40 opacity-100">
    <ParticleWave />
    </div>
      <motion.div
        //variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.25,
        }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-indigo-300">
          One platform, two journeys
        </p>

        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Start where you are.{" "}
          <span className="text-slate-400">
            Grow from there.
          </span>
        </h2>

        <p className="mt-4 leading-7 text-slate-400">
          Whether you are building a career or building a
          team, every step is designed to feel clear and
          personal.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {/* CANDIDATE */}

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
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
          whileHover={{
            y: -8,
          }}
        >
          <Link href="/jobs">
            <GlassCard className="group h-full p-7 transition-all hover:border-indigo-300/30 hover:bg-indigo-400/[.09]">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/15 text-indigo-200">
                  <GraduationCap />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-300" />
              </div>

              <h3 className="mt-8 text-2xl font-semibold">
                For candidates
              </h3>

              <p className="mt-3 max-w-md leading-7 text-slate-400">
                Show the full picture of your skills, find
                roles that fit your potential, and always
                know what comes next.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-indigo-200">
                <span className="rounded-full bg-indigo-300/10 px-3 py-1.5">
                  AI resume insights
                </span>

                <span className="rounded-full bg-indigo-300/10 px-3 py-1.5">
                  Personalized matches
                </span>
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* RECRUITER */}

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
          whileHover={{
            y: -8,
          }}
        >
          <Link href="/recruiter/dashboard">
            <GlassCard className="group h-full p-7 transition-all hover:border-fuchsia-300/30 hover:bg-fuchsia-400/[.09]">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-400/15 text-fuchsia-200">
                  <Users />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-fuchsia-300" />
              </div>

              <h3 className="mt-8 text-2xl font-semibold">
                For hiring teams
              </h3>

              <p className="mt-3 max-w-md leading-7 text-slate-400">
                Create better roles, discover qualified
                people, and turn your pipeline into
                meaningful conversations.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-fuchsia-200">
                <span className="rounded-full bg-fuchsia-300/10 px-3 py-1.5">
                  Talent intelligence
                </span>

                <span className="rounded-full bg-fuchsia-300/10 px-3 py-1.5">
                  Collaborative hiring
                </span>
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}