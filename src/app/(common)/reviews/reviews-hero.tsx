"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle, Sparkles, Star } from "lucide-react";

export function ReviewsHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              mx-auto inline-flex items-center gap-2
              rounded-full
              border border-indigo-400/20
              bg-indigo-500/10
              px-4 py-2
              backdrop-blur-md
            "
          >
            <Sparkles className="h-4 w-4 text-indigo-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300 sm:text-sm">
              Community Reviews
            </span>
          </motion.div>

          {/* Heading */}

          <motion.h1
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 30,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="
              mt-6
              text-4xl
              font-bold
              tracking-tight
              text-white
              sm:text-5xl
              lg:text-6xl
            "
          >
            Real experiences from the{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              HireAI community
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-slate-300
              sm:text-lg
              sm:leading-8
            "
          >
            Discover how candidates and recruiters use HireAI to simplify
            hiring, discover better opportunities, and create meaningful
            professional connections.
          </motion.p>

          {/* Rating */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.9,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          scale: 0,
                          rotate: -30,
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    delay: 0.35 + star * 0.06,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Star
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </div>

            <span className="text-sm text-slate-400">
              Loved by candidates and recruiters
            </span>
          </motion.div>

          {/* Floating visual */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 30,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.45,
            }}
            className="relative mx-auto mt-14 max-w-2xl"
          >
            <div className="absolute -inset-6 rounded-3xl bg-indigo-500/10 blur-3xl" />

            <div
              className="
                relative
                rounded-3xl
                border border-white/10
                bg-white/[0.06]
                p-6
                text-left
                shadow-2xl
                backdrop-blur-xl
                sm:p-8
              "
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                    “HireAI made the entire recruitment process feel much more
                    connected. The AI matching helped me find opportunities
                    that actually matched my skills.”
                  </p>

                  <p className="mt-4 text-sm font-semibold text-white">
                    — HireAI Community Member
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}