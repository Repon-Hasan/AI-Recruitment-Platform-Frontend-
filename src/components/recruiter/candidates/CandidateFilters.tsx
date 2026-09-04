"use client";

import {
  BriefcaseBusiness,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CandidateFiltersProps {
  search: string;
  location: string;
  minExperience: string;
  skill: string;
  minScore: string;

  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onMinScoreChange: (value: string) => void;

  onClear: () => void;
}

export default function CandidateFilters({
  search,
  location,
  minExperience,
  skill,
  minScore,
  onSearchChange,
  onLocationChange,
  onExperienceChange,
  onSkillChange,
  onMinScoreChange,
  onClear,
}: CandidateFiltersProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-slate-950/55
        p-5
        shadow-2xl
        shadow-black/20
        backdrop-blur-2xl
      "
    >
      {/* -------------------------------------------------- */}
      {/* Subtle animated glow */}
      {/* -------------------------------------------------- */}

      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-indigo-500/10
          blur-3xl
        "
      />

      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-20
          h-40
          w-40
          rounded-full
          bg-purple-500/10
          blur-3xl
        "
      />

      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-indigo-400/20
              bg-indigo-500/10
              text-indigo-300
              shadow-lg
              shadow-indigo-500/10
            "
          >
            <SlidersHorizontal className="h-4 w-4" />
          </motion.div>

          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">
              Candidate Filters
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Refine your candidate search
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="
              h-8
              rounded-lg
              border
              border-white/5
              px-2.5
              text-xs
              text-slate-400
              transition-all
              hover:border-white/10
              hover:bg-white/5
              hover:text-white
            "
          >
            <RotateCcw className="mr-1.5 h-3 w-3" />
            Clear
          </Button>
        </motion.div>
      </div>

      {/* -------------------------------------------------- */}
      {/* Filters */}
      {/* -------------------------------------------------- */}

      <div className="relative z-10 space-y-5">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <label className="mb-2 block text-xs font-semibold text-slate-300">
            Search candidates
          </label>

          <div className="group/input relative">
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-500
                transition-colors
                group-focus-within/input:text-indigo-400
              "
            />

            <Input
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Name, title, skill..."
              className="
                h-10
                rounded-xl
                border
                border-white/10
                bg-slate-900/70
                pl-9
                text-sm
                text-white
                placeholder:text-slate-500
                shadow-inner
                shadow-black/10
                transition-all
                hover:border-white/15
                hover:bg-slate-900/80
                focus:border-indigo-500/40
                focus:bg-slate-900/90
                focus:ring-2
                focus:ring-indigo-500/10
              "
            />
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.35 }}
        >
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
            Location
          </label>

          <Input
            value={location}
            onChange={(event) =>
              onLocationChange(event.target.value)
            }
            placeholder="Dhaka"
            className="
              h-10
              rounded-xl
              border
              border-white/10
              bg-slate-900/70
              text-sm
              text-white
              placeholder:text-slate-500
              shadow-inner
              shadow-black/10
              transition-all
              hover:border-white/15
              hover:bg-slate-900/80
              focus:border-indigo-500/40
              focus:bg-slate-900/90
              focus:ring-2
              focus:ring-indigo-500/10
            "
          />
        </motion.div>

        {/* Minimum Experience */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <BriefcaseBusiness className="h-3.5 w-3.5 text-indigo-400" />
            Minimum experience
          </label>

          <select
            value={minExperience}
            onChange={(event) =>
              onExperienceChange(event.target.value)
            }
            className="
              h-10
              w-full
              rounded-xl
              border
              border-white/10
              bg-slate-900/80
              px-3
              text-sm
              text-slate-200
              outline-none
              shadow-inner
              shadow-black/10
              transition-all
              hover:border-white/15
              hover:bg-slate-900/90
              focus:border-indigo-500/40
              focus:ring-2
              focus:ring-indigo-500/10
            "
          >
            <option
              value=""
              className="bg-slate-900 text-slate-200"
            >
              Any experience
            </option>

            <option
              value="1"
              className="bg-slate-900 text-slate-200"
            >
              1+ years
            </option>

            <option
              value="2"
              className="bg-slate-900 text-slate-200"
            >
              2+ years
            </option>

            <option
              value="3"
              className="bg-slate-900 text-slate-200"
            >
              3+ years
            </option>

            <option
              value="5"
              className="bg-slate-900 text-slate-200"
            >
              5+ years
            </option>

            <option
              value="7"
              className="bg-slate-900 text-slate-200"
            >
              7+ years
            </option>
          </select>
        </motion.div>

        {/* Skill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.35 }}
        >
          <label className="mb-2 block text-xs font-semibold text-slate-300">
            Skill
          </label>

          <Input
            value={skill}
            onChange={(event) =>
              onSkillChange(event.target.value)
            }
            placeholder="React"
            className="
              h-10
              rounded-xl
              border
              border-white/10
              bg-slate-900/70
              text-sm
              text-white
              placeholder:text-slate-500
              shadow-inner
              shadow-black/10
              transition-all
              hover:border-white/15
              hover:bg-slate-900/80
              focus:border-indigo-500/40
              focus:bg-slate-900/90
              focus:ring-2
              focus:ring-indigo-500/10
            "
          />
        </motion.div>

        {/* Minimum AI Match */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35 }}
        >
          <label className="mb-2 block text-xs font-semibold text-slate-300">
            Minimum AI match
          </label>

          <select
            value={minScore}
            onChange={(event) =>
              onMinScoreChange(event.target.value)
            }
            className="
              h-10
              w-full
              rounded-xl
              border
              border-white/10
              bg-slate-900/80
              px-3
              text-sm
              text-slate-200
              outline-none
              shadow-inner
              shadow-black/10
              transition-all
              hover:border-white/15
              hover:bg-slate-900/90
              focus:border-indigo-500/40
              focus:ring-2
              focus:ring-indigo-500/10
            "
          >
            <option
              value=""
              className="bg-slate-900 text-slate-200"
            >
              Any score
            </option>

            <option
              value="60"
              className="bg-slate-900 text-slate-200"
            >
              60%+
            </option>

            <option
              value="70"
              className="bg-slate-900 text-slate-200"
            >
              70%+
            </option>

            <option
              value="80"
              className="bg-slate-900 text-slate-200"
            >
              80%+
            </option>

            <option
              value="90"
              className="bg-slate-900 text-slate-200"
            >
              90%+
            </option>
          </select>
        </motion.div>
      </div>

      {/* -------------------------------------------------- */}
      {/* AI Information Card */}
      {/* -------------------------------------------------- */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.4,
        }}
        whileHover={{
          y: -2,
        }}
        className="
          relative
          z-10
          mt-6
          overflow-hidden
          rounded-xl
          border
          border-indigo-400/15
          bg-indigo-500/[0.06]
          p-3.5
          shadow-lg
          shadow-indigo-950/10
        "
      >
        {/* Small glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-8
            -top-8
            h-20
            w-20
            rounded-full
            bg-indigo-500/10
            blur-2xl
          "
        />

        <div className="relative flex gap-2.5">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              mt-0.5
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-indigo-500/10
              text-indigo-300
            "
          >
            <Filter className="h-3.5 w-3.5" />
          </motion.div>

          <div>
            <p className="text-xs font-semibold text-indigo-200">
              AI Candidate Ranking
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Select a job above to unlock AI-powered
              candidate ranking and match analysis.
            </p>
          </div>
        </div>
      </motion.div>

      {/* -------------------------------------------------- */}
      {/* Bottom border highlight */}
      {/* -------------------------------------------------- */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-8
          right-8
          h-px
          bg-linear-to-r
          from-transparent
          via-indigo-500/30
          to-transparent
        "
      />
    </motion.aside>
  );
}