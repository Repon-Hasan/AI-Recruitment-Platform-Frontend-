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

  /*
   * Direct candidate fields returned by your backend
   */
  id?: string;
  name?: string | null;
  email?: string | null;
  profileImage?: string | null;
  image?: string | null;
  phone?: string | null;
  location?: string | null;
  experience?: number | string | null;
  skills?: CandidateSkill[] | string[];
  education?: unknown;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;

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

  resume?: RankedApplicantResume | null;
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

  education?: unknown | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;

  appliedAt?: string | null;

  resume?: RankedApplicantResume | null;
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

/**
 * Converts all supported skill formats into:
 *
 * ["React", "Node.js", "TypeScript"]
 *
 * Supports:
 * - ["React", "Node.js"]
 * - [{ name: "React" }, { name: "Node.js" }]
 */
function normalizeSkills(skills: unknown): string[] {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return skill.trim();
      }

      if (
        typeof skill === "object" &&
        skill !== null &&
        "name" in skill &&
        typeof (skill as { name?: unknown }).name === "string"
      ) {
        return (skill as { name: string }).name.trim();
      }

      return null;
    })
    .filter(
      (skill): skill is string =>
        typeof skill === "string" && skill.length > 0,
    );
}

/* =========================================================
   GET USER
========================================================= */

function getCandidateUser(
  item: BackendRankedApplicant,
  candidate: BackendCandidate | CandidateProfile | null | undefined,
): RankedApplicantUser | null {
  /*
   * Priority:
   *
   * 1. item.user
   * 2. candidate.user
   * 3. candidate.candidateProfile.user
   */

  if (item.user) {
    return item.user;
  }

  if (
    candidate &&
    "user" in candidate &&
    candidate.user
  ) {
    return candidate.user;
  }

  if (
    candidate &&
    "candidateProfile" in candidate &&
    candidate.candidateProfile?.user
  ) {
    return candidate.candidateProfile.user;
  }

  return null;
}

/* =========================================================
   GET CANDIDATE PROFILE
========================================================= */

function getCandidateProfile(
  item: BackendRankedApplicant,
  candidate: BackendCandidate | CandidateProfile | null | undefined,
): CandidateProfile | null {
  /*
   * Priority:
   *
   * 1. item.candidateProfile
   * 2. candidate.candidateProfile
   * 3. candidate itself
   */

  if (item.candidateProfile) {
    return item.candidateProfile;
  }

  if (
    candidate &&
    "candidateProfile" in candidate &&
    candidate.candidateProfile
  ) {
    return candidate.candidateProfile;
  }

  if (candidate && "id" in candidate) {
    return candidate as CandidateProfile;
  }

  return null;
}

/* =========================================================
   MAPPER FUNCTION
========================================================= */
function mapApplicant(item: BackendRankedApplicant): RankedCandidate {
  const candidate =
    item.candidate ??
    item.candidateProfile ??
    null;

  const user = getCandidateUser(item, candidate);

  const candidateProfile = getCandidateProfile(
    item,
    candidate
  );

  // --------------------------------------------------
  // NAME
  // --------------------------------------------------

  const directName =
    typeof item.name === "string"
      ? item.name.trim()
      : "";

  const candidateName =
    candidate &&
    typeof candidate === "object" &&
    "name" in candidate &&
    typeof candidate.name === "string"
      ? candidate.name.trim()
      : "";

  const userName =
    typeof user?.name === "string"
      ? user.name.trim()
      : "";

  const name =
    directName ||
    candidateName ||
    userName ||
    "Unknown Candidate";

  // --------------------------------------------------
  // EMAIL
  // --------------------------------------------------

  const email =
    typeof item.email === "string"
      ? item.email
      : typeof user?.email === "string"
        ? user.email
        : "";

  // --------------------------------------------------
  // PROFILE IMAGE
  // --------------------------------------------------

  const profileImage =
    item.profileImage ??
    item.image ??
    (candidateProfile &&
    typeof candidateProfile === "object" &&
    "profileImage" in candidateProfile
      ? (candidateProfile as { profileImage?: string | null })
          .profileImage
      : null) ??
    (user &&
    typeof user === "object" &&
    "profileImage" in user
      ? (user as { profileImage?: string | null })
          .profileImage
      : null) ??
    null;

  // --------------------------------------------------
  // LOCATION
  // --------------------------------------------------

  const location =
    item.location ??
    (candidateProfile &&
    typeof candidateProfile === "object" &&
    "location" in candidateProfile
      ? (candidateProfile as { location?: string | null })
          .location
      : null) ??
    null;

  // --------------------------------------------------
  // EXPERIENCE
  // --------------------------------------------------

  const experience =
    item.experience ??
    (candidateProfile &&
    typeof candidateProfile === "object" &&
    "experience" in candidateProfile
      ? (candidateProfile as { experience?: number | string | null })
          .experience
      : null) ??
    null;

  // --------------------------------------------------
  // SKILLS
  // --------------------------------------------------

  const skills = normalizeSkills(
    item.skills ??
      (candidateProfile &&
      typeof candidateProfile === "object" &&
      "skills" in candidateProfile
        ? (candidateProfile as { skills?: unknown }).skills
        : null)
  );

  // --------------------------------------------------
  // SCORE
  // --------------------------------------------------

  const score = Number(
    item.matchScore ??
      item.score ??
      item.matchPercentage ??
      0
  );

  // --------------------------------------------------
  // FINAL OBJECT
  // --------------------------------------------------

  return {
    id: item.id ?? item.candidateId,

    candidateId: item.candidateId,

    applicationId: item.applicationId,

    name,

    email,

    profileImage,

    location,

    experience: typeof experience === "string"
      ? Number(experience)
      : typeof experience === "number"
        ? experience
        : null,

    skills,

    education: typeof item.education === "object"
      ? item.education
      : null,

    linkedin: item.linkedin ?? null,

    github: item.github ?? null,

    portfolio: item.portfolio ?? null,

    appliedAt: item.appliedAt ?? null,

    resume: item.resume ?? null,

    resumeUrl: item.resumeUrl ?? null,

    score,

    matchScore: Number(item.matchScore ?? score),

    matchPercentage: Number(
      item.matchPercentage ?? score
    ),

    breakdown: item.breakdown ?? {
      skillScore: 0,
      experienceScore: 0,
      semanticScore: 0,
      locationScore: 0,
    },

    strengths: item.strengths ?? [],

    weaknesses: item.weaknesses ?? [],

    explanation: item.explanation ?? "",
  };
}

/* =========================================================
   API METHODS
========================================================= */

export const candidateRankingApi = {
  /* =======================================================
     RANK APPLICANTS
  ======================================================= */

rankApplicants: async (
  jobId: string,
): Promise<{
  success: boolean;
  message: string;
  data: RankedCandidate[];
}> => {
  if (!jobId) {
    throw new Error("Job ID is required.");
  }

  const response =
    await apiClient<RankApplicantsResponse>(
      `/api/v1/candidate-ranking/jobs/${jobId}/rank-applicants`,
      {
        method: "POST",
      },
    );

  console.log(
    "🔵 Raw rank-applicants API response:",
    response,
  );

  // Backend should return:
  //
  // response.data = [
  //   {
  //     id: "...",
  //     candidateId: "...",
  //     applicationId: "...",
  //     name: "John Doe",
  //     email: "...",
  //     score: 20,
  //     matchScore: 20,
  //     matchPercentage: 20,
  //     ...
  //   }
  // ]

  if (!Array.isArray(response.data)) {
    console.error(
      "❌ Invalid ranking response:",
      response.data,
    );

    return {
      success: response.success,
      message:
        response.message ||
        "No ranked candidates found.",
      data: [],
    };
  }

  const mappedData: RankedCandidate[] =
    response.data.map((item) => {
      console.log(
        "🔥 AI ranking item BEFORE mapping:",
        item,
      );

      const candidate: BackendRankedApplicant = {
        ...item,

        // IMPORTANT:
        // Preserve the direct values returned by
        // the ranking backend.
        id: item.id ?? item.candidateId,

        candidateId: item.candidateId,

        applicationId: item.applicationId,

        name:
          typeof item.name === "string" &&
          item.name.trim()
            ? item.name.trim()
            : "Unknown Candidate",

        email:
          typeof item.email === "string"
            ? item.email
            : null,

        profileImage:
          item.profileImage ?? null,

        phone:
          item.phone ?? null,

        location:
          item.location ?? null,

        experience:
          item.experience ?? null,

        skills:
          item.skills ?? [],

        education:
          item.education ?? null,

        linkedin:
          item.linkedin ?? null,

        github:
          item.github ?? null,

        portfolio:
          item.portfolio ?? null,

        appliedAt:
          item.appliedAt ?? null,

        resume:
          item.resume ?? null,

        resumeUrl:
          item.resumeUrl ?? null,

        score:
          Number(item.score ?? 0),

        matchScore:
          Number(
            item.matchScore ??
            item.score ??
            0,
          ),

        matchPercentage:
          Number(
            item.matchPercentage ??
            item.matchScore ??
            item.score ??
            0,
          ),

        breakdown:
          item.breakdown ?? {
            skillScore: 0,
            experienceScore: 0,
            semanticScore: 0,
            locationScore: 0,
          },

        strengths:
          item.strengths ?? [],

        weaknesses:
          item.weaknesses ?? [],

        explanation:
          item.explanation ?? "",
      };

      console.log(
        "🟡 AI ranking item AFTER normalization:",
        candidate,
      );

      const mapped = mapApplicant(candidate);

      console.log(
        "🟢 Final mapped candidate:",
        mapped,
      );

      return mapped;
    });

  console.log(
    "🟢 Mapped ranked candidates:",
    mappedData,
  );

  return {
    success: response.success,
    message: response.message,
    data: mappedData,
  };
},
  /* =======================================================
     GET APPLICANTS
  ======================================================= */

  getApplicants: async (
    jobId: string,
    params?: RankingFilters,
  ): Promise<{
    success: boolean;
    message: string;
    count: number;
    data: RankedCandidate[];
  }> => {
    if (!jobId) {
      throw new Error(
        "Job ID is required.",
      );
    }

    const searchParams =
      new URLSearchParams();

    if (
      params?.minScore !== undefined
    ) {
      searchParams.set(
        "minScore",
        String(params.minScore),
      );
    }

    if (
      params?.minExperience !== undefined
    ) {
      searchParams.set(
        "minExperience",
        String(params.minExperience),
      );
    }

    if (
      params?.skill?.trim()
    ) {
      searchParams.set(
        "skill",
        params.skill.trim(),
      );
    }

    if (
      params?.location?.trim()
    ) {
      searchParams.set(
        "location",
        params.location.trim(),
      );
    }

    const query =
      searchParams.toString();

    const response =
      await apiClient<ApplicantsResponse>(
        `/api/v1/candidate-ranking/jobs/${jobId}/applicants${
          query
            ? `?${query}`
            : ""
        }`,
        {
          method: "GET",
        },
      );

    console.log(
      "🔵 Raw applicants API response:",
      response,
    );

    const mappedData =
      Array.isArray(response.data)
        ? response.data.map(mapApplicant)
        : [];

    console.log(
      "🟢 Mapped applicants:",
      mappedData,
    );

    return {
      success:
        response.success,

      message:
        response.message,

      count:
        Number(response.count) || 0,

      data:
        mappedData,
    };
  },
};