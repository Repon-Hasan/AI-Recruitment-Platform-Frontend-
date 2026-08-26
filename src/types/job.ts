export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

export type ExperienceLevel =
  | "ENTRY"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "LEAD";

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  company: Company;
  createdAt: string;
  deadline?: string;
}