"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
} from "lucide-react";

export function ContactForm() {
  const shouldReduceMotion = useReducedMotion();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    // Replace this with your API request.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <section className="relative py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left information */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -30,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">
              Contact us
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tell us how we can help
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400">
              Whether you are a candidate looking for your next opportunity or
              a recruiter building your next team, we&apos;d love to hear from
              you.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                  <Mail className="h-5 w-5 text-indigo-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Email support
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    support@hireai.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                  <MessageSquare className="h-5 w-5 text-cyan-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Average response
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 30,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
            className="
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
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10"
                >
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </motion.div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  Message received!
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                  Thanks for reaching out. Our team will review your message
                  and get back to you as soon as possible.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Name
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-white
                          outline-none
                          placeholder:text-slate-600
                          focus:border-indigo-400/50
                          focus:ring-2
                          focus:ring-indigo-500/10
                        "
                      />
                    </div>
                  </div>

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Email
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-white
                          outline-none
                          placeholder:text-slate-600
                          focus:border-indigo-400/50
                          focus:ring-2
                          focus:ring-indigo-500/10
                        "
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="How can we help?"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-indigo-400/50
                      focus:ring-2
                      focus:ring-indigo-500/10
                    "
                  />
                </div>

                {/* Message */}

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us more about your question..."
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-indigo-400/50
                      focus:ring-2
                      focus:ring-indigo-500/10
                    "
                  />
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-indigo-500
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-indigo-500/20
                    transition-all
                    duration-300
                    hover:bg-indigo-400
                    hover:shadow-indigo-500/30
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-600">
                  We respect your privacy and will never sell your information.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}