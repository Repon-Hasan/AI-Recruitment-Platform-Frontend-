"use client";

import Link from "next/link";
import { motion } from "motion/react";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Candidate,
  JobMatch,
} from "@/lib/api/candidates";

interface CandidateCardProps {
  candidate: Candidate;
  match?: JobMatch;
  index: number;
}

/* =========================================================
   Helpers
========================================================= */

function getName(candidate: Candidate): string {
  return (
    candidate.name ??
    candidate.candidateProfile?.name ??
    candidate.user?.name ??
    "Unnamed Candidate"
  );
}

function getTitle(candidate: Candidate): string {
  return (
    candidate.title ??
    candidate.headline ??
    candidate.candidateProfile?.title ??
    candidate.candidateProfile?.headline ??
    "Professional Candidate"
  );
}

function getLocation(candidate: Candidate): string {
  return (
    candidate.location ??
    candidate.candidateProfile?.location ??
    "Location not specified"
  );
}

function getExperience(candidate: Candidate): number | null {
  return (
    candidate.experience ??
    candidate.yearsOfExperience ??
    candidate.candidateProfile?.experience ??
    candidate.candidateProfile?.yearsOfExperience ??
    null
  );
}

function getSkills(candidate: Candidate): string[] {
  const skills =
    candidate.skills ??
    candidate.candidateProfile?.skills ??
    [];

  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return skill;
      }

      return skill.name ?? "";
    })
    .filter(Boolean);
}

function getScore(match?: JobMatch): number | null {
  if (!match) {
    return null;
  }

  const value =
    match.matchScore ??
    match.score ??
    match.percentage ??
    null;

  if (typeof value !== "number") {
    return null;
  }

  return Math.round(value <= 1 ? value * 100 : value);
}

/* =========================================================
   Component
========================================================= */

export default function CandidateCard({
  candidate,
  match,
  index,
}: CandidateCardProps) {
  const name = getName(candidate);
  const title = getTitle(candidate);
  const location = getLocation(candidate);
  const experience = getExperience(candidate);
  const skills = getSkills(candidate);
  const score = getScore(match);

  const candidateId =
    candidate.id ??
    candidate.candidateProfile?.id ??
    candidate.userId;

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isStrongMatch = score !== null && score >= 80;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.25,
          ease: "easeOut",
        },
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-slate-950/50
        p-5
        shadow-2xl
        shadow-black/20
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:border-indigo-400/30
        hover:bg-slate-950/65
        hover:shadow-indigo-950/20
      "
    >
      {/* =====================================================
          Background Effects
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      >
        <div
          className="
            absolute
            -right-24
            -top-24
            h-56
            w-56
            rounded-full
            bg-indigo-500/15
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-24
            -left-24
            h-56
            w-56
            rounded-full
            bg-purple-500/10
            blur-3xl
          "
        />
      </div>

      {/* Top shine */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-linear-to-r
          from-transparent
          via-indigo-400/40
          to-transparent
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      <div className="relative z-10">
        {/* ===================================================
            Header
        =================================================== */}

        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {/* Avatar */}

            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative shrink-0"
            >
              {candidate.image ||
              candidate.profileImage ||
              candidate.avatar ||
              candidate.user?.image ? (
                <img
                  src={
                    candidate.image ??
                    candidate.profileImage ??
                    candidate.avatar ??
                    candidate.user?.image ??
                    ""
                  }
                  alt={name}
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    object-cover
                    ring-2
                    ring-white/10
                    shadow-xl
                    shadow-black/30
                    transition-all
                    duration-300
                    group-hover:ring-indigo-400/30
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-indigo-400/20
                    bg-linear-to-br
                    from-indigo-500/20
                    via-purple-500/15
                    to-slate-900/80
                    text-sm
                    font-bold
                    text-indigo-200
                    shadow-lg
                    shadow-indigo-950/20
                    ring-1
                    ring-white/5
                  "
                >
                  {initials || (
                    <UserRound className="h-5 w-5" />
                  )}
                </div>
              )}

              {/* Online-style indicator */}

              <span
                className="
                  absolute
                  -bottom-0.5
                  -right-0.5
                  h-3
                  w-3
                  rounded-full
                  border-2
                  border-slate-950
                  bg-emerald-400
                  shadow-lg
                  shadow-emerald-500/30
                "
              />
            </motion.div>

            {/* Candidate information */}

            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-base
                  font-bold
                  tracking-tight
                  text-white
                  transition-colors
                  duration-200
                  group-hover:text-indigo-100
                "
              >
                {name}
              </h3>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-medium
                  text-slate-400
                  transition-colors
                  group-hover:text-slate-300
                "
              >
                {title}
              </p>
            </div>
          </div>

          {/* =================================================
              AI Match Score
          ================================================= */}

          {score !== null && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.06 + 0.2,
              }}
              className={`
                relative
                shrink-0
                overflow-hidden
                rounded-2xl
                border
                px-3
                py-2
                text-center
                backdrop-blur-xl
                ${
                  isStrongMatch
                    ? "border-emerald-400/20 bg-emerald-400/10"
                    : "border-indigo-400/20 bg-indigo-400/10"
                }
              `}
            >
              <div
                className={`
                  flex
                  items-center
                  justify-center
                  gap-1
                  ${
                    isStrongMatch
                      ? "text-emerald-300"
                      : "text-indigo-300"
                  }
                `}
              >
                <Sparkles className="h-3.5 w-3.5" />

                <span className="text-[10px] font-bold uppercase tracking-wider">
                  AI Match
                </span>
              </div>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.06 + 0.35,
                }}
                className={`
                  mt-0.5
                  text-lg
                  font-black
                  ${
                    isStrongMatch
                      ? "text-emerald-300"
                      : "text-indigo-300"
                  }
                `}
              >
                {score}%
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* ===================================================
            Candidate Meta
        =================================================== */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            gap-x-4
            gap-y-2
            text-xs
            text-slate-400
          "
        >
          <span
            className="
              inline-flex
              max-w-full
              items-center
              gap-1.5
              truncate
              transition-colors
              group-hover:text-slate-300
            "
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            <span className="truncate">{location}</span>
          </span>

          {experience !== null && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                transition-colors
                group-hover:text-slate-300
              "
            >
              <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-purple-400" />

              <span>
                {experience}{" "}
                {experience === 1 ? "year" : "years"}{" "}
                experience
              </span>
            </span>
          )}
        </div>

        {/* ===================================================
            Skills
        =================================================== */}

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 7).map((skill, skillIndex) => (
              <motion.span
                key={skill}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                  delay:
                    index * 0.06 +
                    skillIndex * 0.025,
                }}
                className="
                  rounded-lg
                  border
                  border-white/10
                  bg-white/5
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-slate-300
                  transition-all
                  duration-200
                  hover:border-indigo-400/20
                  hover:bg-indigo-500/10
                  hover:text-indigo-200
                "
              >
                {skill}
              </motion.span>
            ))}

            {skills.length > 7 && (
              <span
                className="
                  rounded-lg
                  border
                  border-white/5
                  bg-white/[0.03]
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                +{skills.length - 7}
              </span>
            )}
          </div>
        )}

        {/* ===================================================
            AI Insight
        =================================================== */}

        {match?.explanation && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.06 + 0.15,
            }}
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              border
              border-indigo-400/10
              bg-indigo-500/[0.06]
              p-3.5
              backdrop-blur-sm
            "
          >
            <div
              className="
                mb-1.5
                flex
                items-center
                gap-2
                text-xs
                font-semibold
                text-indigo-300
              "
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI insight
            </div>

            <p
              className="
                line-clamp-2
                text-xs
                leading-5
                text-slate-400
              "
            >
              {match.explanation}
            </p>
          </motion.div>
        )}

        {/* ===================================================
            Actions
        =================================================== */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            items-center
            gap-2
            border-t
            border-white/10
            pt-4
          "
        >
          {candidateId && (
            <Button
              asChild
              size="sm"
              className="
                rounded-xl
                border
                border-indigo-400/20
                bg-indigo-500/90
                font-semibold
                text-white
                shadow-lg
                shadow-indigo-950/30
                transition-all
                duration-200
                hover:bg-indigo-400
                hover:shadow-indigo-500/20
              "
            >
              <Link
                href={`/candidates/${encodeURIComponent(
                  candidateId,
                )}`}
              >
                View Profile

                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="
              rounded-xl
              border-white/10
              bg-white/[0.04]
              font-medium
              text-slate-300
              backdrop-blur-sm
              transition-all
              duration-200
              hover:border-indigo-400/20
              hover:bg-indigo-500/10
              hover:text-indigo-200
            "
          >
            <Link
              href={
                candidateId
                  ? `/recruiter/messages?candidateId=${encodeURIComponent(
                      candidateId,
                    )}`
                  : "/recruiter/messages"
              }
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              Message
            </Link>
          </Button>

          {candidate.email && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="
                rounded-xl
                text-slate-400
                transition-all
                duration-200
                hover:bg-white/5
                hover:text-white
              "
            >
              <a
                href={`mailto:${candidate.email}`}
              >
                <Mail className="mr-1.5 h-3.5 w-3.5" />
                Email
              </a>
            </Button>
          )}

          {/* Strong Match */}

          {isStrongMatch && (
            <motion.span
              initial={{
                opacity: 0,
                x: 8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.06 + 0.3,
              }}
              className="
                ml-auto
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-400/15
                bg-emerald-400/5
                px-2.5
                py-1
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-emerald-300
              "
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Strong match
            </motion.span>
          )}
        </div>
      </div>
    </motion.article>
  );
}