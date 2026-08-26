"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "Our target is to respond to most messages within 24 hours. Response time may vary depending on the complexity of your request.",
  },
  {
    question: "Can candidates contact recruiters through HireAI?",
    answer:
      "Yes. After the appropriate application or recruitment connection is established, candidates and recruiters can communicate through the platform.",
  },
  {
    question: "Can recruiters use HireAI to find candidates?",
    answer:
      "Yes. Recruiters can create job posts and use candidate discovery and AI-powered matching features to identify relevant candidates.",
  },
  {
    question: "Can I ask for help with my resume?",
    answer:
      "Yes. HireAI is designed to provide AI-powered resume analysis, job matching, skill insights, and other career-related features.",
  },
  {
    question: "Is my information secure?",
    answer:
      "HireAI is designed with security and privacy in mind. Access control, authentication, protected APIs, and appropriate data-handling practices help protect user information.",
  },
];

export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">
            <HelpCircle className="h-6 w-6 text-indigo-300" />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">
            Frequently asked questions
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Before you reach out
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  backdrop-blur-md
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.2,
                    }}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.25,
                  }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-6 text-slate-400">
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}