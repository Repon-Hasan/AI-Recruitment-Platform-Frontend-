"use client";

import { motion } from "motion/react";

export default function StatsSection() {
  const stats = [
    {
      value: "4.8×",
      text: "faster candidate discovery",
    },
    {
      value: "92%",
      text: "of teams report better-fit shortlists",
    },
    {
      value: "24/7",
      text: "career and recruiting intelligence",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
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
        className="grid gap-8 rounded-3xl border border-white/10 bg-white/[.05] p-8 backdrop-blur-xl sm:grid-cols-3 sm:p-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.value}
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * 0.15,
            }}
          >
            <p className="text-4xl font-semibold text-indigo-200">
              {stat.value}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {stat.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}