
"use client";

import { motion } from "motion/react";

export default function RankingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(
        (item) => (
          <motion.div
            key={item}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay:
                item * 0.08,
            }}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <div className="flex gap-5">
              {/* Avatar */}

              <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-slate-200" />

              {/* Content */}

              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 animate-pulse rounded-lg bg-slate-200" />

                <div className="h-3 w-72 max-w-full animate-pulse rounded-lg bg-slate-100" />

                <div className="flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-100" />

                  <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-100" />

                  <div className="h-6 w-14 animate-pulse rounded-lg bg-slate-100" />
                </div>
              </div>

              {/* Score */}

              <div className="hidden h-14 w-20 animate-pulse rounded-xl bg-slate-100 sm:block" />
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
}

