"use client";

import { motion } from "motion/react";
import {
  LockKeyhole,
  ShieldCheck,
  UserRoundCheck,
  Database,
} from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    title: "Protected accounts",
    description:
      "Authentication and authorization help ensure users access only the parts of the platform appropriate to their role.",
  },
  {
    icon: UserRoundCheck,
    title: "Role-based access",
    description:
      "Candidate, recruiter, and administrator experiences are separated according to their responsibilities.",
  },
  {
    icon: Database,
    title: "Structured data",
    description:
      "Profiles, jobs, applications, and communication are managed through structured backend services.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-focused design",
    description:
      "Sensitive candidate and company information should be handled with appropriate security and privacy controls.",
  },
];

export function SecuritySection() {
  return (
    <section className="bg-slate-950/70 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Built for trust
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Designed with security and control in mind
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Recruitment involves sensitive information. HireAI is designed
            around role-based access, protected accounts, and controlled
            workflows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="inline-flex rounded-xl bg-indigo-500/10 p-3">
                  <Icon className="h-6 w-6 text-indigo-400" />
                </div>

                <h3 className="mt-5 font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}