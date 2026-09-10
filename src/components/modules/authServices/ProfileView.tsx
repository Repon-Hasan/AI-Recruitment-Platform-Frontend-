
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Edit3,
  ExternalLink,
  GraduationCap,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

import {
  candidateProfileApi,
  type CandidateCertification,
  type CandidateEducation,
  type CandidateProfile,
  type CandidateProject,
} from "@/lib/api/candidateProfile";

import ResumeManager from "./ResumeManager";
import ParticleWave from "@/components/ui/particle-wave";

/* =========================================================
   TYPES
========================================================= */

export interface ProfileUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileViewProps {
  user: ProfileUser;
  candidateProfile?: CandidateProfile | null;
}

type ModalType =
  | "profile"
  | "skill"
  | "education"
  | "project"
  | "certification"
  | null;

interface ScoreItemProps {
  label: string;
  score: number;
  icon: ReactNode;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  experience?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  createdAt: string;
  updatedAt: string;
  certifications: CandidateCertification[];
  education: CandidateEducation[];
  projects: CandidateProject[];
}

/* =========================================================
   HELPERS
========================================================= */

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function calculateSectionScore(
  current: number,
  target: number,
): number {
  if (target <= 0) {
    return 0;
  }

  return clampScore((current / target) * 100);
}

function getInitials(
  name?: string | null,
): string {
  if (!name) {
    return "C";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ProfileView({
  user,
  candidateProfile,
}: ProfileViewProps) {
  const [profile, setProfile] =
    useState<CandidateProfile | null>(
      candidateProfile ?? null,
    );

  const [loading, setLoading] =
    useState(!candidateProfile);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [modal, setModal] =
    useState<ModalType>(null);

  const [editingEducation, setEditingEducation] =
    useState<CandidateEducation | null>(null);

  const [editingProject, setEditingProject] =
    useState<CandidateProject | null>(null);

  const [editingCertification, setEditingCertification] =
    useState<CandidateCertification | null>(null);

  const [resumeOpen, setResumeOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  const loadProfile =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await candidateProfileApi.getMyProfile();

        setProfile(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load candidate profile.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  /* =======================================================
     CLEAR MESSAGES
  ======================================================= */

  useEffect(() => {
    if (!success && !error) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success, error]);

  /* =======================================================
     NORMALIZED DATA
  ======================================================= */

  const skills = profile?.skills ?? [];
  const education = profile?.education ?? [];
  const projects = profile?.projects ?? [];
  const certifications =
    profile?.certifications ?? [];

  /* =======================================================
     PROFILE SCORE
  ======================================================= */

  const scores = useMemo(() => {
    const profileFields = [
      profile?.name,
      profile?.email,
      profile?.phone,
      profile?.location,
      profile?.bio,
      profile?.experience,
      profile?.linkedin,
      profile?.github,
      profile?.portfolio,
    ];

    const filledFields =
      profileFields.filter(
        (value) =>
          typeof value === "string" &&
          value.trim().length > 0,
      ).length;

    const profileScore =
      calculateSectionScore(
        filledFields,
        profileFields.length,
      );

    const skillScore =
      calculateSectionScore(
        skills.length,
        6,
      );

    const educationScore =
      calculateSectionScore(
        education.length,
        2,
      );

    const projectScore =
      calculateSectionScore(
        projects.length,
        3,
      );

    const certificationScore =
      calculateSectionScore(
        certifications.length,
        2,
      );

    const total = clampScore(
      profileScore * 0.3 +
        skillScore * 0.2 +
        educationScore * 0.15 +
        projectScore * 0.2 +
        certificationScore * 0.15,
    );

    return {
      profile: profileScore,
      skills: skillScore,
      education: educationScore,
      projects: projectScore,
      certifications: certificationScore,
      total,
    };
  }, [
    profile,
    skills.length,
    education.length,
    projects.length,
    certifications.length,
  ]);

  /* =======================================================
     UPDATE PROFILE
  ======================================================= */

  const handleProfileUpdate =
    async (
      payload: Partial<CandidateProfile>,
    ) => {
      try {
        setSaving(true);
        setError("");

        const response =
          await candidateProfileApi.updateMyProfile(
            payload,
          );

        setProfile(response.data);

        setModal(null);

        setSuccess(
          response.message ||
            "Profile updated successfully.",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update profile.",
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     ADD SKILL
  ======================================================= */

  const handleAddSkill =
    async (name: string) => {
      const cleanName = name.trim();

      if (!cleanName) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        await candidateProfileApi.addSkill({
          skills: [
            {
              name: cleanName,
            },
          ],
        });

        await loadProfile();

        setModal(null);

        setSuccess(
          "Skill added successfully.",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to add skill.",
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     DELETE SKILL
  ======================================================= */

  const handleDeleteSkill =
    async (id?: string) => {
      if (!id) {
        return;
      }

      const confirmed =
        window.confirm(
          "Delete this skill?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(id);
        setError("");

        await candidateProfileApi.deleteSkill(
          id,
        );

        await loadProfile();

        setSuccess(
          "Skill deleted successfully.",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete skill.",
        );
      } finally {
        setDeletingId(null);
      }
    };

  /* =======================================================
     EDUCATION
  ======================================================= */

  const handleEducationSubmit =
    async (
      data: Omit<CandidateEducation, "id">,
    ) => {
      try {
        setSaving(true);
        setError("");

        if (editingEducation?.id) {
          await candidateProfileApi.updateEducation(
            editingEducation.id,
            data,
          );

          setSuccess(
            "Education updated successfully.",
          );
        } else {
          await candidateProfileApi.addEducation(
            data,
          );

          setSuccess(
            "Education added successfully.",
          );
        }

        await loadProfile();

        setEditingEducation(null);
        setModal(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save education.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDeleteEducation =
    async (id?: string) => {
      if (!id) {
        return;
      }

      if (
        !window.confirm(
          "Delete this education record?",
        )
      ) {
        return;
      }

      try {
        setDeletingId(id);

        await candidateProfileApi.deleteEducation(
          id,
        );

        await loadProfile();

        setSuccess(
          "Education deleted successfully.",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete education.",
        );
      } finally {
        setDeletingId(null);
      }
    };

  /* =======================================================
     PROJECT
  ======================================================= */

  const handleProjectSubmit =
    async (
      data: Omit<CandidateProject, "id">,
    ) => {
      try {
        setSaving(true);
        setError("");

        if (editingProject?.id) {
          await candidateProfileApi.updateProject(
            editingProject.id,
            data,
          );

          setSuccess(
            "Project updated successfully.",
          );
        } else {
          await candidateProfileApi.createProject(
            data,
          );

          setSuccess(
            "Project added successfully.",
          );
        }

        await loadProfile();

        setEditingProject(null);
        setModal(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save project.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDeleteProject =
    async (id?: string) => {
      if (!id) {
        return;
      }

      if (
        !window.confirm(
          "Delete this project?",
        )
      ) {
        return;
      }

      try {
        setDeletingId(id);

        await candidateProfileApi.deleteProject(
          id,
        );

        await loadProfile();

        setSuccess(
          "Project deleted successfully.",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete project.",
        );
      } finally {
        setDeletingId(null);
      }
    };

  /* =======================================================
     CERTIFICATION
  ======================================================= */

  const handleCertificationSubmit =
    async (data: {
      name: string;
      issuer: string;
      issueDate: string;
      credentialUrl?: string;
      image?: File;
    }) => {
      try {
        setSaving(true);
        setError("");

        console.log(
          "CERTIFICATION DATA:",
          data,
        );

        if (editingCertification?.id) {
          await candidateProfileApi.updateCertification(
            editingCertification.id,
            {
              name: data.name,
              issuer: data.issuer,
              issueDate: data.issueDate,
              credentialUrl:
                data.credentialUrl,
            },
          );

          setSuccess(
            "Certification updated successfully.",
          );
        } else {
          await candidateProfileApi.createCertification(
            data,
          );

          setSuccess(
            "Certification added successfully.",
          );
        }

        await loadProfile();

        setEditingCertification(null);
        setModal(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save certification.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDeleteCertification =
    async (id?: string) => {
      if (!id) {
        return;
      }

      if (
        !window.confirm(
          "Delete this certification?",
        )
      ) {
        return;
      }

      try {
        setDeletingId(id);

        await candidateProfileApi.deleteCertification(
          id,
        );

        await loadProfile();

        setSuccess(
          "Certification deleted successfully.",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete certification.",
        );
      } finally {
        setDeletingId(null);
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    profile?.name ||
    user.name ||
    "Candidate";

  const displayEmail =
    profile?.email ||
    user.email ||
    "";

  const image =
    profile?.image ||
    user.image ||
    null;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      {/* =====================================================
          RECRUITER STYLE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left Indigo Glow */}
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Right Purple Glow */}
        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

        {/* Top Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />
      </div>

      {/* =====================================================
          WAVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden opacity-30">
        <ParticleWave />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ===================================================
            MESSAGES
        =================================================== */}

        {(error || success) && (
          <div className="mb-5">
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <X className="h-4 w-4 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />

                <span>{success}</span>
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
          <div className="h-28 bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-blue-600/20" />

          <div className="-mt-12 px-5 pb-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar */}

                <div className="relative">
                  {image ? (
                    <img
                      src={image}
                      alt={displayName}
                      className="h-28 w-28 rounded-3xl border-4 border-slate-950 object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-slate-950 bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-xl">
                      {getInitials(
                        displayName,
                      )}
                    </div>
                  )}

                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-500 text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {displayName}
                    </h1>

                    <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-300">
                      Candidate
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                    <Mail className="h-4 w-4 text-indigo-400" />

                    {displayEmail ||
                      "No email added"}
                  </p>

                  {profile?.location && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4 text-indigo-400" />

                      {profile.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setResumeOpen(true)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <BriefcaseBusiness className="h-4 w-4 text-indigo-400" />

                  Manage Resume
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setModal("profile")
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-950 shadow-lg transition hover:bg-slate-100"
                >
                  <Edit3 className="h-4 w-4" />

                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            SCORE OVERVIEW
        =================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ScoreCard
            label="Profile"
            score={scores.profile}
            icon={<User className="h-4 w-4" />}
          />

          <ScoreCard
            label="Skills"
            score={scores.skills}
            icon={
              <BriefcaseBusiness className="h-4 w-4" />
            }
          />

          <ScoreCard
            label="Education"
            score={scores.education}
            icon={
              <GraduationCap className="h-4 w-4" />
            }
          />

          <ScoreCard
            label="Projects"
            score={scores.projects}
            icon={
              <BriefcaseBusiness className="h-4 w-4" />
            }
          />

          <ScoreCard
            label="Certifications"
            score={scores.certifications}
            icon={
              <Award className="h-4 w-4" />
            }
          />
        </section>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {/* =================================================
                ABOUT
            ================================================= */}

            <ProfileSection
              title="About Me"
              icon={<User className="h-5 w-5" />}
              action={
                <SmallButton
                  onClick={() =>
                    setModal("profile")
                  }
                >
                  <Pencil className="h-4 w-4" />
                </SmallButton>
              }
            >
              {profile?.bio ? (
                <p className="whitespace-pre-line text-sm leading-7 text-slate-400">
                  {profile.bio}
                </p>
              ) : (
                <EmptyText>
                  Add a professional summary so
                  recruiters can quickly understand
                  your background.
                </EmptyText>
              )}
            </ProfileSection>

            {/* =================================================
                SKILLS
            ================================================= */}

            <ProfileSection
              title="Skills"
              icon={
                <BriefcaseBusiness className="h-5 w-5" />
              }
              action={
                <SmallButton
                  onClick={() =>
                    setModal("skill")
                  }
                >
                  <Plus className="h-4 w-4" />
                </SmallButton>
              }
            >
              {skills.length === 0 ? (
                <EmptyText>
                  Add your technical and professional
                  skills.
                </EmptyText>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={
                        skill.id ??
                        skill.name
                      }
                      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400/20 hover:bg-white/[0.08]"
                    >
                      <span>
                        {skill.name}
                      </span>

                      {skill.id && (
                        <button
                          type="button"
                          onClick={() =>
                            void handleDeleteSkill(
                              skill.id,
                            )
                          }
                          disabled={
                            deletingId ===
                            skill.id
                          }
                          className="text-slate-500 transition hover:text-red-400 disabled:opacity-50"
                          aria-label={`Delete ${skill.name}`}
                        >
                          {deletingId ===
                          skill.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ProfileSection>

            {/* =================================================
                EDUCATION
            ================================================= */}

            <ProfileSection
              title="Education"
              icon={
                <GraduationCap className="h-5 w-5" />
              }
              action={
                <SmallButton
                  onClick={() => {
                    setEditingEducation(null);
                    setModal("education");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </SmallButton>
              }
            >
              {education.length === 0 ? (
                <EmptyText>
                  Add your academic background.
                </EmptyText>
              ) : (
                <div className="space-y-4">
                  {education.map((item) => (
                    <TimelineItem
                      key={
                        item.id ??
                        `${item.institution}-${item.startYear}`
                      }
                      icon={
                        <GraduationCap className="h-5 w-5" />
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-white">
                            {item.degree}
                          </h3>

                          <p className="mt-1 text-sm text-indigo-300">
                            {item.institution}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {item.field}
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            {item.startYear} –{" "}
                            {item.endYear}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          <SmallButton
                            onClick={() => {
                              setEditingEducation(
                                item,
                              );
                              setModal(
                                "education",
                              );
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </SmallButton>

                          {item.id && (
                            <SmallButton
                              danger
                              onClick={() =>
                                void handleDeleteEducation(
                                  item.id,
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </SmallButton>
                          )}
                        </div>
                      </div>
                    </TimelineItem>
                  ))}
                </div>
              )}
            </ProfileSection>

            {/* =================================================
                PROJECTS
            ================================================= */}

            <ProfileSection
              title="Projects"
              icon={
                <BriefcaseBusiness className="h-5 w-5" />
              }
              action={
                <SmallButton
                  onClick={() => {
                    setEditingProject(null);
                    setModal("project");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </SmallButton>
              }
            >
              {projects.length === 0 ? (
                <EmptyText>
                  Add projects that demonstrate your
                  practical experience.
                </EmptyText>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {projects.map((project) => (
                    <div
                      key={
                        project.id ??
                        project.name
                      }
                      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-indigo-400/20 hover:bg-white/[0.05]"
                    >
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.name}
                          className="mb-4 h-36 w-full rounded-xl object-cover"
                        />
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-white">
                          {project.name}
                        </h3>

                        <div className="flex gap-1">
                          <SmallButton
                            onClick={() => {
                              setEditingProject(
                                project,
                              );
                              setModal(
                                "project",
                              );
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </SmallButton>

                          {project.id && (
                            <SmallButton
                              danger
                              onClick={() =>
                                void handleDeleteProject(
                                  project.id,
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </SmallButton>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {project.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies
                          .split(",")
                          .map(
                            (
                              technology,
                            ) => (
                              <span
                                key={technology.trim()}
                                className="rounded-full border border-indigo-400/10 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300"
                              >
                                {technology.trim()}
                              </span>
                            ),
                          )}
                      </div>

                      {project.projectUrl && (
                        <a
                          href={
                            project.projectUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:underline"
                        >
                          View Project

                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ProfileSection>

            {/* =================================================
                CERTIFICATIONS
            ================================================= */}

            <ProfileSection
              title="Certifications"
              icon={
                <Award className="h-5 w-5" />
              }
              action={
                <SmallButton
                  onClick={() => {
                    setEditingCertification(
                      null,
                    );
                    setModal(
                      "certification",
                    );
                  }}
                >
                  <Plus className="h-4 w-4" />
                </SmallButton>
              }
            >
              {certifications.length === 0 ? (
                <EmptyText>
                  Add professional certifications
                  and credentials.
                </EmptyText>
              ) : (
                <div className="space-y-3">
                  {certifications.map(
                    (certificate) => (
                      <div
                        key={
                          certificate.id ??
                          certificate.name
                        }
                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-indigo-500/10 p-2.5">
                            <Award className="h-5 w-5 text-indigo-300" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-white">
                              {
                                certificate.name
                              }
                            </h3>

                            <p className="mt-1 text-sm text-indigo-300">
                              {
                                certificate.issuer
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Issued{" "}
                              {new Date(
                                certificate.issueDate,
                              ).toLocaleDateString()}
                            </p>

                            {certificate.credentialUrl && (
                              <a
                                href={
                                  certificate.credentialUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:underline"
                              >
                                Credential

                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <SmallButton
                            onClick={() => {
                              setEditingCertification(
                                certificate,
                              );
                              setModal(
                                "certification",
                              );
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </SmallButton>

                          {certificate.id && (
                            <SmallButton
                              danger
                              onClick={() =>
                                void handleDeleteCertification(
                                  certificate.id,
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </SmallButton>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </ProfileSection>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6">
            {/* Profile score */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Profile Strength
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Keep your profile complete to
                    improve recruiter matching.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-300">
                    {scores.total}%
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{
                    width: `${scores.total}%`,
                  }}
                />
              </div>

              <div className="mt-5 space-y-3">
                <MiniScore
                  label="Profile"
                  value={
                    scores.profile
                  }
                />

                <MiniScore
                  label="Skills"
                  value={
                    scores.skills
                  }
                />

                <MiniScore
                  label="Education"
                  value={
                    scores.education
                  }
                />

                <MiniScore
                  label="Projects"
                  value={
                    scores.projects
                  }
                />

                <MiniScore
                  label="Certifications"
                  value={
                    scores.certifications
                  }
                />
              </div>
            </section>

            {/* Contact */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  Contact & Links
                </h3>

                <SmallButton
                  onClick={() =>
                    setModal("profile")
                  }
                >
                  <Pencil className="h-4 w-4" />
                </SmallButton>
              </div>

              <div className="mt-4 space-y-3">
                <ContactRow
                  icon={
                    <Mail className="h-4 w-4" />
                  }
                  label="Email"
                  value={
                    displayEmail ||
                    "Not added"
                  }
                />

                <ContactRow
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                  label="Location"
                  value={
                    profile?.location ||
                    "Not added"
                  }
                />

                <ContactRow
                  icon={
                    <BriefcaseBusiness className="h-4 w-4" />
                  }
                  label="Experience"
                  value={
                    profile?.experience ||
                    "Not added"
                  }
                />
              </div>

              <div className="mt-5 space-y-2">
                {profile?.linkedin && (
                  <SocialLink
                    href={profile.linkedin}
                    icon={
                      <FaLinkedin className="h-4 w-4" />
                    }
                    label="LinkedIn"
                  />
                )}

                {profile?.github && (
                  <SocialLink
                    href={profile.github}
                    icon={
                      <FaGithub className="h-4 w-4" />
                    }
                    label="GitHub"
                  />
                )}

                {profile?.portfolio && (
                  <SocialLink
                    href={
                      profile.portfolio
                    }
                    icon={
                      <LinkIcon className="h-4 w-4" />
                    }
                    label="Portfolio"
                  />
                )}
              </div>
            </section>

            {/* Resume */}

            <section className="rounded-3xl border border-indigo-400/20 bg-indigo-500/[0.06] p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2.5">
                  <BriefcaseBusiness className="h-5 w-5 text-indigo-300" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    AI Resume
                  </h3>

                  <p className="text-xs text-slate-500">
                    Upload, analyze and ingest your
                    resume.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setResumeOpen(true)
                }
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
              >
                <span>
                  Manage Resume
                </span>

                <ChevronRight className="h-4 w-4" />
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      {modal === "profile" && (
        <Modal
          title="Edit Profile"
          description="Update your professional information."
          onClose={() =>
            setModal(null)
          }
        >
          <ProfileForm
            profile={profile}
            user={user}
            saving={saving}
            onSubmit={
              handleProfileUpdate
            }
          />
        </Modal>
      )}

      {/* =====================================================
          SKILL MODAL
      ===================================================== */}

      {modal === "skill" && (
        <Modal
          title="Add Skill"
          description="Add a technical or professional skill."
          onClose={() =>
            setModal(null)
          }
        >
          <SkillForm
            saving={saving}
            onSubmit={handleAddSkill}
          />
        </Modal>
      )}

      {/* =====================================================
          EDUCATION MODAL
      ===================================================== */}

      {modal === "education" && (
        <Modal
          title={
            editingEducation
              ? "Edit Education"
              : "Add Education"
          }
          description="Add your academic background."
          onClose={() => {
            setEditingEducation(null);
            setModal(null);
          }}
        >
          <EducationForm
            initial={editingEducation}
            saving={saving}
            onSubmit={
              handleEducationSubmit
            }
          />
        </Modal>
      )}

      {/* =====================================================
          PROJECT MODAL
      ===================================================== */}

      {modal === "project" && (
        <Modal
          title={
            editingProject
              ? "Edit Project"
              : "Add Project"
          }
          description="Show recruiters what you have built."
          onClose={() => {
            setEditingProject(null);
            setModal(null);
          }}
        >
          <ProjectForm
            initial={editingProject}
            saving={saving}
            onSubmit={
              handleProjectSubmit
            }
          />
        </Modal>
      )}

      {/* =====================================================
          CERTIFICATION MODAL
      ===================================================== */}

      {modal === "certification" && (
        <Modal
          title={
            editingCertification
              ? "Edit Certification"
              : "Add Certification"
          }
          description="Add a professional certification."
          onClose={() => {
            setEditingCertification(
              null,
            );
            setModal(null);
          }}
        >
          <CertificationForm
            initial={
              editingCertification
            }
            saving={saving}
            onSubmit={
              handleCertificationSubmit
            }
          />
        </Modal>
      )}

      {/* =====================================================
          RESUME MANAGER
      ===================================================== */}

      <ResumeManager
        open={resumeOpen}
        onClose={() =>
          setResumeOpen(false)
        }
        onResumeChange={() => {
          void loadProfile();
        }}
      />
    </div>
  );
}

/* =========================================================
   SCORE CARD
========================================================= */

function ScoreCard({
  label,
  score,
  icon,
}: ScoreItemProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-300">
          {icon}
        </div>

        <span className="text-xl font-bold text-white">
          {score}%
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-300">
        {label}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   MINI SCORE
========================================================= */

function MiniScore({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {label}
        </span>

        <span className="font-medium text-slate-300">
          {value}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-300">
            {icon}
          </div>

          <h2 className="font-semibold text-white">
            {title}
          </h2>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyText({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
      <p className="text-sm text-slate-500">
        {children}
      </p>
    </div>
  );
}

/* =========================================================
   TIMELINE
========================================================= */

function TimelineItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL BUTTON
========================================================= */

function SmallButton({
  children,
  onClick,
  danger = false,
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-lg p-2 transition
        ${
          danger
            ? "text-red-400 hover:bg-red-500/10"
            : "text-slate-500 hover:bg-white/[0.06] hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}

/* =========================================================
   CONTACT ROW
========================================================= */

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-white/[0.05] p-2 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <p className="truncate text-sm font-medium text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SOCIAL LINK
========================================================= */

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>

      <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
    </a>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-slate-950/95 px-6 py-5 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/10"
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/10"
      />
    </label>
  );
}

/* =========================================================
   FORM ACTIONS
========================================================= */

function FormActions({
  saving,
  onCancel,
  submitLabel,
}: {
  saving: boolean;
  onCancel?: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.06]"
        >
          Cancel
        </button>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {saving
          ? "Saving..."
          : submitLabel}
      </button>
    </div>
  );
}

/* =========================================================
   PROFILE FORM
========================================================= */

function ProfileForm({
  profile,
  user,
  saving,
  onSubmit,
}: {
  profile: CandidateProfile | null;
  user: ProfileUser;
  saving: boolean;
  onSubmit: (
    data: Partial<CandidateProfile>,
  ) => void;
}) {
  const [name, setName] =
    useState(
      profile?.name ??
        user.name ??
        "",
    );

  const [phone, setPhone] =
    useState(profile?.phone ?? "");

  const [location, setLocation] =
    useState(
      profile?.location ?? "",
    );

  const [bio, setBio] =
    useState(profile?.bio ?? "");

  const [experience, setExperience] =
    useState(
      profile?.experience ?? "",
    );

  const [linkedin, setLinkedin] =
    useState(
      profile?.linkedin ?? "",
    );

  const [github, setGithub] =
    useState(
      profile?.github ?? "",
    );

  const [portfolio, setPortfolio] =
    useState(
      profile?.portfolio ?? "",
    );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onSubmit({
      name,
      phone,
      location,
      bio,
      experience,
      linkedin,
      github,
      portfolio,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full Name"
          value={name}
          onChange={setName}
          required
        />

        <Input
          label="Phone"
          value={phone}
          onChange={setPhone}
          placeholder="+880..."
        />

        <Input
          label="Location"
          value={location}
          onChange={setLocation}
          placeholder="Dhaka, Bangladesh"
        />

        <Input
          label="Experience"
          value={experience}
          onChange={setExperience}
          placeholder="2 years"
        />
      </div>

      <Textarea
        label="Professional Summary"
        value={bio}
        onChange={setBio}
        placeholder="Tell recruiters about yourself..."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="LinkedIn"
          value={linkedin}
          onChange={setLinkedin}
          placeholder="https://linkedin.com/in/..."
        />

        <Input
          label="GitHub"
          value={github}
          onChange={setGithub}
          placeholder="https://github.com/..."
        />

        <Input
          label="Portfolio"
          value={portfolio}
          onChange={setPortfolio}
          placeholder="https://..."
        />
      </div>

      <FormActions
        saving={saving}
        submitLabel="Save Profile"
      />
    </form>
  );
}

/* =========================================================
   SKILL FORM
========================================================= */

function SkillForm({
  saving,
  onSubmit,
}: {
  saving: boolean;
  onSubmit: (
    name: string,
  ) => void;
}) {
  const [name, setName] =
    useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    onSubmit(name);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Skill Name"
        value={name}
        onChange={setName}
        placeholder="React.js"
        required
      />

      <FormActions
        saving={saving}
        submitLabel="Add Skill"
      />
    </form>
  );
}

/* =========================================================
   EDUCATION FORM
========================================================= */

function EducationForm({
  initial,
  saving,
  onSubmit,
}: {
  initial: CandidateEducation | null;
  saving: boolean;
  onSubmit: (
    data: Omit<CandidateEducation, "id">,
  ) => void;
}) {
  const [institution, setInstitution] =
    useState(
      initial?.institution ?? "",
    );

  const [degree, setDegree] =
    useState(
      initial?.degree ?? "",
    );

  const [field, setField] =
    useState(
      initial?.field ?? "",
    );

  const [startYear, setStartYear] =
    useState(
      String(
        initial?.startYear ??
          new Date().getFullYear(),
      ),
    );

  const [endYear, setEndYear] =
    useState(
      String(
        initial?.endYear ??
          new Date().getFullYear(),
      ),
    );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onSubmit({
      institution:
        institution.trim(),
      degree: degree.trim(),
      field: field.trim(),
      startYear: Number(
        startYear,
      ),
      endYear: Number(
        endYear,
      ),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Institution"
        value={institution}
        onChange={setInstitution}
        placeholder="Daffodil International University"
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Degree"
          value={degree}
          onChange={setDegree}
          placeholder="BSc"
          required
        />

        <Input
          label="Field"
          value={field}
          onChange={setField}
          placeholder="Computer Science and Engineering"
          required
        />

        <Input
          label="Start Year"
          type="number"
          value={startYear}
          onChange={setStartYear}
          required
        />

        <Input
          label="End Year"
          type="number"
          value={endYear}
          onChange={setEndYear}
          required
        />
      </div>

      <FormActions
        saving={saving}
        submitLabel={
          initial
            ? "Update Education"
            : "Add Education"
        }
      />
    </form>
  );
}

/* =========================================================
   PROJECT FORM
========================================================= */

function ProjectForm({
  initial,
  saving,
  onSubmit,
}: {
  initial: CandidateProject | null;
  saving: boolean;
  onSubmit: (
    data: Omit<CandidateProject, "id">,
  ) => void;
}) {
  const [name, setName] =
    useState(
      initial?.name ?? "",
    );

  const [description, setDescription] =
    useState(
      initial?.description ?? "",
    );

  const [technologies, setTechnologies] =
    useState(
      initial?.technologies ?? "",
    );

  const [projectUrl, setProjectUrl] =
    useState(
      initial?.projectUrl ?? "",
    );

  const [image, setImage] =
    useState(
      initial?.image ?? "",
    );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onSubmit({
      name: name.trim(),
      description:
        description.trim(),
      technologies:
        technologies.trim(),
      projectUrl:
        projectUrl.trim() || null,
      image:
        image.trim() || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Project Name"
        value={name}
        onChange={setName}
        placeholder="AI Recruitment Platform"
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={setDescription}
        placeholder="Describe what you built..."
        rows={5}
      />

      <Input
        label="Technologies"
        value={technologies}
        onChange={setTechnologies}
        placeholder="Next.js, TypeScript, PostgreSQL, Prisma"
        required
      />

      <Input
        label="Project URL"
        value={projectUrl}
        onChange={setProjectUrl}
        placeholder="https://github.com/..."
      />

      <Input
        label="Image URL"
        value={image}
        onChange={setImage}
        placeholder="https://..."
      />

      <FormActions
        saving={saving}
        submitLabel={
          initial
            ? "Update Project"
            : "Add Project"
        }
      />
    </form>
  );
}

/* =========================================================
   CERTIFICATION FORM
========================================================= */

function CertificationForm({
  initial,
  saving,
  onSubmit,
}: {
  initial: CandidateCertification | null;
  saving: boolean;
  onSubmit: (data: {
    name: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    image?: File;
  }) => void;
}) {
  const [name, setName] =
    useState(
      initial?.name ?? "",
    );

  const [issuer, setIssuer] =
    useState(
      initial?.issuer ?? "",
    );

  const [issueDate, setIssueDate] =
    useState(
      initial?.issueDate
        ? initial.issueDate.slice(
            0,
            10,
          )
        : "",
    );

  const [credentialUrl, setCredentialUrl] =
    useState(
      initial?.credentialUrl ??
        "",
    );

  const [image, setImage] =
    useState<File | undefined>(
      undefined,
    );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onSubmit({
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate,
      credentialUrl:
        credentialUrl.trim() ||
        undefined,
      image,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Certification Name"
        value={name}
        onChange={setName}
        placeholder="AWS Certified Developer"
        required
      />

      <Input
        label="Issuer"
        value={issuer}
        onChange={setIssuer}
        placeholder="Amazon Web Services"
        required
      />

      <Input
        label="Issue Date"
        type="date"
        value={issueDate}
        onChange={setIssueDate}
        required
      />

      <Input
        label="Credential URL"
        value={credentialUrl}
        onChange={setCredentialUrl}
        placeholder="https://..."
      />

      {!initial && (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Certificate Image
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setImage(
                event.target.files?.[0],
              )
            }
            className="block w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
          />
        </label>
      )}

      <FormActions
        saving={saving}
        submitLabel={
          initial
            ? "Update Certification"
            : "Add Certification"
        }
      />
    </form>
  );
}

