"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  Search,
  Users,
} from "lucide-react";
import ParticleWave from "@/components/ui/particle-wave";

const items = [
  {
    icon: FileText,
    step: "01",
    title: "Candidate Profile",
    description:
      "Candidates create profiles and upload resumes, skills, experience, education, and career preferences.",
  },
  {
    icon: BriefcaseBusiness,
    step: "02",
    title: "Job Intelligence",
    description:
      "Recruiters create structured job posts containing requirements, skills, experience, location, and employment details.",
  },
  {
    icon: BrainCircuit,
    step: "03",
    title: "AI Matching Engine",
    description:
      "AI analyzes candidate and job information to identify meaningful matches instead of relying only on keywords.",
  },
  {
    icon: Search,
    step: "04",
    title: "Intelligent Discovery",
    description:
      "Candidates discover relevant opportunities while recruiters discover qualified candidates.",
  },
  {
    icon: Users,
    step: "05",
    title: "Human Connection",
    description:
      "Once a candidate applies, recruiters and candidates can communicate directly through the platform.",
  },
];

export function PlatformOverview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="platform-overview"
      className="relative isolate overflow-hidden bg-slate-950/70 py-20 sm:py-24 lg:py-32"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Particle animation */}
        <div className="absolute inset-0 opacity-60 sm:opacity-100">
          <ParticleWave />
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/65" />

        {/* Top glow */}
        <div className="absolute left-1/2 top-0 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />

        {/* Grid texture */}
        <div
          className="
            absolute inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300 sm:text-sm">
              One Connected Platform
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything happens in one{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              recruitment ecosystem
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            HireAI brings candidates, recruiters, jobs, AI intelligence, and
            communication together so the entire hiring journey stays
            connected.
          </p>
        </motion.div>

        {/* =========================================================
            PROCESS LINE
        ========================================================== */}

        <div className="relative mt-14 lg:mt-20">
          {/* Desktop connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent lg:block"
          />

          {/* Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 30,
                        }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: 1,
                          y: 0,
                        }
                  }
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -8,
                        }
                  }
                  className="
                    group relative
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.06]
                    p-5
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:border-indigo-400/30
                    hover:bg-white/[0.09]
                    hover:shadow-[0_20px_60px_-20px_rgba(99,102,241,0.35)]
                    sm:p-6
                  "
                >
                  {/* Step + Icon */}
                  <div className="mb-5 flex items-center justify-between">
                    {/* Icon */}
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-xl
                        border border-indigo-400/20
                        bg-indigo-500/10
                        transition-all duration-300
                        group-hover:scale-110
                        group-hover:border-indigo-400/40
                        group-hover:bg-indigo-500/20
                      "
                    >
                      <Icon className="h-6 w-6 text-indigo-300" />
                    </div>

                    {/* Step */}
                    <span className="text-xs font-semibold tracking-widest text-slate-500">
                      {item.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>

                  {/* Bottom accent */}
                  <div
                    aria-hidden="true"
                    className="
                      absolute bottom-0 left-1/2
                      h-px w-0
                      -translate-x-1/2
                      bg-gradient-to-r
                      from-transparent
                      via-indigo-400
                      to-transparent
                      transition-all duration-500
                      group-hover:w-3/4
                    "
                  />
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            BOTTOM MESSAGE
        ========================================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="mx-auto mt-12 max-w-3xl text-center lg:mt-16"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-6 backdrop-blur-sm sm:px-8">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10">
                <BrainCircuit className="h-5 w-5 text-indigo-300" />
              </div>

              <p className="text-sm leading-6 text-slate-300 sm:text-base">
                From the first profile to the final conversation,
                <span className="font-semibold text-white">
                  {" "}
                  AI-powered intelligence
                </span>{" "}
                keeps every step connected.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}