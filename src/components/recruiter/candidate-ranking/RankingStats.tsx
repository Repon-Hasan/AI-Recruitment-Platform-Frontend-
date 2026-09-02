
"use client";

import {
  BrainCircuit,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import { motion } from "motion/react";

interface RankingStatsProps {
  totalApplicants: number;

  ranked: boolean;

  topScore: number;

  averageScore: number;
}

export default function RankingStats({
  totalApplicants,
  ranked,
  topScore,
  averageScore,
}: RankingStatsProps) {
  const stats = [
    {
      label: "Total Applicants",

      value: totalApplicants,

      icon: Users,

      description:
        "Applications received",
    },

    {
      label: "AI Ranked",

      value: ranked
        ? totalApplicants
        : "—",

      icon: BrainCircuit,

      description: ranked
        ? "Candidates analyzed"
        : "Run AI ranking",
    },

    {
      label: "Top Match",

      value: ranked
        ? `${Math.round(topScore)}%`
        : "—",

      icon: Trophy,

      description:
        "Highest match score",
    },

    {
      label: "Average Match",

      value: ranked
        ? `${Math.round(averageScore)}%`
        : "—",

      icon: Target,

      description:
        "Average candidate score",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(
        (
          {
            label,
            value,
            icon: Icon,
            description,
          },
          index,
        ) => (
          <motion.div
            key={label}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay:
                0.08 * index,
              duration: 0.4,
            }}
            whileHover={{
              y: -3,
            }}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white/90
              p-4
              shadow-sm
              backdrop-blur
              transition-shadow
              hover:shadow-md
              sm:p-5
            "
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                  {label}
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {value}
                </p>

                <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                  {description}
                </p>
              </div>

              <motion.div
                whileHover={{
                  rotate: 5,
                  scale: 1.08,
                }}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                "
              >
                <Icon className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
}

