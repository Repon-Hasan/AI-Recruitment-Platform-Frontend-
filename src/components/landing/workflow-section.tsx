"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";


import { reveal, stagger } from "./animation";
import { workflow } from "./home-data";
import ParticleWave from "../ui/particle-wave";


export default function WorkflowSection() {
  return (
    <section className="border-y border-white/10 bg-slate-950/40">
          
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-indigo-300">
              How it works
            </p>

            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Less noise. More{" "}
              <span className="text-indigo-300">
                momentum.
              </span>
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-slate-400">
              A thoughtful workflow should make room for
              better decisions—not add another tab to your
              day.
            </p>

            <Link
              href="/how-it-works"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300"
            >
              Explore the workflow

              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {workflow.map(
              ({
                number,
                icon: Icon,
                title,
                text,
              }) => (
                <motion.div
                  variants={reveal}
                  key={number}
                  whileHover={{
                    y: -6,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[.04] p-5 transition-colors hover:border-indigo-300/20 hover:bg-white/[.07]"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-indigo-300" />

                    <span className="text-xs font-semibold text-slate-600">
                      {number}
                    </span>
                  </div>

                  <h3 className="mt-12 font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {text}
                  </p>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}