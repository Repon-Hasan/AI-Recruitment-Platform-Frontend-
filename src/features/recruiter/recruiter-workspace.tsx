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
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50"
                      onClick={() => setEditing(job.id)}
                    >
                      <a href={`/recruiter/jobs/${job.id}/rank-candidates`}>Rank-candidate</a>
                    </Button>

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

const statusTone: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  REVIEWING: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  SHORTLISTED: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  REJECTED: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  ACCEPTED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  APPLIED: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  SCREENING: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  INTERVIEW: "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200",
  OFFER: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
  HIRED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  WITHDRAWN: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
};

const renderAssistantText = (text: string) => {
  const blocks = text.split(/\n\s*\n/).filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

    if (!lines.length) return null;

    if (lines.every((line) => line.startsWith("* ") || line.startsWith("- "))) {
      return (
        <ul key={`block-${index}`} className="space-y-2 pl-5 text-sm leading-6 text-slate-100">
          {lines.map((line, lineIndex) => (
            <li key={`${index}-${lineIndex}`} className="list-disc marker:text-indigo-300">
              {line.replace(/^[-*]\s*/, "")}
            </li>
          ))}
        </ul>
      );
    }

    if (lines.some((line) => line.startsWith("### "))) {
      return (
        <div key={`block-${index}`} className="space-y-2">
          {lines.map((line, lineIndex) => {
            if (line.startsWith("### ")) {
              return (
                <h4 key={`${index}-${lineIndex}`} className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200">
                  {line.replace(/^###\s*/, "")}
                </h4>
              );
            }

            if (line.startsWith("* ") || line.startsWith("- ")) {
              return (
                <p key={`${index}-${lineIndex}`} className="text-sm leading-6 text-slate-100">
                  {line.replace(/^[-*]\s*/, "")}
                </p>
              );
            }

            return (
              <p key={`${index}-${lineIndex}`} className="text-sm leading-6 text-slate-100">
                {line}
              </p>
            );
          })}
        </div>
      );
    }

    return (
      <p key={`block-${index}`} className="text-sm leading-6 text-slate-100">
        {block}
      </p>
    );
  });
};

export function RecruiterApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [answer, setAnswer] = useState<unknown>(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);

  const load = () =>
    recruiterApi
      .getApplications()
      .then(setApps)
      .catch((e) => setError(errorText(e)));

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return apps;

    return apps.filter((application) => {
      const candidateName = application.candidateProfile?.user?.name || "";
      const jobTitle = application.job?.title || "";
      const email = application.candidateProfile?.user?.email || "";
      const headline = application.candidateProfile?.headline || "";
      const status = application.status || "";

      return [candidateName, jobTitle, email, headline, status]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [apps, searchTerm]);

  const ask = async () => {
    const trimmed = aiPrompt.trim();
    if (!trimmed) return;

    setAsking(true);
    setError("");

    try {
      const result = await recruiterApi.assistant({ query: trimmed, limit: 8 });
      setAnswer(result);
    } catch (e) {
      setError(errorText(e));
      setAnswer(null);
    } finally {
      setAsking(false);
    }
  };

  const assistantData = useMemo(() => {
    if (!answer || typeof answer !== "object") {
      return null;
    }

    const result = answer as Record<string, unknown>;
    const job = result.job && typeof result.job === "object" ? (result.job as Record<string, unknown>) : null;
    const candidates = Array.isArray(result.candidates) ? (result.candidates as Array<Record<string, unknown>>) : [];
    const answerText = typeof result.answer === "string" ? result.answer : "";

    return { job, candidates, answerText };
  }, [answer]);

  return (
    <>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        <div className="overflow-hidden rounded-[30px] border border-indigo-200/70 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.24),transparent_28%),linear-gradient(135deg,#eef2ff_0%,#f8fafc_35%,#ffffff_100%)] p-5 shadow-[0_25px_80px_-35px_rgba(99,102,241,0.45)] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-600">Find talent</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Applicants, in focus.</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Review your complete pipeline, move candidates forward, and ask AI for a second opinion.
              </p>
            </div>

            <Button asChild variant="outline" className="group h-11 rounded-xl border-slate-200 bg-white/90 px-4 font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900">
              <a href="/recruiter/dashboard">
                <ArrowUpRight className="mr-2 h-4 w-4 rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                Back to dashboard
              </a>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm"
              role="alert"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <motion.div variants={item}>
            <Card className="overflow-hidden border border-slate-200 bg-white/95 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-900">All applicants</CardTitle>
                    <CardDescription className="mt-1 text-slate-600">
                      {apps.length} candidates across your roles
                    </CardDescription>
                  </div>

                  <div className="w-full lg:max-w-sm">
                    <label className="block">
                      <span className="sr-only">Search applicants</span>
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, role, email, or status"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-inner focus-visible:ring-indigo-500"
                      />
                    </label>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Search helps</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {filtered.length ? (
                    filtered.map((application) => {
                      const name = application.candidateProfile?.user?.name || "Candidate";
                      const initials = name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase() || "C")
                        .join("") || "C";

                      const status = application.status || "PENDING";
                      const candidateId = application.candidateProfile?.id || application.id;

                      return (
                        <motion.div
                          key={application.id}
                          variants={item}
                          className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(248,250,252,0.96))] p-4 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.35)]"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-md shadow-indigo-500/25">
                                {initials}
                              </div>

                              <div className="min-w-0">
                                <p className="text-base font-semibold text-slate-900">{name}</p>
                                <p className="text-sm text-slate-600">{application.candidateProfile?.headline || application.job?.title || "Application in progress"}</p>
                                <p className="mt-1 text-xs text-slate-500">{application.candidateProfile?.user?.email || "No email provided"}</p>
                              </div>
                            </div>

                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusTone[status] || statusTone.PENDING}`}>
                              {status}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Applied role</p>
                              <p className="mt-2 text-sm font-medium text-slate-800">{application.job?.title || "Role not available"}</p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Location</p>
                              <p className="mt-2 text-sm font-medium text-slate-800">
                                {application.candidateProfile?.location || "Location not shared"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-slate-500">
                                Applied {application.createdAt ? new Date(application.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" }) : "recently"}
                              </p>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-600">Candidate ID: {candidateId}</p>
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                onClick={() => setSelectedCandidate(application)}
                              >
                                View profile
                              </Button>

                              <select
                                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-40"
                                value={status}
                                onChange={async (e) => {
                                  try {
                                    await recruiterApi.updateApplication(application.id, e.target.value);
                                    await load();
                                  } catch (err) {
                                    setError(errorText(err));
                                  }
                                }}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="REVIEWING">REVIEWING</option>
                                <option value="SHORTLISTED">SHORTLISTED</option>
                                <option value="REJECTED">REJECTED</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      variants={item}
                      className="rounded-[28px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(255,255,255,0.96))] p-12 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.28)]"
                    >
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        <Users className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">No applicants match this search</h3>
                      <p className="mt-2 text-sm text-slate-600">Try a candidate name, job title, email, or status keyword.</p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-fit overflow-hidden border border-indigo-200 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(255,255,255,1),rgba(239,246,255,0.9))] shadow-[0_28px_90px_-40px_rgba(79,70,229,0.55)]">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl text-slate-900">AI recruiting copilot</CardTitle>
                <CardDescription className="text-slate-600">
                  Ask about talent fit, compare candidates, or shortlist based on role requirements.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-indigo-200 bg-white/90 p-3 text-sm text-slate-700 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask: Who has the strongest React experience? or Search for backend candidates."
                />

                <Button className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500" onClick={ask} disabled={asking || !aiPrompt.trim()}>
                  {asking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {asking ? "Thinking…" : "Analyze applicants"}
                </Button>

                {answer !== null && (
                  <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-slate-950 p-4 text-slate-50 shadow-inner shadow-indigo-950/30">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-200">
                        <Bot className="h-4 w-4" />
                        AI assessment
                      </div>

                      {assistantData?.job && (
                        <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-200">
                          {String(assistantData.job.title || "Role")}
                        </span>
                      )}
                    </div>

                    {assistantData?.candidates?.length ? (
                      <div className="space-y-3">
                        {assistantData.candidates.map((candidate, index) => {
                          const candidateName = typeof candidate.name === "string" ? candidate.name : "Candidate";
                          const scoreValue = typeof candidate.score === "number" ? candidate.score : null;
                          const breakdown = candidate.breakdown && typeof candidate.breakdown === "object" ? (candidate.breakdown as Record<string, unknown>) : {};

                          return (
                            <div key={`${candidateName}-${index}`} className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-sm">
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-medium text-slate-50">{candidateName}</p>
                                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                                  {scoreValue !== null ? `${scoreValue.toFixed(2)}%` : "No score"}
                                </span>
                              </div>

                              {Object.keys(breakdown).length > 0 && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                  {Object.entries(breakdown).map(([key, value]) => (
                                    <div key={key} className="rounded-lg border border-white/10 bg-slate-900/40 p-2">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                      </p>
                                      <p className="mt-1 text-sm text-slate-100">
                                        {typeof value === "number" ? `${value.toFixed(2)}%` : String(value)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    {assistantData?.answerText ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">Candidate summary</p>
                        <div className="space-y-3">{renderAssistantText(assistantData.answerText)}</div>
                      </div>
                    ) : typeof answer === "string" ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-100 whitespace-pre-wrap">
                        {answer}
                      </div>
                    ) : (
                      <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-slate-100">
                        {JSON.stringify(answer, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_120px_-35px_rgba(15,23,42,0.8)]"
            >
              <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#eef2ff_0%,#ffffff_50%,#f8fafc_100%)] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/25">
                      {selectedCandidate.candidateProfile?.user?.name?.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "C").join("") || "C"}
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-600">Candidate profile</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        {selectedCandidate.candidateProfile?.user?.name || "Candidate"}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {selectedCandidate.candidateProfile?.headline || selectedCandidate.job?.title || "Application profile"}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    onClick={() => setSelectedCandidate(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-5 sm:p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Email</p>
                    <p className="mt-2 text-sm font-medium text-slate-800">{selectedCandidate.candidateProfile?.user?.email || "Not shared"}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Phone</p>
                    <p className="mt-2 text-sm font-medium text-slate-800">{selectedCandidate.candidateProfile?.phone || "Not shared"}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Candidate ID</p>
                    <p className="mt-2 truncate text-sm font-medium text-slate-800">{selectedCandidate.candidateProfile?.id || selectedCandidate.id}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Professional summary</h3>
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
                          {selectedCandidate.job?.title || "Role"}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Location</p>
                          <p className="mt-2 text-sm text-slate-800">{selectedCandidate.candidateProfile?.location || "Not shared"}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Experience</p>
                          <p className="mt-2 text-sm text-slate-800">{selectedCandidate.candidateProfile?.experience || "Not added yet"}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedCandidate.candidateProfile?.linkedin ? (
                          <a href={selectedCandidate.candidateProfile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">LinkedIn</a>
                        ) : null}
                        {selectedCandidate.candidateProfile?.github ? (
                          <a href={selectedCandidate.candidateProfile.github} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">GitHub</a>
                        ) : null}
                        {selectedCandidate.candidateProfile?.portfolio ? (
                          <a href={selectedCandidate.candidateProfile.portfolio} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">Portfolio</a>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedCandidate.candidateProfile?.skills?.length ? selectedCandidate.candidateProfile.skills : []).map((skill) => (
                          <span key={skill.id || skill.name} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                            {skill.name}
                          </span>
                        )) || <p className="text-sm text-slate-500">No skills added yet.</p>}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h3 className="text-lg font-semibold text-slate-900">Education</h3>
                      <div className="mt-3 space-y-3">
                        {selectedCandidate.candidateProfile?.education?.length ? (
                          selectedCandidate.candidateProfile.education.map((item) => (
                            <div key={item.id || item.institution} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <p className="font-medium text-slate-900">{item.institution}</p>
                              <p className="mt-1 text-sm text-slate-600">{[item.degree, item.field].filter(Boolean).join(" · ") || "Education details"}</p>
                              {(item.startYear || item.endYear) && (
                                <p className="mt-2 text-xs text-slate-500">
                                  {item.startYear || "--"} - {item.endYear || "Present"}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No education added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h3 className="text-lg font-semibold text-slate-900">Resume</h3>
                      {selectedCandidate.candidateProfile?.resumes?.length ? (
                        <div className="mt-3 space-y-3">
                          {selectedCandidate.candidateProfile.resumes.map((resume) => (
                            <div key={resume.id || resume.fileUrl || "resume"} className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
                              <p className="font-medium text-slate-900">{resume.summary || "Resume uploaded"}</p>
                              {resume.rawText ? (
                                <p className="mt-2 line-clamp-5 text-sm text-slate-600">{resume.rawText.slice(0, 220)}{resume.rawText.length > 220 ? "…" : ""}</p>
                              ) : null}
                              {resume.fileUrl ? (
                                <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-medium text-indigo-700 hover:text-indigo-800">
                                  Open resume
                                </a>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">No resume uploaded yet.</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h3 className="text-lg font-semibold text-slate-900">Certifications</h3>
                      <div className="mt-3 space-y-3">
                        {selectedCandidate.candidateProfile?.certifications?.length ? (
                          selectedCandidate.candidateProfile.certifications.map((item) => (
                            <div key={item.id || item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <p className="font-medium text-slate-900">{item.name}</p>
                              <p className="mt-1 text-sm text-slate-600">{item.issuer || "Issuer not provided"}</p>
                              {item.credentialUrl && (
                                <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-medium text-indigo-700 hover:text-indigo-800">
                                  View credential
                                </a>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No certifications added yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
                      <div className="mt-3 space-y-3">
                        {selectedCandidate.candidateProfile?.projects?.length ? (
                          selectedCandidate.candidateProfile.projects.map((project) => (
                            <div key={project.id || project.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <p className="font-medium text-slate-900">{project.name}</p>
                              <p className="mt-1 text-sm text-slate-600">{project.description || "Project description not added."}</p>
                              {project.projectUrl && (
                                <a href={project.projectUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-medium text-indigo-700 hover:text-indigo-800">
                                  Open project
                                </a>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No project details added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function RecruiterAiMatches() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [query, setQuery] = useState("Who are the strongest candidates for this role and what makes them a fit?");
  const [result, setResult] = useState<null | {
    job?: { id?: string; title?: string };
    candidates?: Array<{
      candidateId?: string;
      name?: string;
      score?: number;
      breakdown?: Record<string, number | string>;
    }>;
    answer?: string;
  }>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await recruiterApi.getJobs();
        setJobs(data || []);
        if (data?.[0]) {
          setSelectedJobId(data[0].id);
        }
      } catch (err) {
        setError(errorText(err));
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobs();
  }, []);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || jobs[0] || null;

  const runMatch = async () => {
    if (!selectedJobId || !query.trim()) {
      setError("Select a job and provide a prompt before running the match scan.");
      return;
    }

    setLoadingAi(true);
    setError("");

    try {
      const response = await recruiterApi.assistant({
        jobId: selectedJobId,
        query: query.trim(),
        limit: 6,
      });

      setResult(response as typeof result);
    } catch (err) {
      setError(errorText(err));
      setResult(null);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      
      <div className="relative overflow-hidden rounded-[30px] border border-violet-200/80 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%),linear-gradient(135deg,#f5f3ff_0%,#eff6ff_35%,#ffffff_100%)] p-5 shadow-[0_30px_90px_-35px_rgba(109,40,217,0.55)] sm:p-6">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-linear-to-br from-violet-400/30 via-indigo-400/20 to-cyan-300/10 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-linear-to-br from-cyan-400/20 via-sky-300/10 to-violet-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-600">Talent intelligence</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">AI candidate matches</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Compare the strongest applicants for each role using the backend ranking model and recruiter AI summary.
            </p>
          </div>
   <Button asChild variant="outline" className="group h-11 rounded-xl border-slate-200 bg-white/90 px-4 font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900">
              <a href="/recruiter/dashboard">
                <ArrowUpRight className="mr-2 h-4 w-4 rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                Back to dashboard
              </a>
            </Button>
          <Button onClick={runMatch} disabled={loadingAi || !selectedJobId} className="h-11 rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-600 text-white shadow-lg shadow-violet-500/20 hover:opacity-95">
            {loadingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loadingAi ? "Running scan" : "Scan matches"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm"
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
        <motion.div variants={item}>
          <Card className="overflow-hidden border border-violet-100 bg-white/95 shadow-[0_30px_80px_-40px_rgba(129,140,248,0.5)]">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-2xl text-slate-900">Open jobs</CardTitle>
              <CardDescription className="text-slate-600">Choose a role to rank candidates and short-list the strongest options.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4">
              {loadingJobs ? (
                <div className="space-y-3 py-6">
                  {[1, 2, 3].map((itemKey) => (
                    <div key={itemKey} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : jobs.length ? (
                jobs.map((job) => {
                  const active = job.id === selectedJobId;

                  return (
                    <motion.button
                      key={job.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={() => setSelectedJobId(job.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${active ? "border-violet-200 bg-linear-to-r from-violet-50 via-indigo-50 to-sky-50 shadow-md shadow-violet-100" : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{job.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{job.location || "Location not specified"}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${job.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                          {job.status || "DRAFT"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>{job.requiredSkills?.length || 0} skills required</span>
                        <span>{job._count?.jobApplications || 0} applicants</span>
                      </div>
                    </motion.button>
                  );
                })
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <BriefcaseBusiness className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No jobs available</h3>
                  <p className="mt-2 text-sm text-slate-600">Create a published role to run talent matching.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden border border-violet-200 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(248,250,252,0.96),rgba(239,246,255,0.95))] shadow-[0_28px_90px_-40px_rgba(99,102,241,0.6)]">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-2xl text-slate-900">Match prompt</CardTitle>
                  <CardDescription className="text-slate-600">Run the recruiter AI against the selected opening.</CardDescription>
                </div>

                {selectedJob && (
                  <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700">
                    {selectedJob.title}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-4">
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask who the strongest candidates are and why they fit this role."
                className="min-h-28 w-full rounded-2xl border border-violet-200 bg-white/90 p-3 text-sm text-slate-700 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />

              <Button
                onClick={runMatch}
                disabled={loadingAi || !selectedJobId}
                className="w-full rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-600 text-white shadow-lg shadow-violet-500/20 hover:opacity-95"
              >
                {loadingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                {loadingAi ? "Evaluating talent" : "Evaluate candidates"}
              </Button>

              {result && (
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-slate-50 shadow-inner shadow-slate-900/30">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
                        <Sparkles className="h-4 w-4" />
                        AI recommendations
                      </div>

                      {result.job?.title && (
                        <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200">
                          {result.job.title}
                        </span>
                      )}
                    </div>

                    {result.candidates?.length ? (
                      <div className="space-y-3">
                        {result.candidates.map((candidate, index) => {
                          const score = Number(candidate.score ?? 0);
                          const breakdownEntries = Object.entries(candidate.breakdown ?? {});

                          return (
                            <motion.div
                              key={candidate.candidateId || `${candidate.name}-${index}`}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                              className="rounded-2xl border border-white/10 bg-white/5 p-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-white">{candidate.name || `Candidate ${index + 1}`}</p>
                                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Candidate ID: {candidate.candidateId || "unknown"}</p>
                                </div>

                                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                                  {score.toFixed(2)}%
                                </span>
                              </div>

                              <div className="mt-3 space-y-2">
                                {breakdownEntries.map(([label, value]) => {
                                  const numericValue = typeof value === "number" ? value : Number(value || 0);
                                  return (
                                    <div key={label}>
                                      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-400">
                                        <span>{label.replace(/([A-Z])/g, " $1").trim()}</span>
                                        <span>{numericValue.toFixed(2)}%</span>
                                      </div>
                                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${Math.min(100, numericValue)}%` }}
                                          transition={{ duration: 0.5, ease: "easeOut" }}
                                          className="h-full rounded-full bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : null}

                    {result.answer && (
                      <div className="mt-4 rounded-2xl border border-violet-200/20 bg-white/5 p-4">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">Recruiter summary</p>
                        <div className="space-y-3 text-sm leading-6 text-slate-100">
                          {result.answer.split(/\n\s*\n/).filter(Boolean).map((block, index) => (
                            <p key={`${block.slice(0, 12)}-${index}`} className="whitespace-pre-wrap">{block}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function RecruiterCompany() {
  const [company, setCompany] = useState<Company | null>(null); const [form, setForm] = useState({name:"", description:"", website:""}); const [penalties, setPenalties] = useState<unknown[]>([]); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => { Promise.all([recruiterApi.getCompany().catch(() => null), recruiterApi.getPenalties().catch(() => [])]).then(([c, p]) => { setCompany(c); setPenalties(p || []); if (c) setForm({name:c.name, description:c.description || "", website:c.website || ""}); }); }, []);
  const save = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(""); const payload = { name: form.name.trim(), description: form.description.trim() || undefined, website: form.website.trim() || undefined }; try { const result = company ? await recruiterApi.updateCompany(payload) : await recruiterApi.createCompany(payload); setCompany(result); } catch (err) { setError(errorText(err)); } finally { setSaving(false); } };
  return <motion.div variants={stagger} initial="hidden" animate="show"><Header eyebrow="Company hub" title="Make your company memorable." description="A complete company profile gives every candidate the context to say yes."/><div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]"><Card><CardHeader><CardTitle>{company ? "Company profile" : "Create your company"}</CardTitle><CardDescription>{company ? "Keep your public hiring identity current." : "You need a company before publishing jobs."}</CardDescription></CardHeader><CardContent><form onSubmit={save} className="space-y-4"><label><span className="field-label">Company name</span><Input required minLength={2} value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Acme Labs"/></label><label><span className="field-label">Website</span><Input type="url" value={form.website} onChange={(e) => setForm({...form,website:e.target.value})} placeholder="https://acme.com"/></label><label><span className="field-label">About the company</span><textarea className="control min-h-36" value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} placeholder="Tell candidates what makes your team special…"/></label><Button disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{company ? "Update profile" : "Create company"}</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Account notices</CardTitle><CardDescription>Penalties and complaint outcomes from admin</CardDescription></CardHeader><CardContent>{penalties.length ? <div className="space-y-3">{penalties.map((p, i) => <div key={i} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm">{JSON.stringify(p)}</div>)}</div> : <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700">No penalties on your company account.</div>}</CardContent></Card></div>{error && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}</motion.div>;
}