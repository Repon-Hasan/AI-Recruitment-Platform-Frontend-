"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  FaArrowLeft,
  FaBriefcase,
  FaCalendarCheck,
  FaClock,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaUser,
  FaVideo,
  FaGraduationCap,
  FaMoneyBillWave,
} from "react-icons/fa6";
import { FaCheckCircle } from 'react-icons/fa';

import { motion } from "motion/react";

import {
  interviewApi,
  type Interview,
} from "@/lib/api/interview";

import InterviewCard from "@/components/recruiter/interviews/InterviewCard";

import ScheduleInterviewDialog from "@/components/recruiter/interviews/ScheduleInterviewDialog";

import ApplicationConversation from "@/components/recruiter/interviews/ApplicationConversation";
import { recruiterApi } from "@/lib/api/recruiter.api";



/* =========================================================
   TYPES
========================================================= */

interface JobSkill {
  id: string;
  jobId: string;
  name: string;
  priority: string;
}

interface Company {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CandidateProfile {
  id: string;
  userId: string;

  phone?: string | null;
  location?: string | null;
  experience?: string | null;

  createdAt?: string;
  updatedAt?: string;

  skills?: Array<{
    id?: string;
    name: string;
  }>;

  education?: Array<{
    id?: string;
    institution: string;
    degree?: string | null;
    field?: string | null;
    startYear?: number | null;
    endYear?: number | null;
  }>;

  projects?: Array<{
    id?: string;
    name: string;
    description?: string | null;
    technologies?: string | null;
    projectUrl?: string | null;
  }>;

  certifications?: Array<{
    id?: string;
    name: string;
    issuer?: string | null;
    credentialUrl?: string | null;
    issueDate?: string | null;
  }>;

  resumes?: Array<{
    id?: string;
    fileUrl?: string | null;
    summary?: string | null;
    rawText?: string | null;
    createdAt?: string | null;
  }>;
}

interface Job {
  id: string;
  companyId: string;

  title: string;
  description: string;

  location: string;

  image?: string | null;

  remoteType: string;
  employmentType: string;
  experienceLevel: string;

  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;

  deadline: string;

  status: string;

  publishedAt?: string | null;
  closedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;

  company?: Company | null;

  requiredSkills?: JobSkill[];
}

interface Application {
  id: string;

  candidateProfileId: string;
  jobId: string;

  coverLetter?: string | null;

  status: string;

  createdAt: string;
  updatedAt?: string;

  candidateProfile?: CandidateProfile | null;

  job?: Job | null;
}

interface Params {
  [key: string]: string | string[];
  applicationId: string;
}

interface Props {
  currentUserId: string;
}

/* =========================================================
   PAGE
========================================================= */

export default function RecruiterApplicationPage({
  currentUserId,
}: Props) {
  const params = useParams<Params>();

  const applicationId =
    params.applicationId ?? "";

  const [application, setApplication] =
    useState<Application | null>(null);

  const [interview, setInterview] =
    useState<Interview | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [interviewLoading, setInterviewLoading] =
    useState(true);

  const [scheduleOpen, setScheduleOpen] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     LOAD APPLICATION
  ======================================================= */

  const loadApplication =
    useCallback(async () => {
      if (!applicationId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data =
          await recruiterApi.getApplicationById(
            applicationId,
          );

        /*
         * Backend response:
         *
         * {
         *   success: true,
         *   message: "...",
         *   data: {
         *      id,
         *      candidateProfile,
         *      job
         *   }
         * }
         *
         * getApplicationById() already returns response.data.
         */

        setApplication(
          data as Application,
        );
      } catch (err) {
        console.error(
          "Failed to load application:",
          err,
        );

        setError(
          "Unable to load this application.",
        );
      } finally {
        setLoading(false);
      }
    }, [applicationId]);

  /* =======================================================
     LOAD INTERVIEW
  ======================================================= */

  const loadInterview =
    useCallback(async () => {
      if (!applicationId) {
        return;
      }

      try {
        setInterviewLoading(true);

        const data =
          await interviewApi.getByApplication(
            applicationId,
          );

        const interviews: Interview[] =
          Array.isArray(data)
            ? data
            : [];

        const activeInterview =
          interviews.find(
            (item) =>
              item.status === "SCHEDULED" ||
              item.status === "STARTED",
          ) ?? null;

        setInterview(
          activeInterview,
        );
      } catch (err) {
        console.error(
          "Failed to load interview:",
          err,
        );

        setInterview(null);
      } finally {
        setInterviewLoading(false);
      }
    }, [applicationId]);

  /* =======================================================
     EFFECTS
  ======================================================= */

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadApplication();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadApplication]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInterview();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadInterview]);

  /* =======================================================
     INTERVIEW CREATED
  ======================================================= */

  const handleInterviewCreated =
    useCallback(async () => {
      await loadInterview();
      await loadApplication();
    }, [
      loadInterview,
      loadApplication,
    ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-40 rounded-xl bg-slate-200" />

            <div className="h-40 rounded-3xl bg-white shadow-sm" />

            <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
              <div className="h-96 rounded-3xl bg-white" />

              <div className="h-96 rounded-3xl bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !application) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <FaUser className="h-6 w-6 text-red-500" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            Application not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ??
              "We could not find this application."}
          </p>

          <Link
            href="/recruiter/applications"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FaArrowLeft className="h-4 w-4" />

            Back to applications
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const candidate =
    application.candidateProfile;

  const job =
    application.job;

  const company =
    job?.company;

  const requiredSkills =
    job?.requiredSkills ?? [];

  const candidateSkills =
    candidate?.skills ?? [];

  const education =
    candidate?.education ?? [];

  const isInterview =
    application.status === "SHORTLISTED";

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: -15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          <Link
            href="/recruiter/applications"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <FaArrowLeft className="h-4 w-4" />

            Back to applications
          </Link>
        </motion.div>

        {/* =================================================
            APPLICATION HEADER
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
        >
          <div className="relative overflow-hidden p-6 sm:p-8">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              {/* Candidate */}

              <div className="flex items-start gap-4">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-violet-100">
                  <FaUser className="h-7 w-7 text-violet-600" />
                </div>

                <div>

                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-600">
                    Candidate Application
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Candidate
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Candidate ID:{" "}
                    <span className="font-medium text-slate-600">
                      {application.candidateProfileId}
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">

                    {candidate?.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <FaPhone className="h-3.5 w-3.5" />

                        {candidate.phone}
                      </span>
                    )}

                    {candidate?.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <FaLocationDot className="h-3.5 w-3.5" />

                        {candidate.location}
                      </span>
                    )}

                  </div>
                </div>
              </div>

              {/* Status */}

              <div>
                <ApplicationStatus
                  status={application.status}
                />
              </div>

            </div>
          </div>
        </motion.section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                JOB INFORMATION
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.05,
              }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">

                <div className="rounded-2xl bg-slate-100 p-3">
                  <FaBriefcase className="h-5 w-5 text-slate-700" />
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Applied position
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {job?.title ??
                      "Job position"}
                  </h2>

                  {company?.name && (
                    <p className="mt-1 text-sm font-medium text-violet-600">
                      {company.name}
                    </p>
                  )}

                </div>
              </div>

              {/* Job meta */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {job?.location && (
                  <MetaItem
                    icon={FaLocationDot}
                    label="Location"
                    value={job.location}
                  />
                )}

                {job?.employmentType && (
                  <MetaItem
                    icon={FaBriefcase}
                    label="Employment"
                    value={formatEnum(
                      job.employmentType,
                    )}
                  />
                )}

                {job?.remoteType && (
                  <MetaItem
                    icon={FaLocationDot}
                    label="Work type"
                    value={formatEnum(
                      job.remoteType,
                    )}
                  />
                )}

                {job?.experienceLevel && (
                  <MetaItem
                    icon={FaUser}
                    label="Experience"
                    value={formatEnum(
                      job.experienceLevel,
                    )}
                  />
                )}

                {job?.deadline && (
                  <MetaItem
                    icon={FaCalendarCheck}
                    label="Deadline"
                    value={formatDate(
                      job.deadline,
                    )}
                  />
                )}

                {(job?.salaryMin != null ||
                  job?.salaryMax != null) && (
                  <MetaItem
                    icon={FaMoneyBillWave}
                    label="Salary"
                    value={formatSalary(
                      job.salaryMin,
                      job.salaryMax,
                      job.salaryCurrency,
                    )}
                  />
                )}

              </div>

              {/* Job description */}

              {job?.description && (
                <div className="mt-6 border-t border-slate-100 pt-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Job description
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {job.description}
                  </p>

                </div>
              )}

              {/* Required skills */}

              {requiredSkills.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Required skills
                    </p>

                    <span className="text-xs font-medium text-slate-400">
                      {requiredSkills.length} skills
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {requiredSkills.map(
                      (skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
                        >
                          {skill.name}

                          <span className="rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] capitalize text-violet-500">
                            {skill.priority}
                          </span>
                        </span>
                      ),
                    )}

                  </div>
                </div>
              )}

            </motion.section>

            {/* =================================================
                COMPANY
            ================================================= */}

            {company && (
              <motion.section
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.08,
                }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">

                  <div className="rounded-2xl bg-blue-50 p-3">
                    <FaBriefcase className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Company
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {company.name}
                    </h2>

                  </div>

                </div>

                {company.description && (
                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    {company.description}
                  </p>
                )}

                {company.website && (
                  <div className="mt-5">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Visit company website
                    </a>
                  </div>
                )}
              </motion.section>
            )}

            {/* =================================================
                CANDIDATE INFORMATION
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                    Candidate profile
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Candidate information
                  </h2>
                </div>

                <div className="hidden rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500 sm:block">
                  Profile
                </div>

              </div>

              {/* Candidate data */}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {candidate?.phone && (
                  <InfoItem
                    icon={FaPhone}
                    label="Phone"
                    value={candidate.phone}
                  />
                )}

                {candidate?.location && (
                  <InfoItem
                    icon={FaLocationDot}
                    label="Location"
                    value={candidate.location}
                  />
                )}

                {candidate?.experience && (
                  <InfoItem
                    icon={FaClock}
                    label="Experience"
                    value={candidate.experience}
                  />
                )}

                <InfoItem
                  icon={FaUser}
                  label="Profile ID"
                  value={candidate?.id ?? application.candidateProfileId}
                />

              </div>

              {/* No candidate data */}

              {!candidate?.phone &&
                !candidate?.location &&
                !candidate?.experience &&
                candidateSkills.length === 0 && (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">

                    <FaUser className="mx-auto h-6 w-6 text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Candidate profile information is limited
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Additional candidate details have not been provided yet.
                    </p>

                  </div>
                )}

              {/* Candidate skills */}

              {candidateSkills.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Candidate skills
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {candidateSkills.map(
                      (skill) => (
                        <span
                          key={
                            skill.id ??
                            skill.name
                          }
                          className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                        >
                          {skill.name}
                        </span>
                      ),
                    )}

                  </div>
                </div>
              )}

              {/* Education */}

              {education.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Education
                  </p>

                  <div className="mt-4 space-y-3">

                    {education.map(
                      (item, index) => (
                        <div
                          key={
                            item.id ??
                            `${item.institution}-${index}`
                          }
                          className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                        >

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                            <FaGraduationCap className="h-4 w-4 text-violet-600" />
                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-semibold text-slate-800">
                              {item.institution}
                            </p>

                            {(item.degree ||
                              item.field) && (
                              <p className="mt-1 text-xs text-slate-500">
                                {[
                                  item.degree,
                                  item.field,
                                ]
                                  .filter(Boolean)
                                  .join(" • ")}
                              </p>
                            )}

                            {(item.startYear ||
                              item.endYear) && (
                              <p className="mt-1 text-xs text-slate-400">
                                {item.startYear ??
                                  "—"}{" "}
                                -{" "}
                                {item.endYear ??
                                  "Present"}
                              </p>
                            )}

                          </div>
                        </div>
                      ),
                    )}

                  </div>
                </div>
              )}

            </motion.section>

            {/* =================================================
                COVER LETTER
            ================================================= */}

            {application.coverLetter && (
              <motion.section
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15,
                }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">

                  <div className="rounded-2xl bg-violet-50 p-3">
                    <FaEnvelope className="h-5 w-5 text-violet-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Application
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      Cover letter
                    </h2>
                  </div>

                </div>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {application.coverLetter}
                </p>
              </motion.section>
            )}

            {/* =================================================
                INTERVIEW
            ================================================= */}

            {isInterview && (
              <motion.section
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
              >
                <div className="mb-3 flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                      Interview
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Interview management
                    </h2>

                  </div>

                  <div className="hidden rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600 sm:flex sm:items-center sm:gap-2">
                    <FaVideo className="h-3.5 w-3.5" />

                    Interview
                  </div>

                </div>

                {interviewLoading ? (
                  <div className="flex h-40 items-center justify-center rounded-3xl border border-slate-200 bg-white">

                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

                  </div>
                ) : (
                  <InterviewCard
                    interview={interview}
                    onSchedule={() =>
                      setScheduleOpen(true)
                    }
                  />
                )}

              </motion.section>
            )}

          </div>

          {/* =================================================
              RIGHT — CONVERSATION
          ================================================= */}

          {isInterview && (
            <motion.div
              initial={{
                opacity: 0,
                x: 15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.15,
              }}
              className="lg:sticky lg:top-6 lg:self-start"
            >
              <ApplicationConversation
                applicationId={
                  applicationId
                }
                currentUserId={
                  currentUserId
                }
              />
            </motion.div>
          )}

        </div>
      </div>

      {/* =====================================================
          SCHEDULE INTERVIEW DIALOG
      ===================================================== */}

      {isInterview && (
        <ScheduleInterviewDialog
          applicationId={
            applicationId
          }
          open={scheduleOpen}
          onClose={() =>
            setScheduleOpen(false)
          }
          onCreated={
            handleInterviewCreated
          }
        />
      )}
    </main>
  );
}

/* =========================================================
   APPLICATION STATUS
========================================================= */

function ApplicationStatus({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    APPLIED:
      "bg-slate-100 text-slate-700 ring-slate-200",

    REVIEWING:
      "bg-blue-50 text-blue-700 ring-blue-200",

    SHORTLISTED:
      "bg-violet-50 text-violet-700 ring-violet-200",

    INTERVIEW:
      "bg-amber-50 text-amber-700 ring-amber-200",

    OFFERED:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",

    REJECTED:
      "bg-red-50 text-red-700 ring-red-200",

    HIRED:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  const isInterview =
    status === "INTERVIEW";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ring-1 ${
        styles[status] ??
        styles.APPLIED
      }`}
    >
      {isInterview ? (
        <FaCalendarCheck className="h-3.5 w-3.5" />
      ) : (
        <FaCheckCircle className="h-3.5 w-3.5" />
      )}

      {formatEnum(status)}
    </span>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        <Icon className="h-4 w-4" />

        <span className="text-xs font-medium">
          {label}
        </span>

      </div>

      <p className="mt-2 break-words text-sm font-medium text-slate-800">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   META ITEM
========================================================= */

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        <Icon className="h-3.5 w-3.5" />

        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   FORMAT ENUM
========================================================= */

function formatEnum(
  value?: string | null,
): string {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "Not specified";
  }

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

/* =========================================================
   FORMAT SALARY
========================================================= */

function formatSalary(
  min?: number | null,
  max?: number | null,
  currency?: string | null,
): string {
  const code =
    currency ?? "BDT";

  const formatter =
    new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 0,
      },
    );

  if (
    min != null &&
    max != null
  ) {
    return `${code} ${formatter.format(
      min,
    )} - ${formatter.format(max)}`;
  }

  if (min != null) {
    return `${code} ${formatter.format(
      min,
    )}+`;
  }

  if (max != null) {
    return `Up to ${code} ${formatter.format(
      max,
    )}`;
  }

  return "Not specified";
}