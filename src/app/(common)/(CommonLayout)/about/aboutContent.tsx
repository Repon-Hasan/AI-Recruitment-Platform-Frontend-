
"use client";

import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseIcon,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import ImagesSt from "./imagesSt";

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-transparent py-24 sm:py-32"
    >
      {/* =====================================================
          BACKGROUND GLOW
          The global ParticleWave from RootLayout stays behind.
      ====================================================== */}

      <motion.div
        className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[130px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -right-40 bottom-20 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[140px]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* =====================================================
          CONTAINER
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* ===================================================
            SECTION HEADER
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-5 inline-flex"
          >
            <div className="relative overflow-hidden rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 backdrop-blur-md">
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
                  repeatDelay: 3,
                }}
              />

              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />

                About HireAI
              </span>
            </div>
          </motion.div>

          {/* Heading */}

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Recruitment should be{" "}
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              smarter.
            </span>
          </h2>

          <motion.p
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.2,
              duration: 0.7,
            }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400"
          >
            HireAI connects talented candidates with the right
            companies using artificial intelligence, intelligent
            matching, and automated recruitment workflows.
          </motion.p>
        </motion.div>

        {/* ===================================================
            MAIN ABOUT CONTENT
        ==================================================== */}

        <div className="mt-20 grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* =================================================
              LEFT — IMAGE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative"
          >
            {/* Main glow */}

            <div className="absolute left-1/2 top-1/2 h-87.5 w-87.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[100px]" />

            {/* Main image card */}

            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 0.5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-3 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl">

                {/* <Image
                  src="/images/about-recruitment.jpg"
                  alt="AI powered recruitment and candidate matching"
                  fill
                  className="object-cover"
                /> */}
                <ImagesSt></ImagesSt>

                {/* Image gradient */}

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* AI scanning line */}

                <motion.div
                  animate={{
                    top: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_rgba(129,140,248,0.8)]"
                />

                {/* AI Analysis label */}

                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20">
                    <BrainCircuit className="h-5 w-5 text-indigo-400" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      AI Analysis
                    </p>

                    <p className="text-sm font-semibold text-white">
                      Candidate matching
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                FLOATING MATCH CARD
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 top-10 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:-right-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Target className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Match Score
                  </p>

                  <p className="text-lg font-bold text-emerald-400">
                    94%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                FLOATING AI CARD
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 -left-4 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:-left-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    AI Processing
                  </p>

                  <p className="text-sm font-semibold text-white">
                    Resume analyzed
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* =================================================
              RIGHT — CONTENT
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Intelligent Recruitment
            </span>

            <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Connecting{" "}
              <span className="text-indigo-400">
                people
              </span>{" "}
              with{" "}
              <span className="text-purple-400">
                possibilities.
              </span>
            </h3>

            <p className="mt-6 text-base leading-8 text-slate-400">
              Traditional recruitment can be slow, repetitive,
              and difficult to scale. HireAI brings candidates,
              recruiters, and intelligent technology together
              in one platform.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-400">
              Candidates can analyze their resumes, discover
              relevant jobs, understand their skill gaps, and
              communicate directly with recruiters. Companies
              can publish jobs, analyze applicants, discover
              qualified talent, and make better hiring
              decisions.
            </p>

            {/* =================================================
                FEATURES
            ================================================== */}

            <div className="mt-8 space-y-4">

              {/* Feature 1 */}

              <motion.div
                whileHover={{
                  x: 6,
                }}
                className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 transition hover:border-indigo-400/20 hover:bg-white/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                  <FileSearch className="h-5 w-5 text-indigo-400" />
                </div>

                <div>
                  <h4 className="font-semibold text-white">
                    AI Resume Analysis
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Extract skills, experience, education, and
                    important information from resumes
                    automatically.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}

              <motion.div
                whileHover={{
                  x: 6,
                }}
                className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 transition hover:border-purple-400/20 hover:bg-white/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>

                <div>
                  <h4 className="font-semibold text-white">
                    Intelligent Job Matching
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Match candidate skills and experience with
                    relevant job requirements using AI.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}

              <motion.div
                whileHover={{
                  x: 6,
                }}
                className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 transition hover:border-emerald-400/20 hover:bg-white/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <h4 className="font-semibold text-white">
                    Human + AI Collaboration
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Give recruiters better insights while keeping
                    humans in control of important hiring
                    decisions.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA */}

            <motion.div
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
                delay: 0.3,
              }}
              className="mt-8"
            >
              <motion.a
                href="/about"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20"
              >
                Learn more about HireAI

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* ===================================================
            STATISTICS
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mt-24 grid overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Stat 1 */}

          <Stat
            value="10K+"
            label="Candidates"
            icon={Users}
            color="text-indigo-400"
          />

          {/* Stat 2 */}

          <Stat
            value="2.5K+"
            label="Job Opportunities"
            icon={BriefcaseIcon}
            color="text-purple-400"
          />

          {/* Stat 3 */}

          <Stat
            value="94%"
            label="AI Match Accuracy"
            icon={Target}
            color="text-emerald-400"
          />

          {/* Stat 4 */}

          <Stat
            value="70%"
            label="Faster Screening"
            icon={Zap}
            color="text-yellow-400"
          />
        </motion.div>

        {/* ===================================================
            BOTTOM MESSAGE
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.97,
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
          className="mx-auto mt-16 max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />

            Built to make recruitment more intelligent,
            transparent, and human-centered.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   STAT COMPONENT
========================================================= */

function Stat({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
      className="group relative border-white/10 p-6 transition sm:border-r lg:last:border-r-0"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
          <Icon
            className={`h-5 w-5 ${color}`}
          />
        </div>

        <div>
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="text-2xl font-bold text-white"
          >
            {value}
          </motion.p>

          <p className="mt-1 text-xs text-slate-500">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}


