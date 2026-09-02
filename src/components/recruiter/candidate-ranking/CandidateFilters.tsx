
"use client";

import {
  ArrowDownUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type SortOption =
  | "score"
  | "experience"
  | "recent";

interface CandidateFiltersProps {
  search: string;

  setSearch: (
    value: string,
  ) => void;

  minScore: number;

  setMinScore: (
    value: number,
  ) => void;

  sortBy: SortOption;

  setSortBy: (
    value: SortOption,
  ) => void;
}

export default function CandidateFilters({
  search,
  setSearch,
  minScore,
  setMinScore,
  sortBy,
  setSortBy,
}: CandidateFiltersProps) {
  return (
    <div
      className="
        mb-6
        rounded-2xl
        border
        border-slate-200
        bg-white/90
        p-5
        shadow-sm
        backdrop-blur
      "
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Candidate Filters
          </h3>

          <p className="text-xs text-slate-400">
            Refine your candidate results
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {/* Search */}

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-600">
            Search
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Name, skill, email..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-3
                text-sm
                outline-none
                transition
                focus:border-indigo-400
                focus:ring-4
                focus:ring-indigo-100
              "
            />
          </div>
        </div>

        {/* Minimum Score */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">
              Minimum match score
            </label>

            <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">
              {minScore}%
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minScore}
            onChange={(event) =>
              setMinScore(
                Number(
                  event.target.value,
                ),
              )
            }
            className="w-full accent-indigo-600"
          />

          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Sort */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
            <ArrowDownUp className="h-3.5 w-3.5" />

            Sort candidates
          </label>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target
                  .value as SortOption,
              )
            }
            className="
              h-10
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-indigo-400
              focus:ring-4
              focus:ring-indigo-100
            "
          >
            <option value="score">
              Highest AI match
            </option>

            <option value="experience">
              Most experience
            </option>

            <option value="recent">
              Recently applied
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
