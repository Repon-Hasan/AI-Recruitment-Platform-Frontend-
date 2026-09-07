
"use client";

import { useState } from "react";

import {
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";
import { useApplyToJob } from "./useJobs";


export default function ApplyJobDialog({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [open, setOpen] =
    useState(false);

  const [coverLetter, setCoverLetter] =
    useState("");

  const applyMutation =
    useApplyToJob();

  async function handleApply() {
    try {
      await applyMutation.mutateAsync({
        jobId,
        coverLetter,
      });

      setCoverLetter("");
    } catch {
      // handled below
    }
  }

  if (applyMutation.isSuccess) {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">

        <div className="flex items-center gap-3">

          <CheckCircle2 className="h-5 w-5 text-emerald-400" />

          <div>

            <p className="font-semibold text-emerald-300">
              Application submitted
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your application for {jobTitle} has
              been sent successfully.
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] hover:shadow-blue-500/30"
      >
        <Send className="h-4 w-4" />

        Apply for this job
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setOpen(false);
              }
            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-7 shadow-2xl"
            >

              <h2 className="text-2xl font-bold">
                Apply for {jobTitle}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Add an optional message to the
                recruiter.
              </p>

              <textarea
                value={coverLetter}
                onChange={(event) =>
                  setCoverLetter(
                    event.target.value
                  )
                }
                rows={7}
                placeholder="Tell the recruiter why you're a good fit..."
                className="mt-6 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400/50"
              />

              {applyMutation.isError && (
                <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
                  {applyMutation.error instanceof
                  Error
                    ? applyMutation.error.message
                    : "Failed to submit application."}
                </div>
              )}

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  disabled={
                    applyMutation.isPending
                  }
                  onClick={handleApply}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {applyMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Applying...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />

                      Submit application
                    </>
                  )}

                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}