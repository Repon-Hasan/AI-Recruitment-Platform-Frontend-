import { apiClient } from "./client";

/* =========================================================
   TYPES
========================================================= */

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

  requiredSkills?: Array<{
    id?: string;
    jobId?: string;
    name: string;
    priority?: string | null;
  }>;

  _count?: {
    jobApplications?: number;
    matches?: number;
  };

  company?: {
    id: string;
    name: string;
  };

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  closedAt?: string | null;
};


/* =========================================================
   COMPANY
========================================================= */

export type Company = {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
};


/* =========================================================
   APPLICATION STATUS
========================================================= */

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";


/* =========================================================
   RECRUITER APPLICATION
========================================================= */

export type RecruiterApplication = {
  id: string;

  status?: ApplicationStatus | string;

  coverLetter?: string | null;

  createdAt?: string;
  updatedAt?: string;

  job?: {
    id?: string;
    title?: string;
  };

  candidateProfile?: {
    id?: string;

    headline?: string | null;
    location?: string | null;
    phone?: string | null;
    experience?: string | null;

    linkedin?: string | null;
    github?: string | null;
    portfolio?: string | null;

    profileImage?: string | null;
    image?: string | null;
    avatar?: string | null;

    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };

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
  };

  /* Match information */

  matchScore?: number | null;
  score?: number | null;
  matchPercentage?: number | null;

  aiScore?: number | null;
  aiMatchScore?: number | null;

  match?: {
    score?: number | null;
    percentage?: number | null;
  };

  /* Optional flattened candidate */

  candidate?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};


/* =========================================================
   GENERIC ENVELOPE
========================================================= */

type Envelope<T> = {
  data: T;
};


/* =========================================================
   UNWRAP RESPONSE
========================================================= */

const unwrap = <T>(
  response: Envelope<T> | T,
): T => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    return response.data;
  }

  return response;
};


/* =========================================================
   APPLICATION NORMALIZER
========================================================= */

function normalizeApplications(
  response: unknown,
): RecruiterApplication[] {
  let value = response;

  /*
   * {
   *   data: [...]
   * }
   */
  if (
    value &&
    typeof value === "object" &&
    "data" in value
  ) {
    value = (
      value as {
        data: unknown;
      }
    ).data;
  }

  /*
   * {
   *   data: {
   *     applications: [...]
   *   }
   * }
   */
  if (
    value &&
    typeof value === "object" &&
    "applications" in value
  ) {
    value = (
      value as {
        applications: unknown;
      }
    ).applications;
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value as RecruiterApplication[];
}


/* =========================================================
   RECRUITER API
========================================================= */

export const recruiterApi = {

  /* =======================================================
     COMPANY
  ======================================================= */

  getCompany: async (): Promise<Company> => {
    const response =
      await apiClient<
        Envelope<Company> | Company
      >("/company/me");

    return unwrap(response);
  },


  createCompany: async (
    body: Omit<Company, "id">,
  ): Promise<Company> => {
    const response =
      await apiClient<
        Envelope<Company> | Company
      >("/company/jobs", {
        method: "POST",
        body: JSON.stringify(body),
      });

    return unwrap(response);
  },


  updateCompany: async (
    body: Partial<Omit<Company, "id">>,
  ): Promise<Company> => {
    const response =
      await apiClient<
        Envelope<Company> | Company
      >("/company/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

    return unwrap(response);
  },


  deleteCompany: async () => {
    return apiClient<void>(
      "/company/me",
      {
        method: "DELETE",
      },
    );
  },


  /* =======================================================
     JOBS
  ======================================================= */

  getJobs: async (): Promise<RecruiterJob[]> => {
    const response =
      await apiClient<
        Envelope<RecruiterJob[]> |
        RecruiterJob[]
      >("/job/my-jobs");

    return unwrap(response);
  },


  createJob: async (
    body: unknown,
  ): Promise<RecruiterJob> => {
    const response =
      await apiClient<
        Envelope<RecruiterJob> |
        RecruiterJob
      >("/job/create", {
        method: "POST",
        body: JSON.stringify(body),
      });

    return unwrap(response);
  },


  updateJob: async (
    id: string,
    body: unknown,
  ): Promise<RecruiterJob> => {
    const response =
      await apiClient<
        Envelope<RecruiterJob> |
        RecruiterJob
      >(`/job/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });

    return unwrap(response);
  },


  deleteJob: async (
    id: string,
  ) => {
    return apiClient<void>(
      `/job/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  },


  publishJob: async (
    id: string,
  ): Promise<RecruiterJob> => {
    const response =
      await apiClient<
        Envelope<RecruiterJob> |
        RecruiterJob
      >(
        `/job/${encodeURIComponent(id)}/publish`,
        {
          method: "PATCH",
        },
      );

    return unwrap(response);
  },


  closeJob: async (
    id: string,
  ): Promise<RecruiterJob> => {
    const response =
      await apiClient<
        Envelope<RecruiterJob> |
        RecruiterJob
      >(
        `/job/${encodeURIComponent(id)}/close`,
        {
          method: "PATCH",
        },
      );

    return unwrap(response);
  },


  duplicateJob: async (
    id: string,
  ): Promise<RecruiterJob> => {
    const response =
      await apiClient<
        Envelope<RecruiterJob> |
        RecruiterJob
      >(
        `/job/${encodeURIComponent(id)}/duplicate`,
        {
          method: "POST",
        },
      );

    return unwrap(response);
  },


  /* =======================================================
     APPLICATIONS
  ======================================================= */

  /*
   * Get all recruiter applications
   *
   * GET
   * /recruiter/applications
   */

  getApplications: async (): Promise<
    RecruiterApplication[]
  > => {
    const response =
      await apiClient<unknown>(
        "/recruiter/applications",
      );

    return normalizeApplications(response);
  },


  /*
   * Get applications for one specific job
   *
   * GET
   * /recruiter/jobs/:jobId/applications
   */

  getApplicationsByJob: async (
    jobId: string,
  ): Promise<RecruiterApplication[]> => {
    if (!jobId) {
      throw new Error(
        "Job ID is required",
      );
    }

    const response =
      await apiClient<unknown>(
        `/recruiter/jobs/${encodeURIComponent(
          jobId,
        )}/applications`,
      );

    return normalizeApplications(response);
  },


  /*
   * Get single application
   *
   * GET
   * /recruiter/applications/:applicationId
   */

  getApplicationById: async (
    applicationId: string,
  ): Promise<RecruiterApplication> => {
    if (!applicationId) {
      throw new Error(
        "Application ID is required",
      );
    }

    const response =
      await apiClient<
        Envelope<RecruiterApplication> |
        RecruiterApplication
      >(
        `/recruiter/applications/${encodeURIComponent(
          applicationId,
        )}`,
      );

    return unwrap(response);
  },


  /*
   * Update application status
   *
   * PATCH
   * /recruiter/applications/:applicationId/status
   */

  updateApplicationStatus: async (
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<RecruiterApplication> => {
    if (!applicationId) {
      throw new Error(
        "Application ID is required",
      );
    }

    const response =
      await apiClient<
        Envelope<RecruiterApplication> |
        RecruiterApplication
      >(
        `/recruiter/applications/${encodeURIComponent(
          applicationId,
        )}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        },
      );

    return unwrap(response);
  },


  /*
   * Backward-compatible alias.
   *
   * Existing components using:
   * recruiterApi.updateApplication(...)
   *
   * will continue working.
   */

  updateApplication: async (
    applicationId: string,
    status: ApplicationStatus | string,
  ): Promise<RecruiterApplication> => {
    if (!applicationId) {
      throw new Error(
        "Application ID is required",
      );
    }

    const response =
      await apiClient<
        Envelope<RecruiterApplication> |
        RecruiterApplication
      >(
        `/recruiter/applications/${encodeURIComponent(
          applicationId,
        )}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        },
      );

    return unwrap(response);
  },


  /* =======================================================
     AI RECRUITER ASSISTANT
  ======================================================= */

  assistant: async (
    body: {
      jobId?: string;
      query: string;
      limit?: number;
    },
  ) => {
    const response =
      await apiClient<
        Envelope<unknown> | unknown
      >(
        "/ai-recruiter/assistant",
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );

    return unwrap(response);
  },


  /* =======================================================
     COMPLAINTS
  ======================================================= */

  getComplaints: async () => {
    const response =
      await apiClient<
        Envelope<unknown[]> | unknown[]
      >("/company/complaints");

    return unwrap(response);
  },


  /* =======================================================
     PENALTIES
  ======================================================= */

  getPenalties: async () => {
    const response =
      await apiClient<
        Envelope<unknown[]> | unknown[]
      >("/company/penalties");

    return unwrap(response);
  },
};