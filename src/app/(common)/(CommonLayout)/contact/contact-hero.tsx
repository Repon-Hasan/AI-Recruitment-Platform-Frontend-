"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  Headphones,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export function ContactHero() {
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
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-indigo-400/20
              bg-indigo-500/10
              px-4
              py-2
              backdrop-blur-md
            "
          >
            <Sparkles className="h-4 w-4 text-indigo-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300 sm:text-sm">
              We&apos;re here to help
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
            Let&apos;s build the future of{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              recruitment
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
            Have a question, need help with your account, or want to learn
            how HireAI can improve your recruitment workflow? Our team is here
            to help.
          </motion.p>

          {/* Response information */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.95,
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
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-xs font-medium text-emerald-300">
                Support team online
              </span>
            </div>

            <span className="text-sm text-slate-500">
              Typical response within 24 hours
            </span>
          </motion.div>
        </div>

        {/* Floating cards */}

        <div className="relative mx-auto mt-16 max-w-4xl">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 40,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
            className="
              relative
              mx-auto
              max-w-2xl
              rounded-3xl
              border
              border-white/10
              bg-white/[0.06]
              p-6
              shadow-2xl
              backdrop-blur-xl
              sm:p-8
            "
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10">
                <MessageCircle className="h-6 w-6 text-indigo-300" />
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  Need help?
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Tell us what you&apos;re trying to accomplish and our team
                  will help you find the right solution.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Left floating element */}

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -10, 0],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -left-4
              top-1/2
              hidden
              -translate-y-1/2
              rounded-2xl
              border
              border-white/10
              bg-white/[0.06]
              p-4
              backdrop-blur-xl
              lg:block
            "
          >
            <Headphones className="h-6 w-6 text-cyan-400" />
          </motion.div>

          {/* Right floating element */}

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, 10, 0],
                  }
            }
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -right-4
              top-1/2
              hidden
              -translate-y-1/2
              rounded-2xl
              border
              border-white/10
              bg-white/[0.06]
              p-4
              backdrop-blur-xl
              lg:block
            "
          >
            <MessageCircle className="h-6 w-6 text-violet-400" />
          </motion.div>
        </div>

        {/* Scroll indicator */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, 6, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-12 flex justify-center text-slate-500"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </div>
    </section>
  );
}