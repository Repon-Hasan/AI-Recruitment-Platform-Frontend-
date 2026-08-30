export type RemoteType =
  | "REMOTE"
  | "HYBRID"
  | "ONSITE";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";

export type ExperienceLevel =
  | "ENTRY"
  | "MID"
  | "SENIOR"
  | "LEAD";

export type JobStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED";

export type SkillPriority =
  | "high"
  | "medium"
  | "low";

export interface JobSkill {
  name: string;
  priority: SkillPriority;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface Job {
  id: string;
  companyId: string;

  title: string;
  description: string;

  location: string | null;
  image: string | null;

  remoteType: string;
  employmentType: string;
  experienceLevel: string;

  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;

  deadline: string | null;

  status: string;

  publishedAt: string | null;
  closedAt: string | null;

  createdAt: string;
  updatedAt: string;

  company?: {
    name: string;
  };

  requiredSkills?: {
    name: string;
  }[];
}

export interface JobMatch {
  jobId: string;

  score?: number;
  matchScore?: number;

  matchedSkills?: string[];
  missingSkills?: string[];

  strengths?: string[];
  weaknesses?: string[];
}

export interface SkillGap {
  skill: string;
  priority?: SkillPriority;

  currentLevel?: string;
  requiredLevel?: string;

  gap?: number;
}

export interface SkillGapResponse {
  skills?: SkillGap[];
  missingSkills?: string[];
  matchedSkills?: string[];
  overallGap?: number;
}

export interface MatchSummary {
  score?: number;
  summary?: string;

  strengths?: string[];
  weaknesses?: string[];

  recommendations?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}