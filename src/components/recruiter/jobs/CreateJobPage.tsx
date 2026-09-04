"use client";

import ParticleWave from "@/components/ui/particle-wave";
import { recruiterApi } from "@/lib/api/recruiter.api";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Code2,
  Globe2,
  Laptop,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";



type JobStatus = "DRAFT" | "PUBLISHED";

type RemoteType = "REMOTE" | "HYBRID" | "ONSITE";

type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE";

type ExperienceLevel =
  | "ENTRY"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "LEAD";

type SkillPriority = "high" | "medium" | "low";

interface SkillInput {
  id: string;
  name: string;
  priority: SkillPriority;
}

interface FormState {
  title: string;
  description: string;
  location: string;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  deadline: string;
  status: JobStatus;
  skills: SkillInput[];
}

interface FormErrors {
  title?: string;
  description?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  deadline?: string;
  skills?: string;
}

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  location: "",
  remoteType: "HYBRID",
  employmentType: "FULL_TIME",
  experienceLevel: "ENTRY",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "BDT",
  deadline: "",
  status: "PUBLISHED",
  skills: [],
};

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const createSkillId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatEnum = (value: string) => {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatSalary = (
  min: string,
  max: string,
  currency: string,
) => {
  const minimum = Number(min);
  const maximum = Number(max);

  if (!minimum && !maximum) {
    return "Salary not specified";
  }

  const formatter = new Intl.NumberFormat("en-BD");

  if (minimum && maximum) {
    return `${currency} ${formatter.format(
      minimum,
    )} – ${formatter.format(maximum)}`;
  }

  if (minimum) {
    return `${currency} ${formatter.format(minimum)}+`;
  }

  return `Up to ${currency} ${formatter.format(maximum)}`;
};

export default function CreateJobPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [skillName, setSkillName] = useState("");

  const [skillPriority, setSkillPriority] =
    useState<SkillPriority>("medium");

  const [errors, setErrors] = useState<FormErrors>({});

  const [submitting, setSubmitting] = useState(false);

  const [serverError, setServerError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const progress = useMemo(() => {
    let completed = 0;

    if (form.title.trim()) completed++;
    if (form.description.trim()) completed++;
    if (form.location.trim()) completed++;
    if (form.salaryMin) completed++;
    if (form.salaryMax) completed++;
    if (form.deadline) completed++;
    if (form.skills.length > 0) completed++;

    return Math.round((completed / 7) * 100);
  }, [form]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setServerError("");
    setSuccessMessage("");
  };

  const addSkill = () => {
    const name = skillName.trim();

    if (!name) {
      return;
    }

    const alreadyExists = form.skills.some(
      (skill) =>
        skill.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyExists) {
      return;
    }

    const skill: SkillInput = {
      id: createSkillId(),
      name,
      priority: skillPriority,
    };

    setForm((previous) => ({
      ...previous,
      skills: [...previous.skills, skill],
    }));

    setSkillName("");
    setSkillPriority("medium");

    setErrors((previous) => ({
      ...previous,
      skills: undefined,
    }));
  };

  const removeSkill = (id: string) => {
    setForm((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (skill) => skill.id !== id,
      ),
    }));
  };

  const updateSkillPriority = (
    id: string,
    priority: SkillPriority,
  ) => {
    setForm((previous) => ({
      ...previous,
      skills: previous.skills.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              priority,
            }
          : skill,
      ),
    }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Job title is required.";
    } else if (form.title.trim().length < 3) {
      nextErrors.title =
        "Job title must contain at least 3 characters.";
    }

    if (!form.description.trim()) {
      nextErrors.description =
        "Job description is required.";
    } else if (form.description.trim().length < 20) {
      nextErrors.description =
        "Please provide a more detailed job description.";
    }

    if (!form.location.trim()) {
      nextErrors.location =
        "Please enter the job location.";
    }

    const minimum = Number(form.salaryMin);
    const maximum = Number(form.salaryMax);

    if (!form.salaryMin) {
      nextErrors.salaryMin =
        "Minimum salary is required.";
    } else if (Number.isNaN(minimum) || minimum < 0) {
      nextErrors.salaryMin =
        "Enter a valid minimum salary.";
    }

    if (!form.salaryMax) {
      nextErrors.salaryMax =
        "Maximum salary is required.";
    } else if (Number.isNaN(maximum) || maximum < 0) {
      nextErrors.salaryMax =
        "Enter a valid maximum salary.";
    } else if (minimum > maximum) {
      nextErrors.salaryMax =
        "Maximum salary must be greater than minimum salary.";
    }

    if (!form.deadline) {
      nextErrors.deadline =
        "Application deadline is required.";
    } else {
      const deadlineDate = new Date(form.deadline);

      if (deadlineDate.getTime() <= Date.now()) {
        nextErrors.deadline =
          "Deadline must be a future date.";
      }
    }

    if (form.skills.length === 0) {
      nextErrors.skills =
        "Add at least one required skill.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const submitJob = async () => {
    setServerError("");
    setSuccessMessage("");

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        remoteType: form.remoteType,
        employmentType: form.employmentType,
        experienceLevel: form.experienceLevel,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        salaryCurrency: form.salaryCurrency,
        deadline: new Date(form.deadline).toISOString(),
        status: form.status,
        requiredSkills: form.skills.map((skill) => ({
          name: skill.name,
          priority: skill.priority,
        })),
      };

      await recruiterApi.createJob(payload);

      setSuccessMessage(
        form.status === "PUBLISHED"
          ? "Your job has been published successfully."
          : "Your job has been saved as a draft.",
      );

      setTimeout(() => {
        window.location.href = "/my-jobs";
      }, 900);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create the job. Please try again.";

      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        <ParticleWave />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)]" />

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Link
            href="/my-jobs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Jobs
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                Recruiter Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create a new job
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Create a compelling job posting and attract
                the right candidates using AI-powered talent
                matching.
              </p>
            </div>

            {/* Progress */}
            <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Form progress
                </span>

                <span className="text-sm font-bold text-white">
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-500">
                Complete the important fields before publishing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200"
          >
            <X className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Could not create job
              </p>

              <p className="mt-1 text-red-200/70">
                {serverError}
              </p>
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200"
          >
            <Check className="h-5 w-5" />

            <span>{successMessage}</span>
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_390px]"
        >
          {/* =========================
              LEFT FORM
          ========================== */}
          <div className="space-y-6">
            {/* Basic Information */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
            >
              <SectionHeader
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                title="Job information"
                description="Tell candidates what this role is about."
              />

              <div className="mt-7 space-y-6">
                <InputField
                  label="Job title"
                  required
                  placeholder="e.g. Full Stack Developer"
                  value={form.title}
                  onChange={(value) =>
                    updateField("title", value)
                  }
                  error={errors.title}
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Job description
                    <span className="ml-1 text-red-400">
                      *
                    </span>
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value,
                      )
                    }
                    placeholder="Describe the role, responsibilities, expectations, and what makes this opportunity exciting..."
                    rows={7}
                    className={`w-full resize-none rounded-2xl border bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${
                      errors.description
                        ? "border-red-400/50 focus:ring-red-400/20"
                        : "border-white/10 focus:border-indigo-400/50 focus:ring-indigo-400/20"
                    }`}
                  />

                  <div className="mt-2 flex justify-between">
                    {errors.description ? (
                      <p className="text-xs text-red-400">
                        {errors.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Be specific about responsibilities and
                        expectations.
                      </p>
                    )}

                    <span className="text-xs text-slate-600">
                      {form.description.length} characters
                    </span>
                  </div>
                </div>

                <InputField
                  label="Location"
                  required
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={form.location}
                  onChange={(value) =>
                    updateField("location", value)
                  }
                  error={errors.location}
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>
            </motion.section>

            {/* Employment Details */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
            >
              <SectionHeader
                icon={<Users className="h-5 w-5" />}
                title="Employment details"
                description="Define how and where candidates will work."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Work arrangement"
                  value={form.remoteType}
                  onChange={(value) =>
                    updateField(
                      "remoteType",
                      value as RemoteType,
                    )
                  }
                  icon={<Laptop className="h-4 w-4" />}
                  options={[
                    {
                      value: "REMOTE",
                      label: "Remote",
                    },
                    {
                      value: "HYBRID",
                      label: "Hybrid",
                    },
                    {
                      value: "ONSITE",
                      label: "On-site",
                    },
                  ]}
                />

                <SelectField
                  label="Employment type"
                  value={form.employmentType}
                  onChange={(value) =>
                    updateField(
                      "employmentType",
                      value as EmploymentType,
                    )
                  }
                  icon={<Clock3 className="h-4 w-4" />}
                  options={[
                    {
                      value: "FULL_TIME",
                      label: "Full Time",
                    },
                    {
                      value: "PART_TIME",
                      label: "Part Time",
                    },
                    {
                      value: "CONTRACT",
                      label: "Contract",
                    },
                    {
                      value: "INTERNSHIP",
                      label: "Internship",
                    },
                    {
                      value: "FREELANCE",
                      label: "Freelance",
                    },
                  ]}
                />

                <SelectField
                  label="Experience level"
                  value={form.experienceLevel}
                  onChange={(value) =>
                    updateField(
                      "experienceLevel",
                      value as ExperienceLevel,
                    )
                  }
                  icon={<Users className="h-4 w-4" />}
                  options={[
                    {
                      value: "ENTRY",
                      label: "Entry Level",
                    },
                    {
                      value: "JUNIOR",
                      label: "Junior",
                    },
                    {
                      value: "MID",
                      label: "Mid Level",
                    },
                    {
                      value: "SENIOR",
                      label: "Senior",
                    },
                    {
                      value: "LEAD",
                      label: "Lead",
                    },
                  ]}
                />

                <SelectField
                  label="Publishing status"
                  value={form.status}
                  onChange={(value) =>
                    updateField(
                      "status",
                      value as JobStatus,
                    )
                  }
                  icon={<Globe2 className="h-4 w-4" />}
                  options={[
                    {
                      value: "PUBLISHED",
                      label: "Publish immediately",
                    },
                    {
                      value: "DRAFT",
                      label: "Save as draft",
                    },
                  ]}
                />
              </div>
            </motion.section>

            {/* Salary */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
            >
              <SectionHeader
                icon={<CircleDollarSign className="h-5 w-5" />}
                title="Compensation"
                description="Give candidates a clear idea of the salary range."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-3">
                <InputField
                  label="Minimum salary"
                  required
                  type="number"
                  placeholder="30000"
                  value={form.salaryMin}
                  onChange={(value) =>
                    updateField("salaryMin", value)
                  }
                  error={errors.salaryMin}
                  icon={
                    <CircleDollarSign className="h-4 w-4" />
                  }
                />

                <InputField
                  label="Maximum salary"
                  required
                  type="number"
                  placeholder="60000"
                  value={form.salaryMax}
                  onChange={(value) =>
                    updateField("salaryMax", value)
                  }
                  error={errors.salaryMax}
                  icon={
                    <CircleDollarSign className="h-4 w-4" />
                  }
                />

                <SelectField
                  label="Currency"
                  value={form.salaryCurrency}
                  onChange={(value) =>
                    updateField("salaryCurrency", value)
                  }
                  icon={
                    <CircleDollarSign className="h-4 w-4" />
                  }
                  options={[
                    {
                      value: "BDT",
                      label: "BDT — Bangladeshi Taka",
                    },
                    {
                      value: "USD",
                      label: "USD — US Dollar",
                    },
                    {
                      value: "EUR",
                      label: "EUR — Euro",
                    },
                    {
                      value: "GBP",
                      label: "GBP — Pound Sterling",
                    },
                  ]}
                />
              </div>
            </motion.section>

            {/* Skills */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
            >
              <SectionHeader
                icon={<Code2 className="h-5 w-5" />}
                title="Required skills"
                description="Add the technical skills candidates should have."
              />

              <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                  <input
                    value={skillName}
                    onChange={(event) =>
                      setSkillName(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="e.g. React, Node.js, PostgreSQL"
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"
                  />

                  <SelectField
                    label=""
                    value={skillPriority}
                    onChange={(value) =>
                      setSkillPriority(
                        value as SkillPriority,
                      )
                    }
                    options={[
                      {
                        value: "high",
                        label: "High priority",
                      },
                      {
                        value: "medium",
                        label: "Medium priority",
                      },
                      {
                        value: "low",
                        label: "Low priority",
                      },
                    ]}
                  />

                  <button
                    type="button"
                    onClick={addSkill}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {errors.skills && (
                <p className="mt-3 text-xs text-red-400">
                  {errors.skills}
                </p>
              )}

              {form.skills.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {form.skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{
                        opacity: 0,
                        x: -12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.03,
                      }}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                          <Code2 className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {skill.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            Required skill
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={skill.priority}
                          onChange={(event) =>
                            updateSkillPriority(
                              skill.id,
                              event.target.value as SkillPriority,
                            )
                          }
                          className="h-9 rounded-lg border border-white/10 bg-slate-900 px-3 text-xs font-medium text-slate-300 outline-none"
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
                            removeSkill(skill.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                  <Code2 className="mx-auto h-7 w-7 text-slate-600" />

                  <p className="mt-3 text-sm font-medium text-slate-400">
                    No skills added yet
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Add skills to improve AI candidate matching.
                  </p>
                </div>
              )}
            </motion.section>

            {/* Deadline */}
            <motion.section
              variants={reveal}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
            >
              <SectionHeader
                icon={<CalendarDays className="h-5 w-5" />}
                title="Application deadline"
                description="Set the final date candidates can apply."
              />

              <div className="mt-7 max-w-md">
                <InputField
                  label="Deadline"
                  required
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(value) =>
                    updateField("deadline", value)
                  }
                  error={errors.deadline}
                  icon={<CalendarDays className="h-4 w-4" />}
                />
              </div>
            </motion.section>

            {/* Actions */}
            <motion.div
              variants={reveal}
              className="sticky bottom-4 z-30 rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl sm:p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/my-jobs"
                  className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Link>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      updateField("status", "DRAFT");

                      setTimeout(() => {
                        void submitJob();
                      }, 0);
                    }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      updateField("status", "PUBLISHED");

                      setTimeout(() => {
                        void submitJob();
                      }, 0);
                    }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Publish Job
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* =========================
              RIGHT PREVIEW
          ========================== */}
          <div className="xl:sticky xl:top-6 xl:h-fit">
            <motion.div
              variants={scaleIn}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                      Live Preview
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                      Candidate view
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/20">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold text-white">
                        {form.title ||
                          "Your Job Title"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Your Company
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <PreviewBadge
                      icon={
                        <MapPin className="h-3.5 w-3.5" />
                      }
                      text={
                        form.location || "Location"
                      }
                    />

                    <PreviewBadge
                      icon={
                        <Laptop className="h-3.5 w-3.5" />
                      }
                      text={formatEnum(form.remoteType)}
                    />

                    <PreviewBadge
                      icon={
                        <Clock3 className="h-3.5 w-3.5" />
                      }
                      text={formatEnum(
                        form.employmentType,
                      )}
                    />
                  </div>

                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <p className="text-xs text-slate-500">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {formatSalary(
                        form.salaryMin,
                        form.salaryMax,
                        form.salaryCurrency,
                      )}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      About this role
                    </p>

                    <p className="mt-2 line-clamp-6 whitespace-pre-line text-sm leading-6 text-slate-400">
                      {form.description ||
                        "Your job description will appear here. Explain the role, responsibilities, expectations, and why candidates should join your team."}
                    </p>
                  </div>

                  {form.skills.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Required skills
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-lg border border-indigo-400/10 bg-indigo-400/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs text-slate-500">
                        Experience
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatEnum(
                          form.experienceLevel,
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Deadline
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {form.deadline
                          ? new Date(
                              form.deadline,
                            ).toLocaleDateString(
                              "en-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Matching Card */}
            <motion.div
              variants={reveal}
              className="mt-5 rounded-3xl border border-indigo-400/15 bg-indigo-500/[0.06] p-5 backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    AI candidate matching
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Your required skills will be used by the
                    AI matching system to identify candidates
                    who best fit this position.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <MiniMetric
                  value={String(form.skills.length)}
                  label="Skills"
                />

                <MiniMetric
                  value={`${progress}%`}
                  label="Complete"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionHeader({
  icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-bold text-white sm:text-lg">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
}

function InputField({
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}

        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`h-12 w-full rounded-xl border bg-black/20 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${
            icon ? "pl-11 pr-4" : "px-4"
          } ${
            error
              ? "border-red-400/50 focus:ring-red-400/20"
              : "border-white/10 focus:border-indigo-400/50 focus:ring-indigo-400/20"
          }`}
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  icon?: React.ReactNode;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  icon,
}: SelectFieldProps) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}

        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`h-12 w-full appearance-none rounded-xl border border-white/10 bg-black/20 pr-10 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 ${
            icon ? "pl-11" : "pl-4"
          }`}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-slate-900"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}

interface PreviewBadgeProps {
  icon: React.ReactNode;
  text: string;
}

function PreviewBadge({
  icon,
  text,
}: PreviewBadgeProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-400">
      {icon}
      <span className="truncate">{text}</span>
    </span>
  );
}

interface MiniMetricProps {
  value: string;
  label: string;
}

function MiniMetric({
  value,
  label,
}: MiniMetricProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-3">
      <p className="text-lg font-bold text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}