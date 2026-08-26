"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Quote,
  Star,
  UserRound,
} from "lucide-react";

const reviews = [
  {
    name: "Ayesha Rahman",
    role: "Frontend Developer",
    type: "Candidate",
    avatar: "AR",
    rating: 5,
    review:
      "The AI matching system helped me discover jobs that were much closer to my actual skills and experience than traditional job boards.",
    tags: ["AI Matching", "Job Discovery"],
  },
  {
    name: "Tanvir Hasan",
    role: "Software Engineer",
    type: "Candidate",
    avatar: "TH",
    rating: 5,
    review:
      "I liked how the platform connected my profile, resume, skills, and job preferences. It felt like the recommendations were actually personalized.",
    tags: ["Resume", "Personalization"],
  },
  {
    name: "Nusrat Jahan",
    role: "HR Manager",
    type: "Recruiter",
    avatar: "NJ",
    rating: 5,
    review:
      "HireAI makes it easier to move from job posting to candidate discovery. The structured candidate information saves a lot of time.",
    tags: ["Recruiting", "Candidate Search"],
  },
  {
    name: "Rakib Ahmed",
    role: "Product Designer",
    type: "Candidate",
    avatar: "RA",
    rating: 4,
    review:
      "The application experience is simple and the communication flow makes it easier to understand what happens after applying.",
    tags: ["Application", "Communication"],
  },
  {
    name: "Sarah Khan",
    role: "Talent Acquisition Lead",
    type: "Recruiter",
    avatar: "SK",
    rating: 5,
    review:
      "Having candidate information, applications, matching, and recruiter communication in one ecosystem is a big improvement over disconnected tools.",
    tags: ["Talent", "Workflow"],
  },
  {
    name: "Mahin Chowdhury",
    role: "Backend Developer",
    type: "Candidate",
    avatar: "MC",
    rating: 5,
    review:
      "The platform gives candidates more clarity throughout the hiring journey. I especially like the connection between job requirements and my profile.",
    tags: ["Skills", "Transparency"],
  },
];

export function ReviewsGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
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
            duration: 0.6,
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">
            What people are saying
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Experiences that{" "}
            <span className="text-indigo-400">matter</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-400">
            Feedback from people using HireAI to navigate the modern
            recruitment experience.
          </p>
        </motion.div>

        {/* Reviews */}

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.07,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -8,
                    }
              }
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-white/[0.055]
                p-6
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-indigo-400/30
                hover:bg-white/[0.08]
                hover:shadow-[0_20px_60px_-20px_rgba(99,102,241,0.3)]
              "
            >
              {/* Quote decoration */}

              <div className="absolute right-5 top-5 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                <Quote className="h-12 w-12 text-indigo-300" />
              </div>

              {/* Profile */}

              <div className="flex items-center gap-4">
                <div
                  className="
                    flex h-12 w-12 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-500
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-indigo-500/20
                  "
                >
                  {review.avatar}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {review.name}
                  </h3>

                  <p className="truncate text-xs text-slate-400">
                    {review.role}
                  </p>
                </div>
              </div>

              {/* Type */}

              <div className="mt-5 flex items-center gap-2">
                {review.type === "Recruiter" ? (
                  <BriefcaseBusiness className="h-4 w-4 text-cyan-400" />
                ) : (
                  <UserRound className="h-4 w-4 text-indigo-400" />
                )}

                <span className="text-xs font-medium text-slate-400">
                  {review.type}
                </span>
              </div>

              {/* Rating */}

              <div
                className="mt-4 flex items-center gap-1"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`h-4 w-4 ${
                      starIndex < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-700"
                    }`}
                  />
                ))}
              </div>

              {/* Review */}

              <p className="mt-5 text-sm leading-7 text-slate-300">
                “{review.review}”
              </p>

              {/* Tags */}

              <div className="mt-6 flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      rounded-full
                      border border-white/10
                      bg-white/[0.04]
                      px-3 py-1
                      text-[11px]
                      font-medium
                      text-slate-400
                    "
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Verified */}

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                <span className="text-xs text-slate-500">
                  Verified HireAI community experience
                </span>
              </div>

              {/* Hover line */}

              <div
                aria-hidden="true"
                className="
                  absolute bottom-0 left-1/2
                  h-px w-0
                  -translate-x-1/2
                  bg-gradient-to-r
                  from-transparent
                  via-indigo-400
                  to-transparent
                  transition-all duration-500
                  group-hover:w-3/4
                "
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}