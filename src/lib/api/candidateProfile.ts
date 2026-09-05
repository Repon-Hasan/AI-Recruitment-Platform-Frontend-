import { apiClient } from "@/lib/api/client";

/* =========================================================
Base
========================================================= */

const BASE_URL = "/api/v1/candidates";

/* =========================================================
Types
========================================================= */

export interface CandidateProfile {
id?: string;
userId?: string;

name?: string | null;
email?: string | null;
phone?: string | null;
location?: string | null;
bio?: string | null;
image?: string | null;

experience?: string | null;
linkedin?: string | null;
github?: string | null;
portfolio?: string | null;

skills?: CandidateSkill[];
education?: CandidateEducation[];
projects?: CandidateProject[];
certifications?: CandidateCertification[];
}

export interface CandidateSkill {
id?: string;
name: string;
}

export interface CandidateEducation {
id?: string;
institution: string;
degree: string;
field: string;
startYear: number;
endYear: number;
}

export interface CandidateProject {
id?: string;
name: string;
description: string;
technologies: string;
projectUrl?: string | null;
image?: string | null;
}

export interface CandidateCertification {
id?: string;

name: string;
issuer: string;
issueDate: string;
credentialUrl?: string | null;
image?: string | null;
}

/* =========================================================
Generic API Response
========================================================= */

export interface ApiResponse<T> {
success: boolean;
message: string;
data: T;
}

/* =========================================================
Candidate Profile API
========================================================= */

export const candidateProfileApi = {
/* =======================================================
PROFILE
======================================================= */

/**

* GET /api/v1/candidates/me
*
* Get currently logged-in candidate profile
  */
getMyProfile: async () => {
  return apiClient<ApiResponse<CandidateProfile>>(
    `${BASE_URL}/me`,
    {
      method: "GET",
    },
  );
},

updateMyProfile: async (
  payload: Partial<CandidateProfile>,
) => {
  return apiClient<ApiResponse<CandidateProfile>>(
    `${BASE_URL}/me`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
},

/* =======================================================
SKILLS
======================================================= */

/**

* POST /api/v1/candidates/skills
*
* Example:
*
* {
* skills: [
* ```
  { name: "TypeScript" },
  ```
* ```
  { name: "React.js" }
  ```
* ]
* }
  */
  addSkill: async (payload: {
  skills: {
  name: string;
  }[];
  }) => {
  return apiClient<ApiResponse<CandidateSkill[]>>(
  `${BASE_URL}/skills`,
  {
  method: "POST",
  body: JSON.stringify(payload),
  },
  );
  },

/**

* DELETE /api/v1/candidates/skills/:skillId
  */
  deleteSkill: async (skillId: string) => {
  return apiClient<ApiResponse<null>>(
  `${BASE_URL}/skills/${skillId}`,
  {
  method: "DELETE",
  },
  );
  },

/* =======================================================
EDUCATION
======================================================= */

/**

* POST /api/v1/candidates/education
*
* Example:
*
* {
* institution: "Daffodil International University",
* degree: "MSC",
* field: "Computer Science and Engineering",
* startYear: 2022,
* endYear: 2026
* }
  */
  addEducation: async (
  payload: Omit<CandidateEducation, "id">,
  ) => {
  return apiClient<ApiResponse<CandidateEducation>>(
  `${BASE_URL}/education`,
  {
  method: "POST",
  body: JSON.stringify(payload),
  },
  );
  },

/**

* PATCH /api/v1/candidates/education/:id
  */
  updateEducation: async (
  id: string,
  payload: Partial<Omit<CandidateEducation, "id">>,
  ) => {
  return apiClient<ApiResponse<CandidateEducation>>(
  `${BASE_URL}/education/${id}`,
  {
  method: "PATCH",
  body: JSON.stringify(payload),
  },
  );
  },

/**

* DELETE /api/v1/candidates/education/:id
  */
  deleteEducation: async (id: string) => {
  return apiClient<ApiResponse<null>>(
  `${BASE_URL}/education/${id}`,
  {
  method: "DELETE",
  },
  );
  },

/* =======================================================
PROJECTS
======================================================= */

/**

* POST /api/v1/candidates/projects
  */
  createProject: async (
  payload: Omit<CandidateProject, "id">,
  ) => {
  return apiClient<ApiResponse<CandidateProject>>(
  `${BASE_URL}/projects`,
  {
  method: "POST",
  body: JSON.stringify(payload),
  },
  );
  },

/**

* GET /api/v1/candidates/projects
  */
  getMyProjects: async () => {
  return apiClient<ApiResponse<CandidateProject[]>>(
  `${BASE_URL}/projects`,
  {
  method: "GET",
  },
  );
  },

/**

* GET /api/v1/candidates/projects/:projectId
  */
  getProjectById: async (projectId: string) => {
  return apiClient<ApiResponse<CandidateProject>>(
  `${BASE_URL}/projects/${projectId}`,
  {
  method: "GET",
  },
  );
  },

/**

* PATCH /api/v1/candidates/projects/:projectId
  */
  updateProject: async (
  projectId: string,
  payload: Partial<Omit<CandidateProject, "id">>,
  ) => {
  return apiClient<ApiResponse<CandidateProject>>(
  `${BASE_URL}/projects/${projectId}`,
  {
  method: "PATCH",
  body: JSON.stringify(payload),
  },
  );
  },

/**

* DELETE /api/v1/candidates/projects/:projectId
  */
  deleteProject: async (projectId: string) => {
  return apiClient<ApiResponse<null>>(
  `${BASE_URL}/projects/${projectId}`,
  {
  method: "DELETE",
  },
  );
  },

/* =======================================================
CERTIFICATES
======================================================= */

/**

* POST /api/v1/candidates/certificate
*
* IMPORTANT:
* This endpoint uses multer and therefore requires
* multipart/form-data.
*
* Field names:
* * name
* * issuer
* * issueDate
* * credentialUrl
* * image
    */

createCertification: async (payload:{
    name: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    image?: File;
  }) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("issuer", payload.issuer);
  formData.append("issueDate", payload.issueDate);

  if (payload.credentialUrl) {
    formData.append(
      "credentialUrl",
      payload.credentialUrl,
    );
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

//   // DEBUG
//   console.log("========== FORM DATA ==========");

//   for (const [key, value] of formData.entries()) {
//     console.log(key, value);
//   }

//   console.log("================================");

  return apiClient<ApiResponse<CandidateCertification>>(
    `${BASE_URL}/certificate`,
    {
      method: "POST",
      body: formData,
    },
  );
},


/**

* GET /api/v1/candidates/certificate
  */
  getMyCertifications: async () => {
  return apiClient<
  ApiResponse<CandidateCertification[]>
  >(`${BASE_URL}/certificate`, {
  method: "GET",
  });
  },

/**

* GET /api/v1/candidates/certificate/:certificationId
  */
  getCertificationById: async (
  certificationId: string,
  ) => {
  return apiClient<
  ApiResponse<CandidateCertification>
  >(
  `${BASE_URL}/certificate/${certificationId}`,
  {
  method: "GET",
  },
  );
  },

/**

* PATCH /api/v1/candidates/certificate/:certificationId
*
* NOTE:
* Your current backend PATCH route does not have
* multer middleware.
*
* Therefore this sends JSON only.
  */
  updateCertification: async (
  certificationId: string,
  payload: Partial<
  Omit<CandidateCertification, "id" | "image">
  >,
  ) => {
  return apiClient<
  ApiResponse<CandidateCertification>
  >(
  `${BASE_URL}/certificate/${certificationId}`,
  {
  method: "PATCH",
  body: JSON.stringify(payload),
  },
  );
  },

/**

* DELETE /api/v1/candidates/certificate/:certificationId
  */
  deleteCertification: async (
  certificationId: string,
  ) => {
  return apiClient<ApiResponse<null>>(
  `${BASE_URL}/certificate/${certificationId}`,
  {
  method: "DELETE",
  },
  );
  },
  };
