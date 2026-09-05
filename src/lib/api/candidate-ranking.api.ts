import { apiClient } from "@/lib/api/client";

/* =========================================================
   TYPES & INTERFACES
========================================================= */

/* =========================================================
   RANKING BREAKDOWN
========================================================= */

export interface RankingBreakdown {
  skillScore: number;
  experienceScore: number;
  semanticScore: number;
  locationScore: number;
}

/* =========================================================
   CANDIDATE USER
   Based on candidatesApi CandidateUser
========================================================= */

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

  /*
   * Some backend responses may put candidateProfile
   * inside user.
   */
  candidateProfile?: CandidateProfile | null;
}

/* =========================================================
   RESUME
========================================================= */

export interface RankedApplicantResume {
  id?: string;

  title?: string | null;

  fileName?: string | null;

  url?: string | null;

  resumeUrl?: string | null;
}

/* =========================================================
   SKILL
   Based on candidatesApi CandidateSkill
========================================================= */

export interface CandidateSkill {
  id?: string;

  name: string;

  candidateId?: string;
}

/* =========================================================
   EDUCATION
   Based on candidatesApi CandidateEducation
========================================================= */

export interface CandidateEducation {
  id?: string;

  institution: string;

  degree?: string | null;

  field?: string | null;

  startYear?: number | null;

  endYear?: number | null;

  candidateId?: string;
}

/* =========================================================
   PROJECT
   Based on candidatesApi CandidateProject
========================================================= */

export interface CandidateProject {
  id?: string;

  name: string;

  description?: string | null;

  technologies?: string | null;

  projectUrl?: string | null;

  image?: string | null;

  candidateId?: string;
}

/* =========================================================
   CERTIFICATION
   Based on candidatesApi CandidateCertification
========================================================= */

export interface CandidateCertification {
  id?: string;

  name: string;

  issuer?: string | null;

  issueDate?: string | null;

  credentialUrl?: string | null;

  image?: string | null;

  candidateId?: string;
}

/* =========================================================
   CANDIDATE PROFILE
   Aligned with candidatesApi
========================================================= */

export interface CandidateProfile {
  id: string;

  userId?: string;

  phone?: string | null;

  location?: string | null;

  /*
   * Your candidatesApi returns string.
   * Ranking backend may return number.
   *
   * Therefore keep both supported.
   */
  experience?: string | number | null;

  linkedin?: string | null;

  github?: string | null;

  portfolio?: string | null;

  user?: RankedApplicantUser | null;

  skills?: CandidateSkill[] | string[];

  education?: CandidateEducation[];

  projects?: CandidateProject[];

  certifications?: CandidateCertification[];

  resumes?: RankedApplicantResume[];

  /*
   * Some ranking responses may include profile image
   * directly even though candidatesApi doesn't.
   */
  profileImage?: string | null;

  image?: string | null;

  createdAt?: string;

  updatedAt?: string;
}

/* =========================================================
   BACKEND CANDIDATE
========================================================= */

export interface BackendCandidate
  extends CandidateProfile {
  name?: string | null;

  email?: string | null;

  profileImage?: string | null;

  image?: string | null;

  resumeUrl?: string | null;

  candidateProfile?: CandidateProfile | null;
}

/* =========================================================
   BACKEND RANKED APPLICANT
========================================================= */

export interface BackendRankedApplicant {
  /*
   * Application information
   */
  applicationId: string;

  candidateId: string;

  /*
   * Direct candidate fields returned by backend
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

  education?: CandidateEducation[] | unknown;

  projects?: CandidateProject[] | unknown;

  certifications?: CandidateCertification[] | unknown;

  linkedin?: string | null;

  github?: string | null;

  portfolio?: string | null;

  /*
   * Ranking
   */
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

  /*
   * Resume
   */
  resume?: RankedApplicantResume | null;

  resumes?: RankedApplicantResume[];

  resumeUrl?: string | null;
}

/* =========================================================
   API RESPONSES
========================================================= */

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

  phone?: string | null;

  matchScore?: number;

  matchPercentage?: number;

  score?: number;

  skills: string[];

  experience?: number | null;

  location?: string | null;

  education?: CandidateEducation[];

  projects?: CandidateProject[];

  certifications?: CandidateCertification[];

  linkedin?: string | null;

  github?: string | null;

  portfolio?: string | null;

  appliedAt?: string | null;

  resume?: RankedApplicantResume | null;

  resumes?: RankedApplicantResume[];

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

      experience?: string | number | null;

      linkedin?: string | null;

      github?: string | null;

      portfolio?: string | null;

      skills?: CandidateSkill[];

      education?: CandidateEducation[];

      projects?: CandidateProject[];

      certifications?: CandidateCertification[];
    } | null;
  };

  breakdown?: RankingBreakdown;

  explanation?: string;

  strengths?: string[];

  weaknesses?: string[];
}

/* =========================================================
   ALIAS
========================================================= */

export type CandidateApplicant = RankedCandidate;

/* =========================================================
   FILTERS
========================================================= */

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
 * Converts:
 *
 * ["React", "Node.js"]
 *
 * OR:
 *
 * [{ name: "React" }, { name: "Node.js" }]
 *
 * into:
 *
 * ["React", "Node.js"]
 */
function normalizeSkills(
  skills: unknown,
): string[] {
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
        typeof (skill as { name?: unknown }).name ===
          "string"
      ) {
        return (
          skill as { name: string }
        ).name.trim();
      }

      return null;
    })
    .filter(
      (
        skill,
      ): skill is string =>
        typeof skill === "string" &&
        skill.length > 0,
    );
}

/* =========================================================
   NUMBER HELPER
========================================================= */

function normalizeNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

/* =========================================================
   GET CANDIDATE USER
========================================================= */

function getCandidateUser(
  item: BackendRankedApplicant,

  candidate:
    | BackendCandidate
    | CandidateProfile
    | null
    | undefined,
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

  candidate:
    | BackendCandidate
    | CandidateProfile
    | null
    | undefined,
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
   GET PROFILE IMAGE
========================================================= */

function getProfileImage(
  item: BackendRankedApplicant,

  candidate:
    | BackendCandidate
    | CandidateProfile
    | null
    | undefined,

  candidateProfile:
    | CandidateProfile
    | null,
): string | null {
  /*
   * Priority:
   *
   * 1. item.profileImage
   * 2. item.image
   * 3. candidate.profileImage
   * 4. candidate.image
   * 5. candidateProfile.profileImage
   * 6. candidateProfile.image
   * 7. user.image
   */

  if (item.profileImage) {
    return item.profileImage;
  }

  if (item.image) {
    return item.image;
  }

  if (
    candidate &&
    "profileImage" in candidate &&
    candidate.profileImage
  ) {
    return candidate.profileImage;
  }

  if (
    candidate &&
    "image" in candidate &&
    candidate.image
  ) {
    return candidate.image;
  }

  if (
    candidateProfile?.profileImage
  ) {
    return candidateProfile.profileImage;
  }

  if (
    candidateProfile?.image
  ) {
    return candidateProfile.image;
  }

  if (item.user?.image) {
    return item.user.image;
  }

  if (
    candidateProfile?.user?.image
  ) {
    return candidateProfile.user.image;
  }

  return null;
}

/* =========================================================
   GET EDUCATION
========================================================= */

function getEducation(
  item: BackendRankedApplicant,

  candidateProfile:
    | CandidateProfile
    | null,
): CandidateEducation[] {
  if (Array.isArray(item.education)) {
    return item.education as CandidateEducation[];
  }

  if (
    candidateProfile &&
    Array.isArray(candidateProfile.education)
  ) {
    return candidateProfile.education;
  }

  return [];
}

/* =========================================================
   GET PROJECTS
========================================================= */

function getProjects(
  item: BackendRankedApplicant,

  candidateProfile:
    | CandidateProfile
    | null,
): CandidateProject[] {
  if (Array.isArray(item.projects)) {
    return item.projects as CandidateProject[];
  }

  if (
    candidateProfile &&
    Array.isArray(candidateProfile.projects)
  ) {
    return candidateProfile.projects;
  }

  return [];
}

/* =========================================================
   GET CERTIFICATIONS
========================================================= */

function getCertifications(
  item: BackendRankedApplicant,

  candidateProfile:
    | CandidateProfile
    | null,
): CandidateCertification[] {
  if (
    Array.isArray(item.certifications)
  ) {
    return item.certifications as CandidateCertification[];
  }

  if (
    candidateProfile &&
    Array.isArray(
      candidateProfile.certifications,
    )
  ) {
    return candidateProfile.certifications;
  }

  return [];
}

/* =========================================================
   GET RESUME
========================================================= */

function getResume(
  item: BackendRankedApplicant,

  candidateProfile:
    | CandidateProfile
    | null,
): RankedApplicantResume | null {
  if (item.resume) {
    return item.resume;
  }

  if (
    Array.isArray(item.resumes) &&
    item.resumes.length > 0
  ) {
    return item.resumes[0];
  }

  if (
    candidateProfile &&
    Array.isArray(candidateProfile.resumes) &&
    candidateProfile.resumes.length > 0
  ) {
    return candidateProfile.resumes[0];
  }

  return null;
}

/* =========================================================
   MAPPER FUNCTION
========================================================= */

function mapApplicant(
  item: BackendRankedApplicant,
): RankedCandidate {
  /*
   * Candidate can come from different backend shapes.
   */

  const candidate =
    item.candidate ??
    item.candidateProfile ??
    null;

  /* -------------------------------------------------------
     USER
  ------------------------------------------------------- */

  const user =
    getCandidateUser(
      item,
      candidate,
    );

  /* -------------------------------------------------------
     CANDIDATE PROFILE
  ------------------------------------------------------- */

  const candidateProfile =
    getCandidateProfile(
      item,
      candidate,
    );

  /* -------------------------------------------------------
     NAME
  ------------------------------------------------------- */

  const directName =
    typeof item.name === "string"
      ? item.name.trim()
      : "";

  const candidateName =
    candidate &&
    typeof candidate === "object" &&
    "name" in candidate &&
    typeof candidate.name ===
      "string"
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

  /* -------------------------------------------------------
     EMAIL
  ------------------------------------------------------- */

  const email =
    typeof item.email === "string"
      ? item.email
      : typeof (
          candidate &&
          "email" in candidate
            ? candidate.email
            : null
        ) === "string"
        ? (
            candidate as unknown as {
              email: string;
            }
          ).email
        : typeof user?.email ===
            "string"
          ? user.email
          : null;

  /* -------------------------------------------------------
     PROFILE IMAGE
  ------------------------------------------------------- */

  const profileImage =
    getProfileImage(
      item,
      candidate,
      candidateProfile,
    );

  /* -------------------------------------------------------
     PHONE
  ------------------------------------------------------- */

  const phone =
    item.phone ??
    candidateProfile?.phone ??
    null;

  /* -------------------------------------------------------
     LOCATION
  ------------------------------------------------------- */

  const location =
    item.location ??
    candidateProfile?.location ??
    null;

  /* -------------------------------------------------------
     EXPERIENCE
  ------------------------------------------------------- */

  const experience =
    normalizeNumber(
      item.experience ??
        candidateProfile?.experience ??
        null,
    );

  /* -------------------------------------------------------
     SKILLS
  ------------------------------------------------------- */

  const skills =
    normalizeSkills(
      item.skills ??
        candidateProfile?.skills ??
        [],
    );

  /* -------------------------------------------------------
     EDUCATION
  ------------------------------------------------------- */

  const education =
    getEducation(
      item,
      candidateProfile,
    );

  /* -------------------------------------------------------
     PROJECTS
  ------------------------------------------------------- */

  const projects =
    getProjects(
      item,
      candidateProfile,
    );

  /* -------------------------------------------------------
     CERTIFICATIONS
  ------------------------------------------------------- */

  const certifications =
    getCertifications(
      item,
      candidateProfile,
    );

  /* -------------------------------------------------------
     RESUME
  ------------------------------------------------------- */

  const resume =
    getResume(
      item,
      candidateProfile,
    );

  /* -------------------------------------------------------
     RESUME URL
  ------------------------------------------------------- */

  const resumeUrl =
    item.resumeUrl ??
    resume?.resumeUrl ??
    resume?.url ??
    null;

  /* -------------------------------------------------------
     SCORE
  ------------------------------------------------------- */

  const score = Number(
    item.matchScore ??
      item.score ??
      item.matchPercentage ??
      0,
  );

  /* -------------------------------------------------------
     MATCH SCORE
  ------------------------------------------------------- */

  const matchScore =
    Number(
      item.matchScore ??
        score,
    );

  /* -------------------------------------------------------
     MATCH PERCENTAGE
  ------------------------------------------------------- */

  const matchPercentage =
    Number(
      item.matchPercentage ??
        item.matchScore ??
        item.score ??
        0,
    );

  /* -------------------------------------------------------
     BREAKDOWN
  ------------------------------------------------------- */

  const breakdown =
    item.breakdown ?? {
      skillScore: 0,

      experienceScore: 0,

      semanticScore: 0,

      locationScore: 0,
    };

  /* -------------------------------------------------------
     FINAL OBJECT
  ------------------------------------------------------- */

  return {
    id:
      item.id ??
      item.candidateId,

    candidateId:
      item.candidateId,

    applicationId:
      item.applicationId,

    name,

    email,

    profileImage,

    phone,

    location,

    experience,

    skills,

    education,

    projects,

    certifications,

    linkedin:
      item.linkedin ??
      candidateProfile?.linkedin ??
      null,

    github:
      item.github ??
      candidateProfile?.github ??
      null,

    portfolio:
      item.portfolio ??
      candidateProfile?.portfolio ??
      null,

    appliedAt:
      item.appliedAt ??
      null,

    resume,

    resumes:
      item.resumes ??
      candidateProfile?.resumes ??
      [],

    resumeUrl,

    score,

    matchScore,

    matchPercentage,

    breakdown,

    strengths:
      item.strengths ??
      [],

    weaknesses:
      item.weaknesses ??
      [],

    explanation:
      item.explanation ??
      "",

    user: user
      ? {
          id: user.id,

          name:
            user.name ??
            name,

          email:
            user.email,

          image:
            user.image ??
            profileImage,

          candidateProfile:
            candidateProfile
              ? {
                  id:
                    candidateProfile.id,

                  phone:
                    candidateProfile.phone ??
                    null,

                  location:
                    candidateProfile.location ??
                    null,

                  experience:
                    candidateProfile.experience ??
                    null,

                  linkedin:
                    candidateProfile.linkedin ??
                    null,

                  github:
                    candidateProfile.github ??
                    null,

                  portfolio:
                    candidateProfile.portfolio ??
                    null,

                  skills:
                    Array.isArray(
                      candidateProfile.skills,
                    )
                      ? candidateProfile.skills.filter(
                          (
                            skill,
                          ): skill is CandidateSkill =>
                            typeof skill ===
                              "object" &&
                            skill !== null &&
                            "name" in skill,
                        )
                      : [],

                  education:
                    candidateProfile.education ??
                    [],

                  projects:
                    candidateProfile.projects ??
                    [],

                  certifications:
                    candidateProfile.certifications ??
                    [],
                }
              : null,
        }
      : undefined,
  };
}

/* =========================================================
   API METHODS
========================================================= */

export const candidateRankingApi = {
  /* =======================================================
     RANK APPLICANTS

     POST
     /api/v1/candidate-ranking/jobs/:jobId/rank-applicants
  ======================================================= */

  rankApplicants: async (
    jobId: string,
  ): Promise<{
    success: boolean;

    message: string;

    data: RankedCandidate[];
  }> => {
    if (!jobId) {
      throw new Error(
        "Job ID is required.",
      );
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

    if (
      !Array.isArray(response.data)
    ) {
      console.error(
        "❌ Invalid ranking response:",
        response.data,
      );

      return {
        success:
          response.success,

        message:
          response.message ||
          "No ranked candidates found.",

        data: [],
      };
    }

    const mappedData: RankedCandidate[] =
      response.data.map(
        (item) => {
          console.log(
            "🔥 AI ranking item BEFORE mapping:",
            item,
          );

          /*
           * Keep the backend data.
           *
           * Do not destroy nested candidate/profile
           * information.
           */
          const candidate: BackendRankedApplicant =
            {
              ...item,

              id:
                item.id ??
                item.candidateId,

              candidateId:
                item.candidateId,

              applicationId:
                item.applicationId,

              name:
                typeof item.name ===
                  "string" &&
                item.name.trim()
                  ? item.name.trim()
                  : undefined,

              email:
                typeof item.email ===
                  "string"
                  ? item.email
                  : undefined,

              profileImage:
                item.profileImage ??
                item.image ??
                null,

              image:
                item.image ??
                null,

              phone:
                item.phone ??
                null,

              location:
                item.location ??
                null,

              experience:
                item.experience ??
                null,

              skills:
                item.skills ??
                [],

              education:
                item.education ??
                null,

              projects:
                item.projects ??
                null,

              certifications:
                item.certifications ??
                null,

              linkedin:
                item.linkedin ??
                null,

              github:
                item.github ??
                null,

              portfolio:
                item.portfolio ??
                null,

              appliedAt:
                item.appliedAt ??
                null,

              resume:
                item.resume ??
                null,

              resumes:
                item.resumes ??
                [],

              resumeUrl:
                item.resumeUrl ??
                null,

              score:
                Number(
                  item.score ??
                    0,
                ),

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
                item.strengths ??
                [],

              weaknesses:
                item.weaknesses ??
                [],

              explanation:
                item.explanation ??
                "",
            };

          console.log(
            "🟡 AI ranking item AFTER normalization:",
            candidate,
          );

          const mapped =
            mapApplicant(
              candidate,
            );

          console.log(
            "🟢 Final mapped candidate:",
            mapped,
          );

          return mapped;
        },
      );

    console.log(
      "🟢 Mapped ranked candidates:",
      mappedData,
    );

    return {
      success:
        response.success,

      message:
        response.message,

      data:
        mappedData,
    };
  },

  /* =======================================================
     GET APPLICANTS

     GET
     /api/v1/candidate-ranking/jobs/:jobId/applicants
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

    /* -----------------------------------------------------
       MIN SCORE
    ----------------------------------------------------- */

    if (
      params?.minScore !==
      undefined
    ) {
      searchParams.set(
        "minScore",
        String(
          params.minScore,
        ),
      );
    }

    /* -----------------------------------------------------
       MIN EXPERIENCE
    ----------------------------------------------------- */

    if (
      params?.minExperience !==
      undefined
    ) {
      searchParams.set(
        "minExperience",
        String(
          params.minExperience,
        ),
      );
    }

    /* -----------------------------------------------------
       SKILL
    ----------------------------------------------------- */

    if (
      params?.skill?.trim()
    ) {
      searchParams.set(
        "skill",
        params.skill.trim(),
      );
    }

    /* -----------------------------------------------------
       LOCATION
    ----------------------------------------------------- */

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
      Array.isArray(
        response.data,
      )
        ? response.data.map(
            mapApplicant,
          )
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
        Number(
          response.count,
        ) || 0,

      data:
        mappedData,
    };
  },
};