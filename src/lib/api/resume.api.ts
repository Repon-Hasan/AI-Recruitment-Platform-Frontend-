import { apiClient } from "@/lib/api/client";

/* =========================================================
Base URL
========================================================= */

const BASE_URL = "/api/v1/resume";

/* =========================================================
Types
========================================================= */

export interface Resume {
id: string;

fileName?: string | null;
fileUrl?: string | null;
url?: string | null;

createdAt?: string;
updatedAt?: string;

[key: string]: unknown;

}

export interface ResumeAnalysis {
id?: string;

resumeId?: string;

summary?: string | null;

skills?: string[];
strengths?: string[];
weaknesses?: string[];

experienceScore?: number;
educationScore?: number;
skillsScore?: number;
overallScore?: number;

suggestions?: string[];

[key: string]: unknown;

}

/* =========================================================
API Response Types
========================================================= */

export interface ApiResponse<T> {
success: boolean;
message: string;
data: T;
}

/* =========================================================
Resume Upload Response
========================================================= */

export interface ResumeUploadResponse {
resume: Resume;
}

/* =========================================================
Resume List Response
========================================================= */

export interface ResumeListResponse {
resumes: Resume[];
}

/* =========================================================
Resume Analysis Response
========================================================= */

export interface ResumeAnalysisResponse {
analysis: ResumeAnalysis;
}

/* =========================================================
Resume API
========================================================= */

export const resumeApi = {
/* =======================================================
UPLOAD RESUME

```
 POST /api/v1/resume/upload

 FormData:
   resume: File
```

======================================================= */

uploadResume: async (file: File) => {
const formData = new FormData();
formData.append("resume", file);

return apiClient<
  ApiResponse<ResumeUploadResponse>
>(`${BASE_URL}/upload`, {
  method: "POST",
  body: formData,
   headers: {
    "Content-Type": "application/json",
  }
  
});


},

/* =======================================================
GET MY RESUMES

```
 GET /api/v1/resume
```

======================================================= */

getMyResumes: async () => {
return apiClient<
ApiResponse<ResumeListResponse>
>(`${BASE_URL}`, {
method: "GET",
});
},

/* =======================================================
GET SINGLE RESUME

```
 GET /api/v1/resume/:id
```

======================================================= */

getResume: async (resumeId: string) => {
return apiClient<ApiResponse<Resume>>(
`${BASE_URL}/${resumeId}`,
{
method: "GET",
},
);
},

/* =======================================================
DELETE RESUME

```
 DELETE /api/v1/resume/:id
```

======================================================= */

deleteResume: async (resumeId: string) => {
return apiClient<ApiResponse<null>>(
`${BASE_URL}/${resumeId}`,
{
method: "DELETE",
},
);
},

/* =======================================================
ANALYZE RESUME

```
 POST /api/v1/resume/:id/analyze
```

======================================================= */

analyzeResume: async (resumeId: string) => {
return apiClient<
ApiResponse<ResumeAnalysisResponse>
>(`${BASE_URL}/${resumeId}/analyze`, {
method: "POST",
});
},

/* =======================================================
GET RESUME ANALYSIS

```
 GET /api/v1/resume/:id/analysis
```

======================================================= */

getResumeAnalysis: async (resumeId: string) => {
return apiClient<
ApiResponse<ResumeAnalysisResponse>
>(`${BASE_URL}/${resumeId}/analysis`, {
method: "GET",
});
},

/* =======================================================
INGEST RESUME

```
 POST /api/v1/resume/:resumeId/ingest
```

======================================================= */

ingestResume: async (resumeId: string) => {
return apiClient<ApiResponse<unknown>>(
`${BASE_URL}/${resumeId}/ingest`,
{
method: "POST",
},
);
},
};
