import { apiClient } from "@/lib/api/client";

/* =========================================================
   Types
========================================================= */

export type InterviewStatus =
  | "SCHEDULED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED";

export type InterviewType =
  | "VIDEO"
  | "PHONE"
  | "IN_PERSON";

/* =========================================================
   Interview
========================================================= */

export interface Interview {
  id: string;
  jobApplicationId: string;
  scheduledById: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  status: InterviewStatus;
  meetingUrl: string | null;
  title: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   Message
========================================================= */

export interface MessageSender {
  id: string;
  name: string | null;
  profileImage: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isAutomatic: boolean;
  createdAt: string;
  updatedAt: string;
  sender: MessageSender;
}

/* =========================================================
   Conversation Participant
========================================================= */

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  user: MessageSender & {
    email: string | null;
  };
}

/* =========================================================
   Conversation
========================================================= */

export interface Conversation {
  id: string;
  jobApplicationId: string;
  participants: ConversationParticipant[];
  messages: Message[];
}

/* =========================================================
   Create Interview
========================================================= */

export interface CreateInterviewPayload {
  applicationId: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  title?: string;
  notes?: string;
  meetingUrl?: string;
}

/* =========================================================
   Reschedule Interview
========================================================= */

export interface RescheduleInterviewPayload {
  scheduledAt: string;
}

/* =========================================================
   API Response
========================================================= */

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* =========================================================
   Interview API
========================================================= */

export const interviewApi = {

    async getAll(): Promise<Interview[]> {
    const response = await apiClient<
      ApiResponse<Interview[] | { interviews: Interview[] }>
    >("/api/v1/job/interviews/data", {
      method: "GET",
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return response.data?.interviews ?? [];
  },
  /* -------------------------------------------------------
     Create Interview
     POST /api/v1/job/interviews
  ------------------------------------------------------- */

  async create(
    payload: CreateInterviewPayload,
  ): Promise<Interview> {
    const response = await apiClient<ApiResponse<Interview>>(
      "/api/v1/job/interviews",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  /* -------------------------------------------------------
     Get Application Interviews
     GET /api/v1/job/interviews/applications/:applicationId
  ------------------------------------------------------- */

  async getByApplication(
    applicationId: string,
  ): Promise<Interview[]> {
    if (!applicationId) {
      throw new Error("Application ID is required");
    }

    const response = await apiClient<
      ApiResponse<{
        interviews: Interview[];
      }>
    >(
      `/api/v1/job/interviews/applications/${encodeURIComponent(
        applicationId,
      )}`,
      {
        method: "GET",
      },
    );

    return response.data.interviews ?? [];
  },

  /* -------------------------------------------------------
     Reschedule Interview
     PATCH /api/v1/job/interviews/:interviewId/reschedule
  ------------------------------------------------------- */

  async reschedule(
    interviewId: string,
    payload: RescheduleInterviewPayload,
  ): Promise<Interview> {
    if (!interviewId) {
      throw new Error("Interview ID is required");
    }

    const response = await apiClient<ApiResponse<Interview>>(
      `/api/v1/job/interviews/${encodeURIComponent(
        interviewId,
      )}/reschedule`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  /* -------------------------------------------------------
     Cancel Interview
     PATCH /api/v1/job/interviews/:interviewId/cancel
  ------------------------------------------------------- */

  async cancel(
    interviewId: string,
  ): Promise<Interview> {
    if (!interviewId) {
      throw new Error("Interview ID is required");
    }

    const response = await apiClient<ApiResponse<Interview>>(
      `/api/v1/job/interviews/${encodeURIComponent(
        interviewId,
      )}/cancel`,
      {
        method: "PATCH",
      },
    );

    return response.data;
  },

  /* -------------------------------------------------------
     Get Conversation
     GET /api/v1/conversations/applications/:applicationId
  ------------------------------------------------------- */

  async getConversation(
    applicationId: string,
  ): Promise<Conversation> {
    if (!applicationId) {
      throw new Error("Application ID is required");
    }

    const response =
      await apiClient<ApiResponse<Conversation>>(
        `/api/v1/conversations/applications/${encodeURIComponent(
          applicationId,
        )}`,
        {
          method: "GET",
        },
      );

    return response.data;
  },

  /* -------------------------------------------------------
     Send Message
     POST /api/v1/conversations/applications/:applicationId/messages
  ------------------------------------------------------- */

  async sendMessage(
    applicationId: string,
    content: string,
  ): Promise<Message> {
    if (!applicationId) {
      throw new Error("Application ID is required");
    }

    if (!content.trim()) {
      throw new Error("Message cannot be empty");
    }

    const response =
      await apiClient<ApiResponse<Message>>(
        `/api/v1/conversations/applications/${encodeURIComponent(
          applicationId,
        )}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content: content.trim(),
          }),
        },
      );

    return response.data;
  },
};