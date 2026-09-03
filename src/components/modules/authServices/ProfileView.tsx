
"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Edit3,
  ExternalLink,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FaGithub } from "react-icons/fa6";

import ProfileEditForm from "./ProfileEditForm";

/* =========================================================
   Types
========================================================= */

export interface ProfileSkill {
  id?: string;
  name: string;
}

export interface ProfileEducation {
  id?: string;
  institution: string;
  degree?: string | null;
  field?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ProfileProject {
  id?: string;
  name: string;
  description?: string | null;
  url?: string | null;
}

export interface ProfileCertification {
  id?: string;
  name: string;
  issuer?: string | null;
  issueDate?: string | null;
  credentialUrl?: string | null;
}

export interface CandidateProfile {
  phone?: string | null;
  location?: string | null;
  experience?: string | null;
  bio?: string | null;
  summary?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;

  resumeUrl?: string | null;
  resumeName?: string | null;

  skills?: ProfileSkill[];
  education?: ProfileEducation[];
  projects?: ProfileProject[];
  certifications?: ProfileCertification[];
}

export interface ProfileUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  emailVerified?: boolean;
}

/* =========================================================
   Props
========================================================= */

interface ProfileViewProps {
  user: ProfileUser;
  candidateProfile?: CandidateProfile | null;
}

/* =========================================================
   Animation
========================================================= */

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/* =========================================================
   Main Component
========================================================= */

export default function ProfileView({
  user,
  candidateProfile,
}: ProfileViewProps) {
  const [editing, setEditing] = useState(false);

  const profile = candidateProfile;

  /* -------------------------------------------------------
     Profile completion
  ------------------------------------------------------- */

  const completion = useMemo(() => {
    const fields = [
      Boolean(user.name),
      Boolean(user.email),
      Boolean(profile?.phone),
      Boolean(profile?.location),
      Boolean(profile?.experience),
      Boolean(profile?.summary || profile?.bio),
      Boolean(profile?.linkedin),
      Boolean(profile?.github),
      Boolean(profile?.portfolio),
      Boolean(profile?.resumeUrl),
      Boolean(profile?.skills?.length),
      Boolean(profile?.education?.length),
      Boolean(profile?.projects?.length),
      Boolean(profile?.certifications?.length),
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  }, [user, profile]);

  /* -------------------------------------------------------
     Editing mode
  ------------------------------------------------------- */

  if (editing) {
    return (
      <main className="min-h-screen w-full bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
            Back to profile
          </button>

          <ProfileEditForm
            initialName={user.name}
            email={user.email}
            initialProfile={profile}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* ===================================================
          Background
      =================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute right-[-10rem] top-1/4 h-[32rem] w-[32rem] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* =================================================
            Page Header
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                Candidate Profile
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                My Profile
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Keep your professional profile complete to improve your
                visibility and job matching results.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100"
            >
              <Edit3 className="h-4 w-4" />
              Edit profile
            </button>
          </div>
        </motion.div>

        {/* =================================================
            Main Grid
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            {/* =================================================
                Profile Hero
            ================================================= */}

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl"
            >
              {/* Cover */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-blue-600/20 sm:h-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(129,140,248,0.35),transparent_30%)]" />

                <div className="absolute bottom-4 right-5 hidden rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70 backdrop-blur sm:block">
                  Candidate
                </div>
              </div>

              <div className="px-5 pb-7 sm:px-8">
                {/* Avatar */}
                <div className="-mt-12 mb-5">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-slate-950 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-10 w-10 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                      {user.name || "Your Name"}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-indigo-300">
                      {profile?.experience
                        ? `${profile.experience} experience`
                        : "Candidate"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-indigo-400" />
                        {user.email}
                      </span>

                      {profile?.location && (
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-400" />
                          {profile.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {user.emailVerified !== false && (
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified account
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            {/* =================================================
                Contact Information
            ================================================= */}

            <ProfileSection
              icon={UserRound}
              title="Contact information"
              description="Your basic contact details"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={user.email}
                />

                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={profile?.phone}
                />

                <InfoCard
                  icon={MapPin}
                  label="Location"
                  value={profile?.location}
                />

                <InfoCard
                  icon={BriefcaseBusiness}
                  label="Experience"
                  value={profile?.experience}
                />
              </div>
            </ProfileSection>

            {/* =================================================
                Professional Summary
            ================================================= */}

            <ProfileSection
              icon={BriefcaseBusiness}
              title="Professional summary"
              description="Tell recruiters about yourself"
              action={
                <SmallActionButton
                  icon={Pencil}
                  label="Edit"
                  onClick={() => setEditing(true)}
                />
              }
            >
              {profile?.summary || profile?.bio ? (
                <p className="text-sm leading-7 text-slate-300">
                  {profile.summary || profile.bio}
                </p>
              ) : (
                <EmptyState
                  icon={BriefcaseBusiness}
                  title="Add your professional summary"
                  description="A strong summary helps recruiters quickly understand your background."
                  action="Add summary"
                  onClick={() => setEditing(true)}
                />
              )}
            </ProfileSection>

            {/* =================================================
                Skills
            ================================================= */}

            <ProfileSection
              icon={Sparkles}
              title="Skills"
              description="Highlight your strongest technical and professional skills"
              action={
                <SmallActionButton
                  icon={Plus}
                  label="Add skill"
                  onClick={() => setEditing(true)}
                />
              }
            >
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {profile.skills.map((skill) => (
                    <motion.span
                      key={skill.id ?? skill.name}
                      whileHover={{ y: -2 }}
                      className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-200"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="No skills added"
                  description="Add React, Next.js, TypeScript, Python, SQL or other relevant skills."
                  action="Add skills"
                  onClick={() => setEditing(true)}
                />
              )}
            </ProfileSection>

            {/* =================================================
                Education
            ================================================= */}

            <ProfileSection
              icon={GraduationCap}
              title="Education"
              description="Your academic background"
              action={
                <SmallActionButton
                  icon={Plus}
                  label="Add education"
                  onClick={() => setEditing(true)}
                />
              }
            >
              {profile?.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((education, index) => (
                    <TimelineItem
                      key={education.id ?? `${education.institution}-${index}`}
                      icon={GraduationCap}
                      title={education.degree || "Degree"}
                      subtitle={education.institution}
                      description={education.field}
                      date={
                        education.startDate || education.endDate
                          ? `${education.startDate ?? ""} ${
                              education.startDate && education.endDate
                                ? "—"
                                : ""
                            } ${education.endDate ?? ""}`.trim()
                          : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={GraduationCap}
                  title="Add your education"
                  description="Add your university, degree, field of study and dates."
                  action="Add education"
                  onClick={() => setEditing(true)}
                />
              )}
            </ProfileSection>

            {/* =================================================
                Projects
            ================================================= */}

            <ProfileSection
              icon={BriefcaseBusiness}
              title="Projects"
              description="Showcase your best work"
              action={
                <SmallActionButton
                  icon={Plus}
                  label="Add project"
                  onClick={() => setEditing(true)}
                />
              }
            >
              {profile?.projects && profile.projects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.projects.map((project, index) => (
                    <ProjectCard
                      key={project.id ?? `${project.name}-${index}`}
                      project={project}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BriefcaseBusiness}
                  title="No projects yet"
                  description="Show recruiters what you have built."
                  action="Add project"
                  onClick={() => setEditing(true)}
                />
              )}
            </ProfileSection>

            {/* =================================================
                Certifications
            ================================================= */}

            <ProfileSection
              icon={Award}
              title="Certifications"
              description="Professional certifications and achievements"
              action={
                <SmallActionButton
                  icon={Plus}
                  label="Add certificate"
                  onClick={() => setEditing(true)}
                />
              }
            >
              {profile?.certifications &&
              profile.certifications.length > 0 ? (
                <div className="space-y-4">
                  {profile.certifications.map((certificate, index) => (
                    <CertificateCard
                      key={
                        certificate.id ??
                        `${certificate.name}-${index}`
                      }
                      certificate={certificate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Award}
                  title="Add certifications"
                  description="Certificates can strengthen your professional profile."
                  action="Add certificate"
                  onClick={() => setEditing(true)}
                />
              )}
            </ProfileSection>

            {/* =================================================
                Resume
            ================================================= */}

            <ProfileSection
              icon={FileText}
              title="Resume"
              description="Keep your latest resume available to recruiters"
              action={
                <SmallActionButton
                  icon={Upload}
                  label="Upload resume"
                  onClick={() => setEditing(true)}
                />
              }
            >
              {profile?.resumeUrl ? (
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {profile.resumeName || "My Resume"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Resume document
                      </p>
                    </div>
                  </div>

                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View resume
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No resume uploaded"
                  description="Upload a PDF resume so recruiters can review your experience."
                  action="Upload resume"
                  onClick={() => setEditing(true)}
                />
              )}
            </ProfileSection>

            {/* =================================================
                Social Links
            ================================================= */}

            <ProfileSection
              icon={LinkIcon}
              title="Professional links"
              description="Connect your professional profiles"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <SocialLink
                  icon={LinkIcon}
                  label="LinkedIn"
                  value={profile?.linkedin}
                />

                <SocialLink
                  icon={FaGithub}
                  label="GitHub"
                  value={profile?.github}
                />

                <SocialLink
                  icon={ExternalLink}
                  label="Portfolio"
                  value={profile?.portfolio}
                />
              </div>
            </ProfileSection>
          </div>

          {/* =================================================
              Sidebar
          ================================================= */}

          <aside className="space-y-6">
            {/* Profile completion */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Profile strength
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Complete your profile
                  </p>
                </div>

                <span className="text-2xl font-bold text-indigo-300">
                  {completion}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                A complete profile can help improve your visibility and AI
                job matching.
              </p>
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl"
            >
              <h3 className="font-semibold text-white">
                Quick actions
              </h3>

              <div className="mt-4 space-y-2">
                <QuickAction
                  icon={Pencil}
                  label="Edit profile"
                  onClick={() => setEditing(true)}
                />

                <QuickAction
                  icon={Upload}
                  label="Upload resume"
                  onClick={() => setEditing(true)}
                />

                <QuickAction
                  icon={Sparkles}
                  label="Improve profile"
                  onClick={() => setEditing(true)}
                />
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   Profile Section
========================================================= */

function ProfileSection({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl sm:p-7"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-white">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>

      {children}
    </motion.section>
  );
}

/* =========================================================
   Info Card
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05]">
      <Icon className="h-4 w-4 text-indigo-400" />

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-slate-200">
        {value || "Not added yet"}
      </p>
    </div>
  );
}

/* =========================================================
   Timeline Item
========================================================= */

function TimelineItem({
  icon: Icon,
  title,
  subtitle,
  description,
  date,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description?: string | null;
  date?: string;
}) {
  return (
    <div className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          {date && (
            <span className="text-xs text-slate-500">
              {date}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-indigo-300">
          {subtitle}
        </p>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   Project Card
========================================================= */

function ProjectCard({
  project,
}: {
  project: ProfileProject;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-400/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
            aria-label={`Open ${project.name}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <h3 className="mt-4 font-semibold text-white">
        {project.name}
      </h3>

      {project.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {project.description}
        </p>
      )}
    </motion.div>
  );
}

/* =========================================================
   Certificate
========================================================= */

function CertificateCard({
  certificate,
}: {
  certificate: ProfileCertification;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
        <Award className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-white">
          {certificate.name}
        </h3>

        {certificate.issuer && (
          <p className="mt-1 text-sm text-slate-400">
            {certificate.issuer}
          </p>
        )}

        {certificate.issueDate && (
          <p className="mt-1 text-xs text-slate-500">
            Issued {certificate.issueDate}
          </p>
        )}
      </div>

      {certificate.credentialUrl && (
        <a
          href={certificate.credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Credential
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

/* =========================================================
   Social Link
========================================================= */

function SocialLink({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  if (!value) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-4">
        <Icon className="h-4 w-4 text-slate-500" />

        <p className="mt-3 text-sm font-medium text-slate-300">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          Not added
        </p>
      </div>
    );
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-indigo-400/20 hover:bg-white/[0.05]"
    >
      <Icon className="h-4 w-4 text-indigo-400" />

      <p className="mt-3 text-sm font-medium text-white">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-1 text-xs text-indigo-300">
        Visit profile
        <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

/* =========================================================
   Empty State
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-7 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-100"
      >
        <Plus className="h-3.5 w-3.5" />
        {action}
      </button>
    </div>
  );
}

/* =========================================================
   Small Action
========================================================= */

function SmallActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/* =========================================================
   Quick Action
========================================================= */

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
    >
      <Icon className="h-4 w-4 text-indigo-400" />
      <span>{label}</span>
      <ChevronRight className="ml-auto h-4 w-4 text-slate-600" />
    </button>
  );
}

