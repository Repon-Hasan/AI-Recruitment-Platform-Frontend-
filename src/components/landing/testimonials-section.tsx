"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Quote,
} from "lucide-react";


import { reveal, stagger } from "./animation";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { testimonials } from "./home-data";
import ParticleWave from "../ui/particle-wave";

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
              <div className="absolute inset-2 z-7 opacity-10">
            <ParticleWave />
            </div>
      <motion.div
        //variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
        }}
        className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
      >
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-indigo-300">
            People behind the progress
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            A better experience,{" "}
            <span className="text-slate-400">
              felt on both sides.
            </span>
          </h2>
        </div>

        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300"
        >
          Read all stories

          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.15,
        }}
        className="grid gap-4 md:grid-cols-3"
      >
       {testimonials.map((testimonial) => (
  <motion.div
    key={testimonial.name}
    whileHover={{
      y: -6,
    }}
  >
    <div className="h-full rounded-3xl border border-white/10 bg-white/[.05] p-6 backdrop-blur-xl transition hover:border-indigo-300/20">
      <Quote className="h-6 w-6 text-indigo-300" />

      <p className="mt-5 leading-7 text-slate-200">
        {testimonial.quote}
      </p>

      <div className="mt-8 border-t border-white/10 pt-4">
        <p className="text-sm font-semibold">
          {testimonial.name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {testimonial.role}
        </p>
      </div>
    </div>
  </motion.div>
))}
      </motion.div>
    </section>
  );
}