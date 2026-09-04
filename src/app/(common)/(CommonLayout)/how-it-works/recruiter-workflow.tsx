"use client";

import { motion } from "motion/react";
import {
  Building2,
  Briefcase,
  BrainCircuit,
  Users,
  MessageSquare,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Create your company",
    description:
      "Build a professional company profile containing your organization information, culture, website, and hiring details.",
  },
  {
    number: "02",
    icon: Briefcase,
    title: "Create a job",
    description:
      "Define the position, responsibilities, required skills, preferred skills, experience level, location, salary, and employment type.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Let AI analyze applications",
    description:
      "AI analyzes candidate profiles and resumes against the requirements of your job.",
  },
  {
    number: "04",
    icon: Users,
    title: "Review ranked candidates",
    description:
      "Recruiters can quickly identify candidates who appear to be strong matches based on the available information.",
  },
  {
    number: "05",
    icon: MessageSquare,
    title: "Start a conversation",
    description:
      "Contact candidates through the platform and continue communication in one centralized place.",
  },
  {
    number: "06",
    icon: UserCheck,
    title: "Interview & hire",
    description:
      "Move qualified candidates through the application pipeline until the final hiring decision.",
  },
];

export function RecruiterWorkflow() {
  return (
    <section className="bg-slate-950/45 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute left-6 top-8 hidden h-[calc(100%-64px)] w-px bg-indigo-100 sm:block" />

              <div className="space-y-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.08,
                      }}
                      className="relative flex gap-5"
                    >
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-white shadow-sm">
                        <Icon className="h-5 w-5 text-indigo-600" />
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <span className="text-xs font-semibold text-indigo-600">
                          STEP {step.number}
                        </span>

                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                          {step.title}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-32 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              For recruiters
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From job posting to hiring
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Reduce repetitive screening work and give recruiters a clearer
              way to discover, evaluate, communicate with, and manage
              candidates.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="font-semibold text-slate-900">
                Recruiter experience
              </p>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p>✓ Structured job creation</p>
                <p>✓ AI candidate screening</p>
                <p>✓ Candidate ranking</p>
                <p>✓ Application management</p>
                <p>✓ Recruiter-candidate messaging</p>
                <p>✓ Hiring pipeline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}