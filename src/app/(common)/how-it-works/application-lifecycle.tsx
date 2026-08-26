"use client";

import { motion } from "motion/react";
import {
  CheckCircle2,
  FileCheck2,
  Search,
  CalendarCheck,
  Gift,
  UserCheck,
} from "lucide-react";

const stages = [
  {
    icon: FileCheck2,
    title: "Applied",
    description: "Candidate submits an application.",
  },
  {
    icon: Search,
    title: "Under Review",
    description: "Recruiter reviews the application.",
  },
  {
    icon: CheckCircle2,
    title: "Shortlisted",
    description: "Candidate moves forward.",
  },
  {
    icon: CalendarCheck,
    title: "Interview",
    description: "Interview is scheduled.",
  },
  {
    icon: Gift,
    title: "Offer",
    description: "Company makes an offer.",
  },
  {
    icon: UserCheck,
    title: "Hired",
    description: "Candidate joins the team.",
  },
];

export function ApplicationLifecycle() {
  return (
    <section className="bg-slate-950/45 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Application lifecycle
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Every application stays organized
          </h2>

          <p className="mt-5 text-lg text-slate-300">
            Candidates can track progress while recruiters manage their
            hiring pipeline from one place.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {stage.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {stage.description}
                </p>

                {index < stages.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 bg-indigo-100 lg:block" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}