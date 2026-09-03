import { apiClient } from "./client";

export type RecruiterJob = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  remoteType?: string | null;
  employmentType?: string | null;
  experienceLevel?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  deadline?: string | null;
  status?: string;
  requiredSkills?: Array<{ id?: string; name: string }>;
  _count?: { jobApplications?: number; matches?: number };
  company?: { id: string; name: string };
  createdAt?: string;
};

export type Company = { id: string; name: string; description?: string | null; website?: string | null };
export type Application = {
  id: string;
  status?: string;
  createdAt?: string;
  candidateProfile?: {
    id?: string;
    user?: { name?: string; email?: string };
    headline?: string;
    location?: string;
    phone?: string | null;
    experience?: string | null;
    linkedin?: string | null;
    github?: string | null;
    portfolio?: string | null;
    skills?: Array<{ id?: string; name: string }>;
    education?: Array<{ id?: string; institution: string; degree?: string | null; field?: string | null; startYear?: number | null; endYear?: number | null }>;
    projects?: Array<{ id?: string; name: string; description?: string | null; technologies?: string | null; projectUrl?: string | null }>;
    certifications?: Array<{ id?: string; name: string; issuer?: string | null; credentialUrl?: string | null; issueDate?: string | null }>;
    resumes?: Array<{ id?: string; fileUrl?: string | null; summary?: string | null; rawText?: string | null; createdAt?: string | null }>;
  };
  job?: { id: string; title: string };
};

type Envelope<T> = { data: T };
const unwrap = <T>(response: Envelope<T> | T): T =>
  response && typeof response === "object" && "data" in response ? response.data : response;

export const recruiterApi = {
  getCompany: async () => unwrap(await apiClient<Envelope<Company> | Company>("/company/me")),
  createCompany: async (body: Omit<Company, "id">) => unwrap(await apiClient<Envelope<Company> | Company>("/company/jobs", { method: "POST", body: JSON.stringify(body) })),
  updateCompany: async (body: Partial<Omit<Company, "id">>) => unwrap(await apiClient<Envelope<Company> | Company>("/company/me", { method: "PATCH", body: JSON.stringify(body) })),
  deleteCompany: () => apiClient<void>("/company/me", { method: "DELETE" }),
  getJobs: async () => unwrap(await apiClient<Envelope<RecruiterJob[]> | RecruiterJob[]>("/job/")),
  createJob: async (body: unknown) => unwrap(await apiClient<Envelope<RecruiterJob> | RecruiterJob>("/job/create", { method: "POST", body: JSON.stringify(body) })),
  updateJob: async (id: string, body: unknown) => unwrap(await apiClient<Envelope<RecruiterJob> | RecruiterJob>(`/job/${id}`, { method: "PATCH", body: JSON.stringify(body) })),
  deleteJob: (id: string) => apiClient<void>(`/job/${id}`, { method: "DELETE" }),
  publishJob: async (id: string) => unwrap(await apiClient<Envelope<RecruiterJob> | RecruiterJob>(`/job/${id}/publish`, { method: "PATCH" })),
  closeJob: async (id: string) => unwrap(await apiClient<Envelope<RecruiterJob> | RecruiterJob>(`/job/${id}/close`, { method: "PATCH" })),
  duplicateJob: async (id: string) => unwrap(await apiClient<Envelope<RecruiterJob> | RecruiterJob>(`/job/${id}/duplicate`, { method: "POST" })),
  getApplications: async () => unwrap(await apiClient<Envelope<Application[]> | Application[]>("/recruiter/applications")),
  updateApplication: async (id: string, status: string) => unwrap(await apiClient<Envelope<Application> | Application>(`/recruiter/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })),
  assistant: async (body: { jobId?: string; query: string; limit?: number }) => unwrap(await apiClient<Envelope<unknown> | unknown>("/ai-recruiter/assistant", { method: "POST", body: JSON.stringify(body) })),
  getComplaints: async () => unwrap(await apiClient<Envelope<unknown[]> | unknown[]>("/company/complaints")),
  getPenalties: async () => unwrap(await apiClient<Envelope<unknown[]> | unknown[]>("/company/penalties")),
   
  getApplicationById: async (
    applicationId: string,
  ) => {
    if (!applicationId) {
      throw new Error(
        "Application ID is required",
      );
    }

    const response =
      await apiClient<
        Envelope<Application>
      >(
        `/recruiter/applications/${encodeURIComponent(
          applicationId,
        )}`,
        {
          method: "GET",
        },
      );

    return response.data;
  },
};