"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Community Members",
  },
  {
    icon: MessageSquareQuote,
    value: "5K+",
    label: "Reviews & Stories",
  },
  {
    icon: Sparkles,
    value: "95%",
    label: "Positive Experiences",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Human-Centered",
  },
];

export function ReviewStats() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 20,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.05]
                  p-5
                  text-center
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-indigo-400/30
                  hover:bg-white/[0.08]
                  sm:p-6
                "
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                  <Icon className="h-5 w-5 text-indigo-300" />
                </div>

                <p className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}