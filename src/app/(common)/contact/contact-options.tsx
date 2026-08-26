"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  BriefcaseBusiness,
  Headphones,
  Mail,
  Users,
} from "lucide-react";

const options = [
  {
    icon: Headphones,
    title: "General Support",
    description:
      "Need help with your account, profile, applications, or platform features?",
    label: "Get Support",
  },
  {
    icon: BriefcaseBusiness,
    title: "For Recruiters",
    description:
      "Want to improve your hiring workflow and discover qualified candidates?",
    label: "Talk to Sales",
  },
  {
    icon: Users,
    title: "For Candidates",
    description:
      "Questions about resumes, applications, job matching, or interviews?",
    label: "Candidate Help",
  },
  {
    icon: Mail,
    title: "Business Inquiry",
    description:
      "Interested in partnerships, integrations, or working with HireAI?",
    label: "Contact Business",
  },
];

export function ContactOptions() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((option, index) => {
            const Icon = option.icon;

            return (
              <motion.div
                key={option.title}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 25,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -7,
                      }
                }
                className="
                  group
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  p-6
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-indigo-400/30
                  hover:bg-white/[0.08]
                  hover:shadow-[0_20px_60px_-20px_rgba(99,102,241,0.3)]
                "
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6 text-indigo-300" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {option.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {option.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-indigo-400">
                  {option.label} →
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}