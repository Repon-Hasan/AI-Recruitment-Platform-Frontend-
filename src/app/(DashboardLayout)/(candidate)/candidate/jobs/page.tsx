"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { motion } from "motion/react";

import type { Job } from "@/types/job";

import {
  useJobs,
  useSearchJobs,
} from "./useJobs";

import ParticleWave from "@/components/ui/particle-wave";


function formatEmploymentType(
  value?: string,
) {
  if (!value) return "Flexible";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase(),
    );
}


function formatSalary(job: Job) {
  if (
    job.salaryMin == null &&
    job.salaryMax == null
  ) {
    return "Salary not disclosed";
  }

  const currency =
    job.salaryCurrency || "BDT";

  const min =
    job.salaryMin?.toLocaleString();

  const max =
    job.salaryMax?.toLocaleString();

  if (min && max) {
    return `${currency} ${min} - ${max}`;
  }

  return `${currency} ${min || max}`;
}


export default function JobsPage() {
  const {
    data: initialJobs,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useJobs();


  const [search, setSearch] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");


  const [employment, setEmployment] =
    useState("ALL");


  /*
   * Debounce search input.
   *
   * This prevents an API request for
   * every single keyboard character.
   *
   * Example:
   *
   * r
   * re
   * rea
   * reac
   * react
   *
   * Only "react" will be sent.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(
        search.trim(),
      );
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);


  /*
   * Search API
   *
   * /job/my/search?keyword=react
   */
  const {
    data: searchedJobs,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: searchError,
    error: searchErrorObject,
  } = useSearchJobs(
    debouncedSearch,
  );


  /*
   * If there is a search keyword,
   * use server search results.
   *
   * Otherwise use normal candidate jobs.
   */
  const jobs = useMemo<Job[]>(() => {
    if (debouncedSearch) {
      return searchedJobs ?? [];
    }

    return initialJobs ?? [];
  }, [
    debouncedSearch,
    searchedJobs,
    initialJobs,
  ]);


  /*
   * Employment filtering is still
   * handled on the frontend.
   */
  const filteredJobs = useMemo<Job[]>(() => {
    return jobs.filter((job: Job) => {
      const matchesEmployment =
        employment === "ALL" ||
        job.employmentType === employment;

      return matchesEmployment;
    });
  }, [
    jobs,
    employment,
  ]);


  /*
   * Initial loading
   */
  if (jobsLoading) {
    return (
      <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

        {/* HERO */}

        <section className="relative isolate overflow-hidden">

          <div className="absolute inset-0 z-0 opacity-70">
            <ParticleWave className="h-full w-full" />
          </div>

          <div className="absolute inset-0 z-0 bg-slate-950/60" />

          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_45%)]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-8">

            <div className="mx-auto max-w-3xl text-center">

              <div className="mx-auto h-8 w-52 animate-pulse rounded-full bg-white/10" />

              <div className="mx-auto mt-8 h-16 max-w-2xl animate-pulse rounded-xl bg-white/10" />

              <div className="mx-auto mt-6 h-12 max-w-xl animate-pulse rounded-xl bg-white/10" />

            </div>


            {/* Search skeleton */}

            <div className="mx-auto mt-10 max-w-4xl">

              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-xl">

                <div className="flex flex-col gap-3 md:flex-row">

                  <div className="h-14 flex-1 animate-pulse rounded-xl bg-white/10" />

                  <div className="h-14 w-full animate-pulse rounded-xl bg-white/10 md:w-56" />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* JOB SKELETON */}

        <section className="relative z-10 bg-slate-950 px-6 py-16 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="mb-10 flex items-end justify-between">

              <div className="space-y-3">

                <div className="h-4 w-40 animate-pulse rounded bg-white/10" />

                <div className="h-8 w-48 animate-pulse rounded bg-white/10" />

              </div>

            </div>


            <JobSkeletonGrid />

          </div>

        </section>

      </main>
    );
  }


  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* HERO */}

      <section className="relative isolate overflow-hidden">

        {/* Particle background */}

        <div className="absolute inset-0 z-0 opacity-70">

          <ParticleWave className="h-full w-full" />

        </div>


        {/* Dark overlay */}

        <div className="absolute inset-0 z-0 bg-slate-950/60" />


        {/* Gradient */}

        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_45%)]" />


        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-8">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mx-auto max-w-3xl text-center"
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.15,
              }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300 backdrop-blur"
            >

              <Sparkles className="h-4 w-4" />

              AI-powered job matching

            </motion.div>


            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">

              Find a job that

              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">

                matches your skills.

              </span>

            </h1>


            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">

              Discover opportunities matched with
              your experience, skills and career
              goals using AI-powered recruitment.

            </p>

          </motion.div>


          {/* SEARCH */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.7,
            }}
            className="mx-auto mt-10 max-w-4xl"
          >

            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-xl">

              <div className="flex flex-col gap-3 md:flex-row">

                {/* SEARCH INPUT */}

                <div className="relative flex-1">

                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />


                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value,
                      )
                    }
                    placeholder="Search jobs, companies or skills..."
                    className="h-14 w-full rounded-xl border border-white/10 bg-slate-900/70 pl-12 pr-12 text-white outline-none transition focus:border-blue-400/50"
                  />


                  {/* Loading */}

                  {(searchLoading ||
                    searchFetching) &&
                    search.trim() && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">

                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />

                      </div>
                    )}


                  {/* Clear */}

                  {!searchLoading &&
                    !searchFetching &&
                    search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                        aria-label="Clear search"
                      >

                        <X className="h-5 w-5" />

                      </button>
                    )}

                </div>


                {/* EMPLOYMENT */}

                <select
                  value={employment}
                  onChange={(e) =>
                    setEmployment(
                      e.target.value,
                    )
                  }
                  className="h-14 rounded-xl border border-white/10 bg-slate-900 px-5 text-sm text-white outline-none"
                >

                  <option value="ALL">
                    All employment types
                  </option>

                  <option value="FULL_TIME">
                    Full Time
                  </option>

                  <option value="PART_TIME">
                    Part Time
                  </option>

                  <option value="CONTRACT">
                    Contract
                  </option>

                  <option value="INTERNSHIP">
                    Internship
                  </option>

                </select>

              </div>


              {/* Search status */}

              {debouncedSearch && (
                <div className="mt-3 flex items-center gap-2 px-2 text-xs text-slate-400">

                  {searchLoading ||
                  searchFetching ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-blue-400" />

                      Searching for{" "}
                      <span className="font-medium text-blue-300">
                        &quot;
                        {debouncedSearch}
                        &quot;
                      </span>
                    </>
                  ) : (
                    <>
                      Search results for{" "}
                      <span className="font-medium text-blue-300">
                        &quot;
                        {debouncedSearch}
                        &quot;
                      </span>
                    </>
                  )}

                </div>
              )}

            </div>

          </motion.div>

        </div>

      </section>


      {/* JOB LIST */}

      <section className="relative z-10 bg-slate-950 px-6 py-16 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between">

            <div>

              <p className="text-sm font-medium text-blue-400">
                AVAILABLE OPPORTUNITIES
              </p>


              <h2 className="mt-2 text-3xl font-bold">

                {debouncedSearch
                  ? "Search results"
                  : "Latest jobs"}

              </h2>

            </div>


            <div className="text-sm text-slate-400">

              {searchLoading ||
              searchFetching ? (
                <span className="inline-flex items-center gap-2">

                  <span className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-blue-400" />

                  Searching...

                </span>
              ) : (
                <>
                  {filteredJobs.length}{" "}
                  opportunities
                </>
              )}

            </div>

          </div>


          {/* SEARCH ERROR */}

          {searchError && (
            <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">

              <p className="font-medium text-red-300">
                Unable to search jobs.
              </p>


              <p className="mt-2 text-sm text-slate-400">

                {searchErrorObject instanceof
                Error
                  ? searchErrorObject.message
                  : "Please try again."}

              </p>

            </div>
          )}


          {/* Search loading */}

          {(searchLoading ||
            searchFetching) &&
            debouncedSearch && (
              <JobSkeletonGrid />
            )}


          {/* Search results */}

          {!(
            searchLoading ||
            searchFetching
          ) &&
            filteredJobs.length === 0 &&
            !searchError && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-16 text-center"
              >

                <BriefcaseBusiness className="mx-auto h-12 w-12 text-slate-500" />


                <h3 className="mt-5 text-xl font-semibold">
                  No jobs found
                </h3>


                <p className="mt-2 text-slate-400">

                  {debouncedSearch
                    ? `No jobs found for "${debouncedSearch}". Try another keyword.`
                    : "Try another search term."}

                </p>

              </motion.div>
            )}


          {/* Jobs */}

          {!(
            searchLoading ||
            searchFetching
          ) &&
            filteredJobs.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {filteredJobs.map(
                  (job: Job, index: number) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      index={index}
                    />
                  ),
                )}

              </div>
            )}

        </div>

      </section>

    </main>
  );
}


/* -------------------------------- */
/* JOB CARD */
/* -------------------------------- */


function JobCard({
  job,
  index,
}: {
  job: Job;
  index: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      whileHover={{
        y: -8,
      }}
      className="group"
    >

      <Link
        href={`/jobs/${job.id}`}
        className="block h-full"
      >

        <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition group-hover:border-blue-400/30 group-hover:bg-white/[0.07]">

          {/* glow */}

          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/20" />


          <div className="relative">

            <div className="flex items-start justify-between gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300">

                <BriefcaseBusiness className="h-6 w-6" />

              </div>


              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">

                {job.status ||
                  "PUBLISHED"}

              </span>

            </div>


            <h3 className="mt-6 text-xl font-semibold transition group-hover:text-blue-300">

              {job.title}

            </h3>


            <p className="mt-2 text-sm text-slate-400">

              {job.company?.name ||
                "AI Recruitment Company"}

            </p>


            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">

              {job.description}

            </p>


            <div className="mt-6 space-y-3 text-sm text-slate-400">

              {job.location && (
                <div className="flex items-center gap-2">

                  <MapPin className="h-4 w-4 text-blue-400" />

                  {job.location}

                  {job.remoteType &&
                    ` · ${formatEmploymentType(
                      job.remoteType,
                    )}`}

                </div>
              )}


              <div className="flex items-center gap-2">

                <BriefcaseBusiness className="h-4 w-4 text-violet-400" />

                {formatEmploymentType(
                  job.employmentType,
                )}

              </div>

            </div>


            {/* skills */}

            {job.requiredSkills &&
              job.requiredSkills.length >
                0 && (
                <div className="mt-6 flex flex-wrap gap-2">

                  {job.requiredSkills
                    .slice(0, 4)
                    .map((skill) => (
                      <span
                        key={skill.name}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300"
                      >
                        {skill.name}
                      </span>
                    ))}

                </div>
              )}


            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">

              <span className="text-sm font-medium text-slate-200">

                {formatSalary(job)}

              </span>


              <span className="flex items-center gap-1 text-sm text-blue-400 transition group-hover:gap-2">

                View job

                <ArrowRight className="h-4 w-4" />

              </span>

            </div>

          </div>

        </article>

      </Link>

    </motion.div>
  );
}


/* -------------------------------- */
/* LOADING SKELETON */
/* -------------------------------- */


function JobSkeletonGrid() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >

      {Array.from({
        length: 6,
      }).map((_, index) => (
        <JobCardSkeleton
          key={index}
        />
      ))}

    </motion.div>
  );
}


function JobCardSkeleton() {
  return (
    <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6">

      {/* Animated shimmer */}

      <motion.div
        animate={{
          x: [
            "-100%",
            "200%",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
      />


      <div className="relative space-y-5">

        <div className="flex items-center justify-between">

          <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />

          <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />

        </div>


        <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />

        <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />


        <div className="space-y-2">

          <div className="h-3 w-full animate-pulse rounded bg-white/10" />

          <div className="h-3 w-11/12 animate-pulse rounded bg-white/10" />

          <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />

        </div>


        <div className="space-y-3">

          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />

          <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />

        </div>


        <div className="flex justify-between border-t border-white/10 pt-5">

          <div className="h-4 w-28 animate-pulse rounded bg-white/10" />

          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />

        </div>

      </div>

    </div>
  );
}