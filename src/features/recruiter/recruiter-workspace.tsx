"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowUpRight, Bot, BriefcaseBusiness, Building2, Check, Copy, Loader2, Plus, Sparkles, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { recruiterApi, type Application, type Company, type RecruiterJob } from "@/lib/api/recruiter.api";
import { toast } from "sonner";

const emptyJob = { title: "", description: "", location: "", remoteType: "ONSITE", employmentType: "FULL_TIME", experienceLevel: "MID", salaryMin: "", salaryMax: "", salaryCurrency: "BDT", deadline: "", requiredSkills: "", status: "DRAFT" };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const errorText = (error: unknown) => error instanceof Error ? error.message : "Something went wrong";

function Header({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{description}</p></div>{action}</div>;
}

function Stat({ icon: Icon, label, value, tone = "bg-primary/10 text-primary" }: { icon: typeof Users; label: string; value: number | string; tone?: string }) {
  return <motion.div variants={item} className="rounded-2xl border bg-card p-5 shadow-sm"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></motion.div>;
}

export function RecruiterDashboard() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]); const [applications, setApplications] = useState<Application[]>([]); const [company, setCompany] = useState<Company | null>(null); const [error, setError] = useState("");
  useEffect(() => { Promise.all([recruiterApi.getJobs().catch(() => []), recruiterApi.getApplications().catch(() => []), recruiterApi.getCompany().catch(() => null)]).then(([j, a, c]) => { setJobs(j || []); setApplications(a || []); setCompany(c); }).catch((e) => setError(errorText(e))); }, []);
  const published = jobs.filter((job) => job.status === "PUBLISHED").length;
  return <motion.div variants={stagger} initial="hidden" animate="show"><Header eyebrow="Recruiter command center" title={`Build your next great team${company ? ` at ${company.name}` : ""}.`} description="Keep your hiring pipeline moving with one calm, focused workspace." action={<Button asChild><a href="/recruiter/jobs"><Plus className="mr-2 h-4 w-4" />Post a job</a></Button>} />{error && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={BriefcaseBusiness} label="Total job posts" value={jobs.length}/><Stat icon={Sparkles} label="Published roles" value={published} tone="bg-emerald-500/10 text-emerald-600"/><Stat icon={Users} label="Applications" value={applications.length} tone="bg-blue-500/10 text-blue-600"/><Stat icon={Building2} label="Company profile" value={company ? "Ready" : "Setup"} tone="bg-amber-500/10 text-amber-600"/></div><div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]"><Card><CardHeader><CardTitle>Recent roles</CardTitle><CardDescription>Your latest hiring activity</CardDescription></CardHeader><CardContent>{jobs.length ? <div className="space-y-2">{jobs.slice(0, 5).map((job) => <a key={job.id} href="/recruiter/jobs" className="flex items-center justify-between rounded-xl border p-4 transition hover:-translate-y-0.5 hover:bg-muted/50"><div><p className="font-medium">{job.title}</p><p className="text-xs text-muted-foreground">{job._count?.jobApplications || 0} applicants · {job.status || "DRAFT"}</p></div><ArrowUpRight className="h-4 w-4 text-muted-foreground"/></a>)}</div> : <p className="py-8 text-center text-sm text-muted-foreground">No jobs yet. Your next hire starts here.</p>}</CardContent></Card><Card className="overflow-hidden border-primary/20 bg-linear-to-br from-primary/10 via-card to-card"><CardHeader><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></div><CardTitle>AI recruiting copilot</CardTitle><CardDescription>Ask about your applicants, shortlist talent, or compare candidates.</CardDescription></CardHeader><CardContent><Button variant="outline" asChild><a href="/recruiter/applications">Open assistant <ArrowUpRight className="ml-2 h-4 w-4"/></a></Button></CardContent></Card></div></motion.div>;
}

function JobForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: typeof emptyJob;
  onSave: (data: typeof emptyJob) => void;
  onCancel?: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [validationError, setValidationError] = useState("");

  const set = (
    key: keyof typeof emptyJob,
    value: string
  ) =>
    setForm((old) => ({
      ...old,
      [key]: value,
    }));

  const submit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setValidationError("");

    const requiredFields: Array<
      [
        keyof typeof emptyJob,
        string,
        string
      ]
    > = [
      [
        "title",
        "Job title",
        "Enter a job title.",
      ],
      [
        "description",
        "Description",
        "Describe the responsibilities (at least 20 characters).",
      ],
      [
        "location",
        "Location",
        "Enter the job location.",
      ],
      [
        "deadline",
        "Deadline",
        "Choose a future deadline.",
      ],
      [
        "requiredSkills",
        "Required skills",
        "Add at least one required skill.",
      ],
    ];

    const missing =
      requiredFields.find(
        ([key]) =>
          !form[key].trim()
      );

    if (missing) {
      setValidationError(missing[2]);
      toast.error(`${missing[1]} is required`, { description: missing[2] });

      return;
    }

    if (
      form.title.trim().length < 3
    ) {
      setValidationError("Job title must be at least 3 characters.");
      toast.error("Invalid job title", { description: "Use at least 3 characters." });

      return;
    }

    if (
      form.description.trim().length < 20
    ) {
      setValidationError("Description must be at least 20 characters.");
      toast.error("Description is too short", { description: "Use at least 20 characters." });

      return;
    }

    if (
      new Date(
        `${form.deadline}T23:59:59`
      ) <= new Date()
    ) {
      setValidationError("Deadline must be in the future.");
      toast.error("Invalid deadline", { description: "Choose a future date." });

      return;
    }

    const minimum = form.salaryMin ? Number(form.salaryMin) : undefined;
    const maximum = form.salaryMax ? Number(form.salaryMax) : undefined;
    if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
      setValidationError("Minimum salary cannot be greater than maximum salary.");
      toast.error("Invalid salary range", { description: "Minimum salary must not exceed maximum salary." });
      return;
    }

    onSave(form);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">

        <label className="sm:col-span-2">
          <span className="field-label">
            Job title <small>*</small>
          </span>

          <Input
            value={form.title}
            onChange={(e) =>
              set(
                "title",
                e.target.value
              )
            }
            placeholder="Senior Product Designer"
          />
        </label>

        <label>
          <span className="field-label">
            Location <small>*</small>
          </span>

          <Input
            value={form.location}
            onChange={(e) =>
              set(
                "location",
                e.target.value
              )
            }
            placeholder="Dhaka, Bangladesh"
          />
        </label>

        <label>
          <span className="field-label">Minimum salary <small>(optional)</small></span>
          <Input type="number" min="0" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="50000" />
        </label>

        <label>
          <span className="field-label">Maximum salary <small>(optional)</small></span>
          <Input type="number" min="0" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="100000" />
        </label>

        <label>
          <span className="field-label">Currency</span>
          <Input maxLength={10} value={form.salaryCurrency} onChange={(e) => set("salaryCurrency", e.target.value.toUpperCase())} placeholder="BDT" />
        </label>

        <label>
          <span className="field-label">
            Deadline <small>*</small>
          </span>

          <Input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              set(
                "deadline",
                e.target.value
              )
            }
          />
        </label>

        <label>
          <span className="field-label">
            Work mode <small>*</small>
          </span>

          <select
            className="control"
            value={form.remoteType}
            onChange={(e) =>
              set(
                "remoteType",
                e.target.value
              )
            }
          >
            <option>
              ONSITE
            </option>

            <option>
              REMOTE
            </option>

            <option>
              HYBRID
            </option>
          </select>
        </label>

        <label>
          <span className="field-label">
            Employment <small>*</small>
          </span>

          <select
            className="control"
            value={form.employmentType}
            onChange={(e) =>
              set(
                "employmentType",
                e.target.value
              )
            }
          >
            <option>
              FULL_TIME
            </option>

            <option>
              PART_TIME
            </option>

            <option>
              CONTRACT
            </option>

            <option>
              INTERNSHIP
            </option>

            <option>
              FREELANCE
            </option>
          </select>
        </label>

        <label>
          <span className="field-label">
            Experience <small>*</small>
          </span>

          <select
            className="control"
            value={form.experienceLevel}
            onChange={(e) =>
              set(
                "experienceLevel",
                e.target.value
              )
            }
          >
            <option>
              ENTRY
            </option>

            <option>
              JUNIOR
            </option>

            <option>
              MID
            </option>

            <option>
              SENIOR
            </option>

            <option>
              LEAD
            </option>
          </select>
        </label>

        <label>
          <span className="field-label">
            Required skills{" "}
            <small>
              * comma separated
            </small>
          </span>

          <Input
            value={form.requiredSkills}
            onChange={(e) =>
              set(
                "requiredSkills",
                e.target.value
              )
            }
            placeholder="React, TypeScript, Figma"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="field-label">
            Description <small>*</small>
          </span>

          <textarea
            className="control min-h-32 resize-y"
            value={form.description}
            onChange={(e) =>
              set(
                "description",
                e.target.value
              )
            }
            placeholder="What will this person own?"
          />
        </label>
      </div>

      <AnimatePresence>
        {validationError && (
          <motion.p initial={{ opacity: 0, height: 0, y: -6 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -6 }} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
            {validationError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-2">

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={saving}
        >
          {saving && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {saving
            ? "Saving…"
            : "Save job"}
        </Button>
      </div>
    </form>
  );
}


export function RecruiterJobs() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<RecruiterJob | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () =>
    recruiterApi
      .getJobs()
      .then(setJobs)
      .catch((e) => {
        setError(errorText(e));
        return [] as RecruiterJob[];
      });

  useEffect(() => {
    load();
  }, []);

  const payload = (data: typeof emptyJob) => ({
    title: data.title.trim(),
    description: data.description.trim(),
    location: data.location.trim() || undefined,
    remoteType: data.remoteType,
    employmentType: data.employmentType,
    experienceLevel: data.experienceLevel,
    salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
    salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
    salaryCurrency: data.salaryCurrency,
    deadline: new Date(`${data.deadline}T23:59:59`).toISOString(),
    requiredSkills: data.requiredSkills
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean),
    preferredSkills: [],
    status: data.status,
  });

  const save = async (data: typeof emptyJob) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editing) {
        await recruiterApi.updateJob(editing, payload(data));
        setSuccess("Job updated successfully.");
        toast.success("Job updated successfully");
      } else {
        await recruiterApi.createJob(payload(data));
        setSuccess("Job created successfully.");
        toast.success("Job created successfully", {
          description: "Your role is saved as a draft.",
        });
      }

      setEditing(null);
      setCreating(false);
      await load();
    } catch (e) {
      const message = errorText(e);
      setError(message);
      toast.error("Could not save job", { description: message });
    } finally {
      setSaving(false);
    }
  };

  const action = async (fn: () => Promise<unknown>, message: string) => {
    setError("");
    setSuccess("");

    try {
      await fn();
      setSuccess(message);
      toast.success(message);
      await load();
    } catch (e) {
      const message = errorText(e);
      setError(message);
      toast.error("Job action failed", { description: message });
    }
  };

  const statusClassMap: Record<string, string> = {
    DRAFT: "bg-slate-900/5 text-slate-700 ring-1 ring-slate-200",
    PUBLISHED: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-200",
    CLOSED: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-200",
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="overflow-hidden rounded-[28px] border border-border/80 bg-[radial-gradient(circle_at_top_left,_rgba(120,119,198,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(245,247,255,0.96))] p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.38)] sm:p-6">

      <Button
  asChild
  variant="outline"
  className="group border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
>
  <a href="/recruiter/dashboard">
    <Plus className="mr-2 h-4 w-4 rotate-45 transition-transform duration-200 group-hover:rotate-0" />
    Back to Dashboard
  </a>
</Button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">
              Hiring pipeline
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Your job posts
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Create, publish, and tune every role from one calm, high-conviction workspace.
            </p>
          </div>
                   

          <Button
            onClick={() => {
              setSuccess("");
              setError("");
              setCreating(true);
            }}
            className="h-11 rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            <Plus className="mr-2 h-4 w-4" />
            New job
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            role="alert"
            className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium shadow-sm ${
              error
                ? "border-red-200 bg-red-50/90 text-red-700"
                : "border-emerald-200 bg-emerald-50/90 text-emerald-700"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
              {error ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </div>
            <span>{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(creating || editing) && (
          <motion.div
            key={editing ?? "create-job"}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-6 overflow-hidden border border-primary/20 bg-[linear-gradient(135deg,rgba(99,102,241,0.06),rgba(255,255,255,0.98),rgba(236,242,255,0.88))] shadow-[0_24px_80px_-40px_rgba(79,70,229,0.6)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">
                  {editing ? "Edit job" : "Create a job post"}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Clear details help the matching engine find better candidates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JobForm
                  initial={
                    editing
                      ? (() => {
                          const j = jobs.find((x) => x.id === editing);
                          return {
                            ...emptyJob,
                            title: j?.title || "",
                            description: j?.description || "",
                            location: j?.location || "",
                            remoteType: j?.remoteType || "ONSITE",
                            employmentType: j?.employmentType || "FULL_TIME",
                            experienceLevel: j?.experienceLevel || "MID",
                            salaryMin: j?.salaryMin?.toString() || "",
                            salaryMax: j?.salaryMax?.toString() || "",
                            salaryCurrency: j?.salaryCurrency || "BDT",
                            requiredSkills: j?.requiredSkills?.map((s) => s.name).join(", ") || "",
                            deadline: j?.deadline?.slice(0, 10) || "",
                          };
                        })()
                      : emptyJob
                  }
                  onSave={save}
                  onCancel={() => {
                    setCreating(false);
                    setEditing(null);
                  }}
                  saving={saving}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {jobs.length ? (
          jobs.map((job) => (
            <motion.div
              key={job.id}
              variants={item}
              whileHover={{ y: -4, scale: 1.005 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <Card className="overflow-hidden border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_18px_55px_-34px_rgba(15,23,42,0.38)]">
                <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                        {job.title}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          statusClassMap[job.status || "DRAFT"] || statusClassMap.DRAFT
                        }`}
                      >
                        {job.status || "DRAFT"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span>{job.location || "Remote friendly"}</span>
                      <span className="text-slate-300">•</span>
                      <span>{job.remoteType || "ONSITE"}</span>
                      <span className="text-slate-300">•</span>
                      <span>{job._count?.jobApplications || 0} applicants</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(job.requiredSkills || []).slice(0, 5).map((s) => (
                        <span
                          key={s.id || s.name}
                          className="rounded-lg border border-primary/10 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50"
                      onClick={() => setEditing(job.id)}
                    >
                      Edit
                    </Button>

                    {job.status === "PUBLISHED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                        onClick={() => action(() => recruiterApi.closeJob(job.id), "Job closed successfully.")}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Close
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-500"
                        onClick={() => action(() => recruiterApi.publishJob(job.id), "Job published successfully.")}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Publish
                      </Button>
                    )}

                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      onClick={() => action(() => recruiterApi.duplicateJob(job.id), "Job duplicated successfully.")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon-sm"
                      variant="destructive"
                      className="h-9 w-9 rounded-xl"
                      onClick={() => setDeleteTarget(job)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={item}
            className="rounded-[28px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,rgba(248,250,252,0.92),rgba(255,255,255,0.96))] p-12 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.3)]"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No roles yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Start with a role brief and turn it into a strong candidate pipeline.
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_-30px_rgba(15,23,42,0.7)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Delete “{deleteTarget.title}”?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This permanently removes the role and its associated data. This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={deleting}
                  className="rounded-xl"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  disabled={deleting}
                  className="rounded-xl"
                  onClick={async () => {
                    setDeleting(true);
                    try {
                      await recruiterApi.deleteJob(deleteTarget.id);
                      setDeleteTarget(null);
                      setSuccess("Job deleted successfully.");
                      toast.success("Job deleted successfully");
                      await load();
                    } catch (e) {
                      const message = errorText(e);
                      setError(message);
                      toast.error("Could not delete job", { description: message });
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {deleting ? "Deleting…" : "Delete job"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RecruiterApplications() {
  const [apps, setApps] = useState<Application[]>([]); const [query, setQuery] = useState(""); const [answer, setAnswer] = useState<unknown>(null); const [asking, setAsking] = useState(false); const [error, setError] = useState("");
  const load = () => recruiterApi.getApplications().then(setApps).catch((e) => setError(errorText(e))); useEffect(() => { load(); }, []);
  const filtered = useMemo(() => apps.filter((a) => `${a.candidateProfile?.user?.name} ${a.job?.title}`.toLowerCase().includes(query.toLowerCase())), [apps, query]);
  const ask = async () => { if (!query.trim()) return; setAsking(true); setError(""); try { setAnswer(await recruiterApi.assistant({ query, limit: 8 })); } catch (e) { setError(errorText(e)); } finally { setAsking(false); } };
  return <motion.div variants={stagger} initial="hidden" animate="show"><Header eyebrow="Find talent" title="Applicants, in focus." description="Review your complete pipeline, move candidates forward, and ask AI for a second opinion."/><div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><Card><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>All applicants</CardTitle><CardDescription>{apps.length} candidates across your roles</CardDescription></div><Input className="sm:max-w-xs" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search candidates…"/></div></CardHeader><CardContent><div className="space-y-2">{filtered.map((application) => <div key={application.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{application.candidateProfile?.user?.name || "Candidate"}</p><p className="text-sm text-muted-foreground">{application.candidateProfile?.headline || application.job?.title || "Application"}</p><p className="mt-1 text-xs text-muted-foreground">{application.candidateProfile?.user?.email || ""}</p></div><select className="control h-9 w-full sm:w-36" value={application.status || "PENDING"} onChange={async (e) => { try { await recruiterApi.updateApplication(application.id, e.target.value); await load(); } catch (err) { setError(errorText(err)); } }}><option>PENDING</option><option>REVIEWING</option><option>SHORTLISTED</option><option>REJECTED</option><option>ACCEPTED</option></select></div>)}{!filtered.length && <p className="py-10 text-center text-sm text-muted-foreground">No applicants match this search.</p>}</div></CardContent></Card><Card className="h-fit border-primary/20 bg-linear-to-br from-primary/10 to-card"><CardHeader><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5"/></div><CardTitle>Ask your AI recruiter</CardTitle><CardDescription>Try “Who has the strongest React experience?”</CardDescription></CardHeader><CardContent><div className="space-y-3"><textarea className="control min-h-28" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about your talent pool…"/><Button className="w-full" onClick={ask} disabled={asking || !query.trim()}>{asking && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{asking ? "Thinking…" : "Analyze applicants"}</Button>{answer !== null && <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-background/80 p-4 text-xs leading-5">{typeof answer === "string" ? answer : JSON.stringify(answer, null, 2)}</pre>}</div></CardContent></Card></div>{error && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}</motion.div>;
}

export function RecruiterCompany() {
  const [company, setCompany] = useState<Company | null>(null); const [form, setForm] = useState({name:"", description:"", website:""}); const [penalties, setPenalties] = useState<unknown[]>([]); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => { Promise.all([recruiterApi.getCompany().catch(() => null), recruiterApi.getPenalties().catch(() => [])]).then(([c, p]) => { setCompany(c); setPenalties(p || []); if (c) setForm({name:c.name, description:c.description || "", website:c.website || ""}); }); }, []);
  const save = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(""); const payload = { name: form.name.trim(), description: form.description.trim() || undefined, website: form.website.trim() || undefined }; try { const result = company ? await recruiterApi.updateCompany(payload) : await recruiterApi.createCompany(payload); setCompany(result); } catch (err) { setError(errorText(err)); } finally { setSaving(false); } };
  return <motion.div variants={stagger} initial="hidden" animate="show"><Header eyebrow="Company hub" title="Make your company memorable." description="A complete company profile gives every candidate the context to say yes."/><div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]"><Card><CardHeader><CardTitle>{company ? "Company profile" : "Create your company"}</CardTitle><CardDescription>{company ? "Keep your public hiring identity current." : "You need a company before publishing jobs."}</CardDescription></CardHeader><CardContent><form onSubmit={save} className="space-y-4"><label><span className="field-label">Company name</span><Input required minLength={2} value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Acme Labs"/></label><label><span className="field-label">Website</span><Input type="url" value={form.website} onChange={(e) => setForm({...form,website:e.target.value})} placeholder="https://acme.com"/></label><label><span className="field-label">About the company</span><textarea className="control min-h-36" value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} placeholder="Tell candidates what makes your team special…"/></label><Button disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{company ? "Update profile" : "Create company"}</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Account notices</CardTitle><CardDescription>Penalties and complaint outcomes from admin</CardDescription></CardHeader><CardContent>{penalties.length ? <div className="space-y-3">{penalties.map((p, i) => <div key={i} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm">{JSON.stringify(p)}</div>)}</div> : <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700">No penalties on your company account.</div>}</CardContent></Card></div>{error && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}</motion.div>;
}