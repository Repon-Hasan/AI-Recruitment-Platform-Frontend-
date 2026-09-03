import { apiClient } from "@/lib/api/client";

/* =========================================================
   Types
========================================================= */

export type ConversationParticipantUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export type ConversationParticipant = {
  id: string;
  userId: string;
  user?: ConversationParticipantUser | null;
};

export type MessageSender = {
  id: string;
  name: string | null;
  image: string | null;
};

export type RecruiterMessage = {
  id: string;
  content: string;
  senderId: string;
  sender?: MessageSender | null;
  createdAt: string;
  updatedAt?: string | null;
  readAt?: string | null;
  isAutomatic?: boolean;
};

export type CandidateProfile = {
  id: string;
  user?: ConversationParticipantUser | null;
  skills?: unknown[];
  education?: unknown[];
};

export type ConversationJob = {
  id: string;
  title: string | null;
  location?: string | null;

  company?: {
    id: string;
    name: string | null;
    description?: string | null;
    website?: string | null;
  } | null;

  requiredSkills?: unknown[];
};

export type JobApplication = {
  id: string;

  candidateProfile?: CandidateProfile | null;

  job?: ConversationJob | null;
};

export type RecruiterConversation = {
  id: string;

  jobApplicationId: string;

  createdAt: string;

  updatedAt: string;

  jobApplication: JobApplication;

  participants: ConversationParticipant[];

  messages: RecruiterMessage[];
};

/* =========================================================
   API Response Types
========================================================= */

export type ConversationsResponse = {
  success: boolean;
  message?: string;

  data?: {
    conversations?: RecruiterConversation[];
  };
};

export type ConversationResponse = {
  success: boolean;
  message?: string;

  data?: RecruiterConversation;
};

/* =========================================================
   Recruiter Message API
========================================================= */

export const recruiterMessageApi = {
  /**
   * Get all recruiter conversations
   */
  async getConversations(): Promise<RecruiterConversation[]> {
    const response =
      await apiClient<ConversationsResponse>(
        "/api/v1/conversations",
      );

    return response.data?.conversations ?? [];
  },

  /**
   * Get one conversation by application ID
   */
  async getConversationByApplication(
    applicationId: string,
  ): Promise<RecruiterConversation | null> {
    if (!applicationId) {
      throw new Error(
        "Application ID is required.",
      );
    }

    const response =
      await apiClient<ConversationResponse>(
        `/api/v1/conversations/applications/${applicationId}`,
      );

    return response.data ?? null;
  },

  /**
   * Get messages for one application
   */
  async getMessages(
    applicationId: string,
  ): Promise<RecruiterMessage[]> {
    const conversation =
      await this.getConversationByApplication(
        applicationId,
      );

    return conversation?.messages ?? [];
  },
};