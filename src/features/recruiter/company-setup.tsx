"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  Check,
  Globe2,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ParticleWave from "@/components/ui/particle-wave";
import { recruiterApi, type Company } from "@/lib/api/recruiter.api";

const initialForm = {
  name: "",
  description: "",
  website: "",
};

export function CompanySetup() {
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState(initialForm);
  const [penalties, setPenalties] = useState<unknown[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  useEffect(() => {
    recruiterApi
      .getCompany()
      .then((result) => {
        setCompany(result);

        setForm({
          name: result.name,
          description: result.description || "",
          website: result.website || "",
        });
      })
      .catch(() => undefined);

    recruiterApi
      .getPenalties()
      .then((result) => setPenalties(result || []))
      .catch(() => undefined);
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter a company name with at least 2 characters.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        website: form.website.trim() || undefined,
      };

      console.log("📦 COMPANY PAYLOAD:", payload);

      const result = company
        ? await recruiterApi.updateCompany(payload)
        : await recruiterApi.createCompany(payload);

      console.log("✅ COMPANY RESPONSE:", result);

      setCompany(result);

      if (!company) {
        setCreated(true);

        window.setTimeout(() => {
          router.push("/recruiter/dashboard");
        }, 900);
      }
    } catch (submitError) {
      console.error("❌ COMPANY CREATE ERROR:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not create your company. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative isolate -mx-4 min-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 px-4 py-8 text-white shadow-2xl sm:-mx-6 sm:px-8 lg:-mx-8 lg:px-12">
      {/* Particle Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <ParticleWave className="h-full w-full" />
      </div>

      {/* Gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-indigo-950/95 via-slate-950/90 to-purple-950/90" />

      {/* Glow */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-6xl"
      >
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.18em] text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" />
            Recruiter workspace
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Create a home for your next great hire.
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            Set up your company profile once. Then publish thoughtful roles,
            meet better candidates, and build your team with confidence.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* Company Form */}
          <Card className="border-white/10 bg-white/94 text-slate-950 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8">
              {/* Form Header */}
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                  <Building2 className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    {company
                      ? "Update company profile"
                      : "Create your company"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {company
                      ? "Keep your hiring identity fresh."
                      : "This takes less than a minute."}
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {created ? (
                  /* Success */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-72 flex-col items-center justify-center text-center"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="h-8 w-8" />
                    </div>

                    <h2 className="text-2xl font-semibold">
                      Company created!
                    </h2>

                    <p className="mt-2 text-slate-500">
                      Taking you to your recruiter dashboard…
                    </p>

                    <div className="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 0.9 }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* Form */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={submit}
                    className="space-y-5"
                  >
                    {/* Company Name */}
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Company name
                      </span>

                      <input
                        required
                        value={form.name}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            name: event.target.value,
                          })
                        }
                        className="control h-12 bg-white"
                        placeholder="e.g. TechNova Labs"
                      />
                    </label>

                    {/* Website */}
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Website{" "}
                        <span className="font-normal text-slate-400">
                          (optional)
                        </span>
                      </span>

                      <div className="relative">
                        <Globe2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="url"
                          value={form.website}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              website: event.target.value,
                            })
                          }
                          className="control h-12 bg-white pl-10"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </label>

                    {/* Description */}
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        About your company{" "}
                        <span className="font-normal text-slate-400">
                          (optional)
                        </span>
                      </span>

                      <textarea
                        value={form.description}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            description: event.target.value,
                          })
                        }
                        className="control min-h-36 resize-none bg-white"
                        placeholder="What does your team build? What makes it special?"
                      />
                    </label>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={saving}
                      className="h-11 w-full sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving company…
                        </>
                      ) : (
                        <>
                          {company
                            ? "Save changes"
                            : "Create company"}

                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="flex flex-col gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-400/15 text-indigo-200">
                <Users className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-semibold">
                A profile candidates trust
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Show the people behind your roles and give every application
                a stronger reason to start a conversation.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-semibold">
                Your account notices
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {penalties.length
                  ? `${penalties.length} admin notice${
                      penalties.length === 1 ? "" : "s"
                    } require your attention.`
                  : "No penalties or admin actions are currently attached to your company."}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}