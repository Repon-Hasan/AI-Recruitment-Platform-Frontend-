

"use client";

import { motion } from "motion/react";
import { ArrowRight, BriefcaseBusiness, Sparkles } from "lucide-react";

export function HeroContent() {
  return (
    <div className="relative z-10 mx-auto flex min-h-180 max-w-7xl items-center px-6 py-24">
      <div className="max-w-3xl">

        {/* =====================================================
            AI BADGE
        ====================================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mb-6 inline-flex"
        >
          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            className="group relative overflow-hidden rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 shadow-lg shadow-indigo-500/10 backdrop-blur-md"
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
              initial={{
                x: "-100%",
              }}
              animate={{
                x: "100%",
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />

            <span className="relative z-10 flex items-center gap-2">
              {/* Pulsing dot */}
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-indigo-400"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />

                <span className="relative h-2 w-2 rounded-full bg-indigo-400" />
              </span>

              <span>
                AI-Powered Recruitment Platform
              </span>

              <motion.span
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-4 w-4 text-purple-400" />
              </motion.span>
            </span>
          </motion.div>
        </motion.div>

        {/* =====================================================
            MAIN HEADING
        ====================================================== */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          <motion.span
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            className="block"
          >
            Find the right talent.
          </motion.span>

          {/* Gradient heading */}
          <motion.span
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
            className="mt-2 block bg-linear-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
          >
            Build your future with AI.
          </motion.span>
        </motion.h1>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}
        <motion.p
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.55,
            ease: "easeOut",
          }}
          className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
        >
          Connect talented candidates with the right
          opportunities using{" "}
          <span className="font-medium text-indigo-300">
            AI-powered resume analysis
          </span>
          ,{" "}
          <span className="font-medium text-purple-300">
            smart job matching
          </span>
          , and intelligent recruitment workflows.
        </motion.p>

        {/* =====================================================
            CTA BUTTONS
        ====================================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.7,
          }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          {/* Find Jobs */}
          <motion.button
            whileHover={{
              scale: 1.04,
              y: -2,
              boxShadow:
                "0 15px 35px rgba(99, 102, 241, 0.35)",
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition"
          >
            {/* Button shimmer */}
            <motion.span
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              initial={{
                x: "-100%",
              }}
              whileHover={{
                x: "100%",
              }}
              transition={{
                duration: 0.7,
              }}
            />

            <span className="relative z-10">
              Find Jobs
            </span>

            <ArrowRight
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>

          {/* Hire Talent */}
          <motion.button
            whileHover={{
              scale: 1.04,
              y: -2,
              backgroundColor: "rgba(255,255,255,0.10)",
              borderColor: "rgba(129,140,248,0.45)",
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition"
          >
            <BriefcaseBusiness className="h-4 w-4 text-indigo-300 transition-transform duration-300 group-hover:scale-110" />

            Hire Talent
          </motion.button>
        </motion.div>

        {/* =====================================================
            TRUST INDICATORS
        ====================================================== */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.95,
          }}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            AI-powered matching
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
            Smart resume analysis
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
            Faster hiring
          </div>
        </motion.div>

      </div>
    </div>
  );
}

