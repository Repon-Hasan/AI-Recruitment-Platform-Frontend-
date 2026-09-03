"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  CalendarDays,
  Clock3,
  Sparkles,
  Video,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  interviewApi,
  type InterviewType,
} from "@/lib/api/interview";

interface Props {
  applicationId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

export default function ScheduleInterviewDialog({
  applicationId,
  open,
  onClose,
  onCreated,
}: Props) {
  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [duration, setDuration] =
    useState(30);

  const [type, setType] =
    useState<InterviewType>("VIDEO");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  function handleClose() {
    setError(null);
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (!date || !time) {
      setError(
        "Please select both a date and time.",
      );

      return;
    }

    const localDate = new Date(
      `${date}T${time}`,
    );

    if (
      Number.isNaN(
        localDate.getTime(),
      )
    ) {
      setError(
        "Please enter a valid date and time.",
      );

      return;
    }

    if (
      localDate.getTime() <=
      Date.now()
    ) {
      setError(
        "Interview time must be in the future.",
      );

      return;
    }

    setLoading(true);

    try {
      await interviewApi.create({
        applicationId,

        scheduledAt:
          localDate.toISOString(),

        durationMinutes: duration,

        type,

        title:
          "Candidate Interview",

        notes:
          notes.trim() || undefined,
      });

      await onCreated();

      setDate("");
      setTime("");
      setDuration(30);
      setType("VIDEO");
      setNotes("");

      onClose();
    } catch (error) {
      console.error(
        "Failed to schedule interview:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to schedule the interview.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
          onMouseDown={() => {
            if (!loading) {
              handleClose();
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
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="relative overflow-hidden p-6">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-50 p-3">
                    <Video className="h-6 w-6 text-violet-600" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Schedule Interview
                    </h2>

                    <p className="text-sm text-slate-500">
                      Send an interview invitation
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="interview-date"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Date
                      </label>

                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="interview-date"
                          type="date"
                          value={date}
                          min={
                            new Date()
                              .toISOString()
                              .slice(0, 10)
                          }
                          onChange={(event) =>
                            setDate(
                              event.target
                                .value,
                            )
                          }
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="interview-time"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Time
                      </label>

                      <div className="relative">
                        <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="interview-time"
                          type="time"
                          value={time}
                          onChange={(event) =>
                            setTime(
                              event.target
                                .value,
                            )
                          }
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="interview-duration"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Duration
                    </label>

                    <select
                      id="interview-duration"
                      value={duration}
                      onChange={(event) =>
                        setDuration(
                          Number(
                            event.target.value,
                          ),
                        )
                      }
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 disabled:opacity-50"
                    >
                      <option value={30}>
                        30 minutes
                      </option>

                      <option value={45}>
                        45 minutes
                      </option>

                      <option value={60}>
                        60 minutes
                      </option>

                      <option value={90}>
                        90 minutes
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="interview-type"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Interview type
                    </label>

                    <select
                      id="interview-type"
                      value={type}
                      onChange={(event) =>
                        setType(
                          event.target
                            .value as InterviewType,
                        )
                      }
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 disabled:opacity-50"
                    >
                      <option value="VIDEO">
                        Video interview
                      </option>

                      <option value="PHONE">
                        Phone interview
                      </option>

                      <option value="IN_PERSON">
                        In-person interview
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="interview-notes"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Message
                    </label>

                    <textarea
                      id="interview-notes"
                      value={notes}
                      onChange={(event) =>
                        setNotes(
                          event.target.value,
                        )
                      }
                      rows={4}
                      disabled={loading}
                      placeholder="Add instructions for the candidate..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:bg-white disabled:opacity-50"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />

                      {loading
                        ? "Scheduling..."
                        : "Schedule Interview"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}