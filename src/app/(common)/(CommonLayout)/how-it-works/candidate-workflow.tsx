"use client";

import { motion } from "motion/react";
import {
  FileUp,
  BrainCircuit,
  Search,
  Send,
  MessageSquare,
  Video,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileUp,
    title: "Create your profile",
    description:
      "Add your skills, education, experience, projects, preferences, and professional information.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI analyzes your resume",
    description:
      "Our AI extracts relevant skills, experience, education, and other structured information from your resume.",
  },
  {
    number: "03",
    icon: Search,
    title: "Discover matched jobs",
    description:
      "The matching engine compares your profile with available jobs and identifies relevant opportunities.",
  },
  {
    number: "04",
    icon: Send,
    title: "Apply",
    description:
      "Review the job details and submit your application directly through the platform.",
  },
  {
    number: "05",
    icon: MessageSquare,
    title: "Connect with recruiters",
    description:
      "Recruiters can communicate with you after reviewing your application.",
  },
  {
    number: "06",
    icon: Video,
    title: "Interview & move forward",
    description:
      "Prepare for interviews with AI-powered tools and continue through the hiring process.",
  },
];

export function CandidateWorkflow() {
  return (
    <section className="bg-slate-950/65 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
              For candidates
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your journey from resume to opportunity
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Instead of applying blindly, let AI help you understand your
              profile, discover relevant jobs, identify skill gaps, and prepare
              for interviews.
            </p>

            <div className="group relative mt-8 overflow-hidden rounded-2xl border border-indigo-400/20 bg-white/6 p-6 shadow-2xl shadow-indigo-950/20 backdrop-blur-md transition-all duration-300 hover:border-indigo-400/40 hover:bg-white/9">
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl transition-transform duration-500 group-hover:scale-150" />
              <p className="relative font-semibold text-white">
                Candidate experience
              </p>

              <div className="relative mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <p className="flex items-center gap-2"><span className="text-indigo-300">✓</span>Personalized job recommendations</p>
                <p className="flex items-center gap-2"><span className="text-indigo-300">✓</span>Resume analysis</p>
                <p className="flex items-center gap-2"><span className="text-indigo-300">✓</span>Skill gap analysis</p>
                <p className="flex items-center gap-2"><span className="text-indigo-300">✓</span>Application tracking</p>
                <p className="flex items-center gap-2"><span className="text-indigo-300">✓</span>Recruiter messaging</p>
                <p className="flex items-center gap-2"><span className="text-indigo-300">✓</span>AI interview preparation</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-8 hidden h-[calc(100%-64px)] w-px bg-linear-to-b from-indigo-400/60 via-purple-400/30 to-transparent sm:block" />

            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                    }}
                    whileHover={{ x: 4, y: -4 }}
                    className="group relative flex gap-4 sm:gap-5"
                  >
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-slate-900/90 shadow-lg shadow-indigo-950/30 transition-all duration-300 group-hover:border-indigo-300/70 group-hover:bg-indigo-500/20 group-hover:shadow-indigo-500/20">
                      <div className="absolute inset-1 rounded-full border border-indigo-300/10 transition-transform duration-500 group-hover:scale-125" />
                      <Icon className="relative h-5 w-5 text-indigo-300 transition-colors group-hover:text-white" />
                    </div>

                    <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-5 shadow-xl shadow-indigo-950/10 backdrop-blur-md transition-all duration-300 group-hover:border-indigo-400/35 group-hover:bg-white/10 group-hover:shadow-indigo-950/30 sm:p-6">
                      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="text-xs font-semibold tracking-wider text-indigo-300">
                        STEP {step.number}
                      </span>

                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {step.title}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}