import { apiClient } from "@/lib/api/client";

/* =========================================================
   TYPES & INTERFACES
========================================================= */

export interface RankingBreakdown {
  skillScore: number;
  experienceScore: number;
  semanticScore: number;
  locationScore: number;
}

export interface RankedApplicantUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  role?: string;
  status?: string;
  needPasswordChange?: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RankedApplicantResume {
  id?: string;
  title?: string | null;
  fileName?: string | null;
  url?: string | null;
  resumeUrl?: string | null;
}

export interface CandidateSkill {
  id?: string;
  name: string;
}

export interface CandidateProfile {
  id: string;
  userId?: string;
  phone?: string | null;
  location?: string | null;
  experience?: number | string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  skills?: CandidateSkill[] | string[];
  resumes?: RankedApplicantResume[];
  user?: RankedApplicantUser | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCandidate extends CandidateProfile {
  name?: string | null;
  email?: string | null;
  profileImage?: string | null;
  image?: string | null;
  resumeUrl?: string | null;
  candidateProfile?: CandidateProfile | null;
}

export interface BackendRankedApplicant {
  applicationId: string;
  candidateId: string;
  score: number;
  breakdown?: RankingBreakdown;
  candidate?: BackendCandidate | CandidateProfile | null;
  candidateProfile?: CandidateProfile | null;
  user?: RankedApplicantUser | null;
  matchScore?: number | null;
  matchPercentage?: number | null;
  explanation?: string | null;
  strengths?: string[];
  weaknesses?: string[];
  appliedAt?: string | null;
  resumeUrl?: string | null;
}

export interface RankApplicantsResponse {
  success: boolean;
  message: string;
  data: BackendRankedApplicant[];
}

export interface ApplicantsResponse {
  success: boolean;
  message: string;
  count: number;
  data: BackendRankedApplicant[];
}

/* =========================================================
   FRONTEND CANDIDATE TYPES
========================================================= */

export interface RankedCandidate {
  id: string;
  candidateId: string;
  applicationId?: string;
  name: string;
  email?: string | null;
  profileImage?: string | null;
  matchScore?: number;
  matchPercentage?: number;
  score?: number;
  skills: string[];
  experience?: number | null;
  location?: string | null;
  appliedAt?: string | null;
  resumeUrl?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    candidateProfile?: {
      id: string;
      phone?: string | null;
      location?: string | null;
      experience?: string | null;
      linkedin?: string | null;
      github?: string | null;
      portfolio?: string | null;
      skills?: CandidateSkill[];
    } | null;
  };
  breakdown?: RankingBreakdown;
  explanation?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export type CandidateApplicant = RankedCandidate;

export interface RankingFilters {
  minScore?: number;
  minExperience?: number;
  skill?: string;
  location?: string;
}

/* =========================================================
   NORMALIZATION HELPERS
========================================================= */

function normalizeSkills(skills: unknown): string[] {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") return skill;
      if (
        typeof skill === "object" &&
        skill !== null &&
        "name" in skill &&
        typeof (skill as { name?: unknown }).name === "string"
      ) {
        return (skill as { name: string }).name;
      }
      return null;
    })
    .filter((skill): skill is string => typeof skill === "string" && skill.trim().length > 0);
}

function getCandidateUser(
  item: BackendRankedApplicant,
  candidate: BackendCandidate | CandidateProfile | null | undefined
): RankedApplicantUser | null {
  if (item.user) return item.user;
  if (candidate && "user" in candidate && candidate.user) return candidate.user;
  if (candidate && "candidateProfile" in candidate && candidate.candidateProfile?.user) {
    return candidate.candidateProfile.user;
  }
  return null;
}

function getCandidateProfile(
  item: BackendRankedApplicant,
  candidate: BackendCandidate | CandidateProfile | null | undefined
): CandidateProfile | null {
  if (item.candidateProfile) return item.candidateProfile;
  if (candidate && "candidateProfile" in candidate && candidate.candidateProfile) {
    return candidate.candidateProfile;
  }
  if (candidate && "id" in candidate) return candidate as CandidateProfile;
  return null;
}

/* =========================================================
   MAPPER FUNCTION
========================================================= */

function mapApplicant(item: BackendRankedApplicant): RankedCandidate {
  const candidate = item.candidate ?? item.candidateProfile ?? null;
  const user = getCandidateUser(item, candidate);
  const candidateProfile = getCandidateProfile(item, candidate);

  // Extract Name
  const candidateName =
    candidate && typeof candidate === "object" && "name" in candidate && typeof candidate.name === "string"
      ? candidate.name.trim()
      : "";
  const userName = user?.name?.trim() ?? "";
  const name = candidateName || userName || "Unknown Candidate";

  // Extract Email
  const candidateEmail = candidate && "email" in candidate ? candidate.email : null;
  const email = candidateEmail || user?.email || null;

  // Extract Profile Image
  const candidateImage = candidate && "profileImage" in candidate ? candidate.profileImage : null;
  const candidateUserImage = candidate && "image" in candidate ? candidate.image : null;
  const profileImage = candidateImage || candidateUserImage || user?.image || null;

  // Extract Skills
  const directSkills = candidate && "skills" in candidate ? candidate.skills : undefined;
  const profileSkills = candidateProfile?.skills;
  const normalizedDirectSkills = normalizeSkills(directSkills);
  const normalizedProfileSkills = normalizeSkills(profileSkills);
  const skills = normalizedDirectSkills.length > 0 ? normalizedDirectSkills : normalizedProfileSkills;

  // Extract Experience
  const directExperience = candidate && "experience" in candidate ? candidate.experience : null;
  const profileExperience = candidateProfile?.experience ?? null;
  const rawExperience = directExperience ?? profileExperience;
  const experience = rawExperience !== null && rawExperience !== undefined ? Number(rawExperience) : null;

  // Extract Location
  const directLocation = candidate && "location" in candidate ? candidate.location : null;
  const profileLocation = candidateProfile?.location ?? null;
  const location = directLocation || profileLocation || null;

  // Extract Resume URL
  const directResume = candidate && "resumeUrl" in candidate ? candidate.resumeUrl : null;
  const firstResume = candidate && "resumes" in candidate && Array.isArray(candidate.resumes) ? candidate.resumes[0] : null;
  const profileResume = candidateProfile?.resumes?.[0];
  const resumeUrl =
    directResume ||
    item.resumeUrl ||
    firstResume?.resumeUrl ||
    firstResume?.url ||
    profileResume?.resumeUrl ||
    profileResume?.url ||
    null;

  const score = Number(item.score) || 0;

  // Construct Nested User object for UI consumption
  const frontendUser = user
    ? {
        id: user.id,
        name: user.name || name,
        email: user.email || email || "",
        image: user.image ?? profileImage,
        candidateProfile: candidateProfile
          ? {
              id: candidateProfile.id,
              phone: candidateProfile.phone ?? null,
              location: candidateProfile.location ?? location,
              experience:
                candidateProfile.experience != null
                  ? String(candidateProfile.experience)
                  : experience != null
                  ? String(experience)
                  : null,
              linkedin: candidateProfile.linkedin ?? null,
              github: candidateProfile.github ?? null,
              portfolio: candidateProfile.portfolio ?? null,
              skills: Array.isArray(candidateProfile.skills)
                ? candidateProfile.skills.map((s) => (typeof s === "string" ? { name: s } : s))
                : [],
            }
          : null,
      }
    : undefined;

  return {
    id: item.candidateId,
    candidateId: item.candidateId,
    applicationId: item.applicationId,
    name,

    score,
    matchScore: item.matchScore != null ? Number(item.matchScore) : score,
    matchPercentage: item.matchPercentage != null ? Number(item.matchPercentage) : score,
    skills,
    experience,
    location,
   
    appliedAt: item.appliedAt ?? null,
   
    explanation: item.explanation ?? undefined,
    strengths: item.strengths ?? [],
    weaknesses: item.weaknesses ?? [],
    breakdown: item.breakdown,
  };
}

/* =========================================================
   API METHODS
========================================================= */

export const candidateRankingApi = {
  rankApplicants: async (
    jobId: string
  ): Promise<{
    success: boolean;
    message: string;
    data: RankedCandidate[];
  }> => {
    if (!jobId) throw new Error("Job ID is required.");

    const response = await apiClient<RankApplicantsResponse>(
      `/api/v1/candidate-ranking/jobs/${jobId}/rank-applicants`,
      { method: "POST" }
    );

    return {
      success: response.success,
      message: response.message,
      data: Array.isArray(response.data) ? response.data.map(mapApplicant) : [],
    };
  },

  getApplicants: async (
    jobId: string,
    params?: RankingFilters
  ): Promise<{
    success: boolean;
    message: string;
    count: number;
    data: RankedCandidate[];
  }> => {
    if (!jobId) throw new Error("Job ID is required.");

    const searchParams = new URLSearchParams();

    if (params?.minScore !== undefined) {
      searchParams.set("minScore", String(params.minScore));
    }
    if (params?.minExperience !== undefined) {
      searchParams.set("minExperience", String(params.minExperience));
    }
    if (params?.skill?.trim()) {
      searchParams.set("skill", params.skill.trim());
    }
    if (params?.location?.trim()) {
      searchParams.set("location", params.location.trim());
    }

    const query = searchParams.toString();

    const response = await apiClient<ApplicantsResponse>(
      `/api/v1/candidate-ranking/jobs/${jobId}/applicants${query ? `?${query}` : ""}`,
      { method: "GET" }
    );

    return {
      success: response.success,
      message: response.message,
      count: Number(response.count) || 0,
      data: Array.isArray(response.data) ? response.data.map(mapApplicant) : [],
    };
  },
};