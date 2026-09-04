"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Globe2,
  Loader2,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { motion, type Variants } from "motion/react";

import {
  recruiterApi,
  type RecruiterJob,
} from "@/lib/api/recruiter.api";
import ParticleWave from "@/components/ui/particle-wave";




interface JobEditPageProps {
  jobId: string;
}

type SkillPriority = "high" | "medium" | "low";

type EditableSkill = {
  id?: string;
  name: string;
  priority: SkillPriority;
};

type FormState = {
  title: string;
  description: string;
  location: string;
  remoteType: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  deadline: string;
  status: string;
  requiredSkills: EditableSkill[];
};


const pageVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.06,
    },
  },
};


const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};


const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};


const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-indigo-500/10";

const selectClass =
  "w-full appearance-none rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10";

const textareaClass =
  "w-full min-h-[180px] resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-indigo-500/10";


function formatEnum(value?: string | null) {
  if (!value) return "Not specified";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function toDateTimeLocal(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


function toIsoDate(value: string) {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}


function formatSalary(
  min?: number | null,
  max?: number | null,
  currency?: string | null,
) {
  if (min == null && max == null) {
    return "Salary not specified";
  }

  const code = currency || "BDT";

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  });

  if (min != null && max != null) {
    return `${code} ${formatter.format(min)} – ${formatter.format(max)}`;
  }

  if (min != null) {
    return `${code} ${formatter.format(min)}+`;
  }

  return `Up to ${code} ${formatter.format(max ?? 0)}`;
}


function Label({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-200">
      {children}

      {required && (
        <span className="ml-1 text-rose-400">
          *
        </span>
      )}
    </label>
  );
}


function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}


export default function JobEditPage({
  jobId,
}: JobEditPageProps) {
  const [job, setJob] = useState<RecruiterJob | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    location: "",
    remoteType: "",
    employmentType: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "BDT",
    deadline: "",
    status: "DRAFT",
    requiredSkills: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [newSkill, setNewSkill] = useState("");
  const [newSkillPriority, setNewSkillPriority] =
    useState<SkillPriority>("medium");

  const [dirty, setDirty] = useState(false);


  const loadJob = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const jobs = await recruiterApi.getJobs();

      const foundJob = jobs.find(
        (item) => item.id === jobId,
      );

      if (!foundJob) {
        throw new Error(
          "Job not found or you do not have access to this job.",
        );
      }

      setJob(foundJob);

      setForm({
        title: foundJob.title ?? "",
        description: foundJob.description ?? "",
        location: foundJob.location ?? "",
        remoteType: foundJob.remoteType ?? "",
        employmentType: foundJob.employmentType ?? "",
        experienceLevel: foundJob.experienceLevel ?? "",
        salaryMin:
          foundJob.salaryMin != null
            ? String(foundJob.salaryMin)
            : "",
        salaryMax:
          foundJob.salaryMax != null
            ? String(foundJob.salaryMax)
            : "",
        salaryCurrency:
          foundJob.salaryCurrency ?? "BDT",
        deadline: toDateTimeLocal(foundJob.deadline),
        status: foundJob.status ?? "DRAFT",

        requiredSkills:
          foundJob.requiredSkills?.map((skill) => ({
            id: skill.id,
            name: skill.name,
            priority:
              skill.name === "high" ? "high"
                : skill.name === "low" ? "low"
                : "medium",
          })) ?? [],
      });

      setDirty(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load job.",
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);


  useEffect(() => {
    // Loading job data is an external-system synchronization; the async
    // callback updates state when the request completes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJob();
  }, [loadJob]);


  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setDirty(true);
    setSuccess(false);
  };


  const addSkill = () => {
    const name = newSkill.trim();

    if (!name) return;

    const exists = form.requiredSkills.some(
      (skill) =>
        skill.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      setNewSkill("");
      return;
    }

    setForm((current) => ({
      ...current,
      requiredSkills: [
        ...current.requiredSkills,
        {
          name,
          priority: newSkillPriority,
        },
      ],
    }));

    setNewSkill("");
    setNewSkillPriority("medium");

    setDirty(true);
    setSuccess(false);
  };


  const removeSkill = (index: number) => {
    setForm((current) => ({
      ...current,
      requiredSkills: current.requiredSkills.filter(
        (_, skillIndex) => skillIndex !== index,
      ),
    }));

    setDirty(true);
    setSuccess(false);
  };


  const updateSkill = (
    index: number,
    field: keyof EditableSkill,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      requiredSkills: current.requiredSkills.map(
        (skill, skillIndex) =>
          skillIndex === index
            ? {
                ...skill,
                [field]: value,
              }
            : skill,
      ),
    }));

    setDirty(true);
    setSuccess(false);
  };


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Job description is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),

        location: form.location.trim() || undefined,

        remoteType:
          form.remoteType || undefined,

        employmentType:
          form.employmentType || undefined,

        experienceLevel:
          form.experienceLevel || undefined,

        salaryMin:
          form.salaryMin.trim()
            ? Number(form.salaryMin)
            : undefined,

        salaryMax:
          form.salaryMax.trim()
            ? Number(form.salaryMax)
            : undefined,

        salaryCurrency:
          form.salaryCurrency || undefined,

        deadline: toIsoDate(form.deadline),

        status: form.status || undefined,

        requiredSkills:
          form.requiredSkills
            .filter((skill) => skill.name.trim())
            .map((skill) => ({
              name: skill.name.trim(),
              priority: skill.priority,
            })),
      };

      const updatedJob =
        await recruiterApi.updateJob(
          jobId,
          payload,
        );

      setJob(updatedJob);

      setForm({
        title: updatedJob.title ?? "",
        description: updatedJob.description ?? "",
        location: updatedJob.location ?? "",
        remoteType: updatedJob.remoteType ?? "",
        employmentType:
          updatedJob.employmentType ?? "",
        experienceLevel:
          updatedJob.experienceLevel ?? "",
        salaryMin:
          updatedJob.salaryMin != null
            ? String(updatedJob.salaryMin)
            : "",
        salaryMax:
          updatedJob.salaryMax != null
            ? String(updatedJob.salaryMax)
            : "",
        salaryCurrency:
          updatedJob.salaryCurrency ?? "BDT",
        deadline: toDateTimeLocal(
          updatedJob.deadline,
        ),
        status:
          updatedJob.status ?? "DRAFT",
        requiredSkills:
          updatedJob.requiredSkills?.map(
            (skill) => ({
              id: skill.id,
              name: skill.name,
              priority:
                skill.name === "high" ||
                skill.name === "low"
                  ? skill.name
                  : "medium",
            }),
          ) ?? [],
      });

      setDirty(false);
      setSuccess(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update job.",
      );
    } finally {
      setSaving(false);
    }
  };


  const salaryPreview = useMemo(() => {
    return formatSalary(
      form.salaryMin
        ? Number(form.salaryMin)
        : undefined,
      form.salaryMax
        ? Number(form.salaryMax)
        : undefined,
      form.salaryCurrency,
    );
  }, [
    form.salaryMin,
    form.salaryMax,
    form.salaryCurrency,
  ]);


  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <ParticleWave />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.1),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-40 rounded bg-white/10" />

            <div className="h-16 w-2/3 rounded-2xl bg-white/10" />

            <div className="h-5 w-1/2 rounded bg-white/10" />

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="h-[700px] rounded-3xl bg-white/[0.04]" />

              <div className="h-[400px] rounded-3xl bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (error && !job) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <ParticleWave />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-rose-400/20 bg-white/[0.05] p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <X className="h-7 w-7" />
            </div>

            <h1 className="text-xl font-semibold">
              Unable to load job
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <Link
              href="/recruiter/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }


  if (!job) return null;


  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-hidden bg-[#050816] text-white"
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <ParticleWave />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.1),transparent_30%)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />


      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =========================================================
            TOP NAVIGATION
        ========================================================== */}

        <motion.div
          variants={itemVariants}
          className="mb-7 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link
              href="/recruiter"
              className="transition hover:text-white"
            >
              Dashboard
            </Link>

            <ChevronRight className="h-4 w-4" />

            <Link
              href="/recruiter/jobs"
              className="transition hover:text-white"
            >
              Jobs
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="text-slate-200">
              Edit
            </span>
          </div>

          <Link
            href={`/recruiter/jobs/${job.id}`}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to Job
          </Link>
        </motion.div>


        {/* =========================================================
            HEADER
        ========================================================== */}

        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                Job Editor
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Edit Job
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Update your job information, requirements,
                compensation and publishing settings.
              </p>
            </div>


            <div className="flex flex-wrap items-center gap-3">
              {dirty && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                  Unsaved changes
                </div>
              )}

              {success && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300"
                >
                  <Check className="h-4 w-4" />
                  Changes saved
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>


        {/* =========================================================
            ERROR / SUCCESS
        ========================================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-4 text-sm text-rose-200"
          >
            <X className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">
                Could not save changes
              </p>

              <p className="mt-1 text-rose-200/70">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError(null)}
              className="rounded-lg p-1 transition hover:bg-white/10"
              aria-label="Close error"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">

            {/* =====================================================
                MAIN EDITOR
            ====================================================== */}

            <div className="space-y-6">

              {/* Basic Information */}

              <motion.section
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7"
              >
                <SectionHeader
                  icon={BriefcaseBusiness}
                  title="Basic Information"
                  description="The main information candidates will see about this position."
                />

                <div className="space-y-6">

                  <div>
                    <Label required>
                      Job Title
                    </Label>

                    <input
                      type="text"
                      value={form.title}
                      onChange={(event) =>
                        updateField(
                          "title",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Senior Full Stack Developer"
                      className={inputClass}
                      required
                    />
                  </div>


                  <div>
                    <Label required>
                      Job Description
                    </Label>

                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        updateField(
                          "description",
                          event.target.value,
                        )
                      }
                      placeholder="Describe the role, responsibilities, expectations and what makes this opportunity interesting..."
                      className={textareaClass}
                      required
                    />

                    <div className="mt-2 flex justify-end text-xs text-slate-500">
                      {form.description.length} characters
                    </div>
                  </div>


                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <Label>
                        Location
                      </Label>

                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type="text"
                          value={form.location}
                          onChange={(event) =>
                            updateField(
                              "location",
                              event.target.value,
                            )
                          }
                          placeholder="Dhaka, Bangladesh"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>


                    <div>
                      <Label>
                        Work Type
                      </Label>

                      <select
                        value={form.remoteType}
                        onChange={(event) =>
                          updateField(
                            "remoteType",
                            event.target.value,
                          )
                        }
                        className={selectClass}
                      >
                        <option value="">
                          Select work type
                        </option>

                        <option value="REMOTE">
                          Remote
                        </option>

                        <option value="HYBRID">
                          Hybrid
                        </option>

                        <option value="ONSITE">
                          On-site
                        </option>
                      </select>
                    </div>


                    <div>
                      <Label>
                        Employment Type
                      </Label>

                      <select
                        value={form.employmentType}
                        onChange={(event) =>
                          updateField(
                            "employmentType",
                            event.target.value,
                          )
                        }
                        className={selectClass}
                      >
                        <option value="">
                          Select employment type
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

                        <option value="FREELANCE">
                          Freelance
                        </option>
                      </select>
                    </div>


                    <div>
                      <Label>
                        Experience Level
                      </Label>

                      <select
                        value={form.experienceLevel}
                        onChange={(event) =>
                          updateField(
                            "experienceLevel",
                            event.target.value,
                          )
                        }
                        className={selectClass}
                      >
                        <option value="">
                          Select experience
                        </option>

                        <option value="ENTRY">
                          Entry Level
                        </option>

                        <option value="JUNIOR">
                          Junior
                        </option>

                        <option value="MID">
                          Mid Level
                        </option>

                        <option value="SENIOR">
                          Senior
                        </option>

                        <option value="LEAD">
                          Lead
                        </option>

                        <option value="EXECUTIVE">
                          Executive
                        </option>
                      </select>
                    </div>

                  </div>
                </div>
              </motion.section>


              {/* Compensation */}

              <motion.section
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7"
              >
                <SectionHeader
                  icon={CircleDollarSign}
                  title="Compensation"
                  description="Set a clear salary range to help candidates understand the opportunity."
                />

                <div className="grid gap-5 md:grid-cols-3">

                  <div>
                    <Label>
                      Minimum Salary
                    </Label>

                    <input
                      type="number"
                      min="0"
                      value={form.salaryMin}
                      onChange={(event) =>
                        updateField(
                          "salaryMin",
                          event.target.value,
                        )
                      }
                      placeholder="40000"
                      className={inputClass}
                    />
                  </div>


                  <div>
                    <Label>
                      Maximum Salary
                    </Label>

                    <input
                      type="number"
                      min="0"
                      value={form.salaryMax}
                      onChange={(event) =>
                        updateField(
                          "salaryMax",
                          event.target.value,
                        )
                      }
                      placeholder="100000"
                      className={inputClass}
                    />
                  </div>


                  <div>
                    <Label>
                      Currency
                    </Label>

                    <select
                      value={form.salaryCurrency}
                      onChange={(event) =>
                        updateField(
                          "salaryCurrency",
                          event.target.value,
                        )
                      }
                      className={selectClass}
                    >
                      <option value="BDT">
                        BDT — Bangladeshi Taka
                      </option>

                      <option value="USD">
                        USD — US Dollar
                      </option>

                      <option value="EUR">
                        EUR — Euro
                      </option>

                      <option value="GBP">
                        GBP — British Pound
                      </option>

                      <option value="CAD">
                        CAD — Canadian Dollar
                      </option>

                      <option value="AUD">
                        AUD — Australian Dollar
                      </option>
                    </select>
                  </div>

                </div>


                <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="h-5 w-5 text-emerald-400" />

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Salary preview
                      </p>

                      <p className="mt-1 text-base font-semibold text-white">
                        {salaryPreview}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>


              {/* Skills */}

              <motion.section
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7"
              >
                <SectionHeader
                  icon={Sparkles}
                  title="Required Skills"
                  description="Define the technologies and skills candidates should have."
                />


                {/* Add skill */}

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_150px_auto]">

                    <input
                      type="text"
                      value={newSkill}
                      onChange={(event) =>
                        setNewSkill(
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter"
                        ) {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="e.g. React, Node.js, PostgreSQL"
                      className={inputClass}
                    />


                    <select
                      value={newSkillPriority}
                      onChange={(event) =>
                        setNewSkillPriority(
                          event.target.value as SkillPriority,
                        )
                      }
                      className={selectClass}
                    >
                      <option value="high">
                        High Priority
                      </option>

                      <option value="medium">
                        Medium Priority
                      </option>

                      <option value="low">
                        Low Priority
                      </option>
                    </select>


                    <button
                      type="button"
                      onClick={addSkill}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>

                  </div>
                </div>


                {/* Skills list */}

                <div className="mt-5 space-y-3">

                  {form.requiredSkills.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center">
                      <Sparkles className="mx-auto h-8 w-8 text-slate-600" />

                      <p className="mt-3 text-sm font-medium text-slate-300">
                        No required skills added
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Add the technologies and skills required
                        for this position.
                      </p>
                    </div>
                  ) : (
                    form.requiredSkills.map(
                      (skill, index) => (
                        <motion.div
                          layout
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          key={
                            skill.id ??
                            `${skill.name}-${index}`
                          }
                          className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 transition hover:border-white/20 hover:bg-white/[0.045] sm:flex-row sm:items-center"
                        >

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                            <Sparkles className="h-4 w-4" />
                          </div>


                          <input
                            type="text"
                            value={skill.name}
                            onChange={(event) =>
                              updateSkill(
                                index,
                                "name",
                                event.target.value,
                              )
                            }
                            className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-2 text-sm font-medium text-white outline-none transition focus:border-white/10 focus:bg-white/[0.04]"
                          />


                          <select
                            value={skill.priority}
                            onChange={(event) =>
                              updateSkill(
                                index,
                                "priority",
                                event.target.value,
                              )
                            }
                            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-indigo-400/50"
                          >
                            <option value="high">
                              High
                            </option>

                            <option value="medium">
                              Medium
                            </option>

                            <option value="low">
                              Low
                            </option>
                          </select>


                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(index)
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                            aria-label={`Remove ${skill.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </motion.div>
                      ),
                    )
                  )}

                </div>
              </motion.section>


              {/* Publishing */}

              <motion.section
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7"
              >
                <SectionHeader
                  icon={Globe2}
                  title="Publishing Settings"
                  description="Control the visibility and deadline of your job."
                />

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <Label>
                      Job Status
                    </Label>

                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target.value,
                        )
                      }
                      className={selectClass}
                    >
                      <option value="DRAFT">
                        Draft
                      </option>

                      <option value="PUBLISHED">
                        Published
                      </option>

                      <option value="CLOSED">
                        Closed
                      </option>
                    </select>
                  </div>


                  <div>
                    <Label>
                      Application Deadline
                    </Label>

                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        type="datetime-local"
                        value={form.deadline}
                        onChange={(event) =>
                          updateField(
                            "deadline",
                            event.target.value,
                          )
                        }
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                </div>
              </motion.section>


              {/* Mobile save */}

              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </div>


            {/* =====================================================
                RIGHT SIDEBAR
            ====================================================== */}

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">

              {/* Save card */}

              <motion.div
                variants={cardVariants}
                className="overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 via-white/[0.04] to-cyan-500/10 p-5 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                    <Save className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Save your changes
                    </h3>

                    <p className="text-xs text-slate-400">
                      Update this job instantly
                    </p>
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>


                <Link
                  href={`/recruiter/jobs/${job.id}`}
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Cancel
                </Link>
              </motion.div>


              {/* Current job */}

              <motion.div
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-slate-300">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">
                      Current Job
                    </h3>

                    <p className="truncate text-xs text-slate-500">
                      {job.id}
                    </p>
                  </div>
                </div>


                <div className="space-y-4">

                  <div>
                    <p className="text-xs text-slate-500">
                      Title
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-200">
                      {job.title}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-slate-500">
                      Status
                    </p>

                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          job.status ===
                          "PUBLISHED"
                            ? "bg-emerald-400"
                            : job.status ===
                                "CLOSED"
                              ? "bg-rose-400"
                              : "bg-amber-400"
                        }`}
                      />

                      {formatEnum(job.status)}
                    </div>
                  </div>


                  <div>
                    <p className="text-xs text-slate-500">
                      Applications
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {job._count?.jobApplications ??
                        0}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-slate-500">
                      AI Matches
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {job._count?.matches ?? 0}
                    </p>
                  </div>

                </div>
              </motion.div>


              {/* Job details */}

              <motion.div
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Current Details
                    </h3>

                    <p className="text-xs text-slate-500">
                      Existing job information
                    </p>
                  </div>
                </div>


                <div className="space-y-4">

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />

                    <div>
                      <p className="text-xs text-slate-500">
                        Location
                      </p>

                      <p className="mt-1 text-sm text-slate-200">
                        {job.location ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3">
                    <Globe2 className="mt-0.5 h-4 w-4 text-slate-500" />

                    <div>
                      <p className="text-xs text-slate-500">
                        Work Type
                      </p>

                      <p className="mt-1 text-sm text-slate-200">
                        {formatEnum(
                          job.remoteType,
                        )}
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-4 w-4 text-slate-500" />

                    <div>
                      <p className="text-xs text-slate-500">
                        Employment
                      </p>

                      <p className="mt-1 text-sm text-slate-200">
                        {formatEnum(
                          job.employmentType,
                        )}
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3">
                    <BriefcaseBusiness className="mt-0.5 h-4 w-4 text-slate-500" />

                    <div>
                      <p className="text-xs text-slate-500">
                        Experience
                      </p>

                      <p className="mt-1 text-sm text-slate-200">
                        {formatEnum(
                          job.experienceLevel,
                        )}
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>


              {/* Tips */}

              <motion.div
                variants={cardVariants}
                className="rounded-3xl border border-amber-400/10 bg-amber-500/[0.04] p-5"
              >
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

                  <div>
                    <h3 className="text-sm font-semibold text-amber-200">
                      Hiring tip
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-400">
                      Keep the job description specific and
                      prioritize the skills that are genuinely
                      required. This helps your AI matching
                      system rank candidates more accurately.
                    </p>
                  </div>
                </div>
              </motion.div>

            </aside>

          </div>
        </form>
      </div>
    </motion.div>
  );
}