"use client";

import { motion } from "motion/react";
import {
  MessageCircle,
  Send,
  User,
  Building2,
} from "lucide-react";

export function CommunicationFlow() {
  return (
    <section className="bg-slate-950/65 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Communication
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Turn applications into conversations
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Once a candidate applies, the platform creates a connected path
            between the candidate and recruiter so communication doesn&apos;t have
            to move to another platform.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
          <PersonCard
            icon={User}
            title="Candidate"
            description="Applies for a job and starts a conversation when appropriate."
          />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          >
            <MessageCircle className="h-7 w-7" />
          </motion.div>

          <PersonCard
            icon={Building2}
            title="Recruiter"
            description="Reviews applications and communicates with promising candidates."
          />
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-full bg-indigo-50 p-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                TechCorp Recruiter
              </p>

              <p className="text-xs text-slate-500">
                Frontend Developer
              </p>
            </div>
          </div>

          <div className="space-y-4 py-6">
            <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-slate-100 p-4 text-sm text-slate-700">
              Hi! We reviewed your application and would like to discuss the
              role with you.
            </div>

            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-none bg-indigo-600 p-4 text-sm text-white">
              Thank you! I&apos;d be happy to discuss the opportunity.
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <span className="flex-1 text-sm text-slate-400">
              Type your message...
            </span>

            <button className="rounded-lg bg-indigo-600 p-2 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof User;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>

      <h3 className="mt-5 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </motion.div>
  );
}