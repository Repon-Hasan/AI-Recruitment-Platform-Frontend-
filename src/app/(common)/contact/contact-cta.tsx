"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

export function ContactCta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 30,
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
            duration: 0.7,
          }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-indigo-400/20
            bg-gradient-to-br
            from-indigo-500/10
            via-white/[0.04]
            to-cyan-500/10
            p-8
            text-center
            backdrop-blur-xl
            sm:p-12
            lg:p-16
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              left-1/2
              top-0
              h-56
              w-[500px]
              -translate-x-1/2
              rounded-full
              bg-indigo-500/15
              blur-3xl
            "
          />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Sparkles className="h-6 w-6 text-indigo-300" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to make hiring smarter?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Explore HireAI and discover how AI-powered recruitment can
              connect the right candidates with the right opportunities.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-indigo-500
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-indigo-500/20
                  transition-all
                  duration-300
                  hover:bg-indigo-400
                  sm:w-auto
                "
              >
                Get Started

                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/how-it-works"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-slate-200
                  transition-all
                  duration-300
                  hover:bg-white/[0.08]
                  sm:w-auto
                "
              >
                <BriefcaseBusiness className="h-4 w-4" />

                Explore HireAI
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}