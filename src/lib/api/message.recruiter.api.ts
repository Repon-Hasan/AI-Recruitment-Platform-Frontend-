// import { apiClient } from "@/lib/api/client";

// /* =========================================================
//    Types
// ========================================================= */

// export type ConversationParticipantUser = {
//   id: string;
//   name: string | null;
//   email: string | null;
//   image: string | null;
// };

// export type ConversationParticipant = {
//   id: string;
//   userId: string;
//   user?: ConversationParticipantUser | null;
// };

// export type MessageSender = {
//   id: string;
//   name: string | null;
//   image: string | null;
// };

// export type RecruiterMessage = {
//   id: string;
//   content: string;
//   senderId: string;
//   sender?: MessageSender | null;
//   createdAt: string;
//   updatedAt?: string | null;
//   readAt?: string | null;
//   isAutomatic?: boolean;
// };

// export type CandidateProfile = {
//   id: string;
//   user?: ConversationParticipantUser | null;
//   skills?: unknown[];
//   education?: unknown[];
// };

// export type ConversationJob = {
//   id: string;
//   title: string | null;
//   location?: string | null;

//   company?: {
//     id: string;
//     name: string | null;
//     description?: string | null;
//     website?: string | null;
//   } | null;

//   requiredSkills?: unknown[];
// };

// export type JobApplication = {
//   id: string;

//   candidateProfile?: CandidateProfile | null;

//   job?: ConversationJob | null;
// };

// export type RecruiterConversation = {
//   id: string;

//   jobApplicationId: string;

//   createdAt: string;

//   updatedAt: string;

//   jobApplication: JobApplication;

//   participants: ConversationParticipant[];

//   messages: RecruiterMessage[];
// };

// /* =========================================================
//    API Response Types
// ========================================================= */

// export type ConversationsResponse = {
//   success: boolean;
//   message?: string;

//   data?: {
//     conversations?: RecruiterConversation[];
//   };
// };

// export type ConversationResponse = {
//   success: boolean;
//   message?: string;

//   data?: RecruiterConversation;
// };

// /* =========================================================
//    Recruiter Message API
// ========================================================= */

// export const recruiterMessageApi = {
//   /**
//    * Get all recruiter conversations
//    */
//   async getConversations(): Promise<RecruiterConversation[]> {
//     const response =
//       await apiClient<ConversationsResponse>(
//         "/api/v1/conversations",
//       );

//     return response.data?.conversations ?? [];
//   },

//   /**
//    * Get one conversation by application ID
//    */
//   async getConversationByApplication(
//     applicationId: string,
//   ): Promise<RecruiterConversation | null> {
//     if (!applicationId) {
//       throw new Error(
//         "Application ID is required.",
//       );
//     }

//     const response =
//       await apiClient<ConversationResponse>(
//         `/api/v1/conversations/applications/${applicationId}`,
//       );

//     return response.data ?? null;
//   },

//   /**
//    * Get messages for one application
//    */
//   async getMessages(
//     applicationId: string,
//   ): Promise<RecruiterMessage[]> {
//     const conversation =
//       await this.getConversationByApplication(
//         applicationId,
//       );

//     return conversation?.messages ?? [];
//   },
// };

import { apiClient } from "@/lib/api/client";

/* =========================================================
   TYPES
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
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;

  profileImage?: string | null;
  image?: string | null;
  avatar?: string | null;

  githubUrl?: string | null;
  github?: string | null;

  linkedinUrl?: string | null;
  linkedin?: string | null;

  portfolioUrl?: string | null;
  portfolio?: string | null;

  skills?: string[];

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

  jobApplication?: JobApplication | null;

  participants: ConversationParticipant[];

  messages: RecruiterMessage[];
};

/* =========================================================
   API RESPONSE TYPES
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

export type MessagesResponse = {
  success: boolean;

  message?: string;

  data?: RecruiterMessage[];
};

export type SendMessageResponse = {
  success: boolean;

  message?: string;

  data?: RecruiterMessage;
};

export type MarkConversationReadResponse = {
  success: boolean;

  message?: string;

  data?: unknown;
};

/* =========================================================
   RECRUITER MESSAGE API
========================================================= */

export const recruiterMessageApi = {
  /* =======================================================
     GET ALL CONVERSATIONS
  ======================================================= */

  async getConversations(): Promise<RecruiterConversation[]> {
    const response =
      await apiClient<ConversationsResponse>(
        "/api/v1/conversations",
      );

    return response.data?.conversations ?? [];
  },

  /* =======================================================
     GET ONE CONVERSATION
     
     GET /conversations/:conversationId
  ======================================================= */

  async getConversation(
    conversationId: string,
  ): Promise<RecruiterConversation | null> {
    if (!conversationId) {
      throw new Error(
        "Conversation ID is required.",
      );
    }

    const response =
      await apiClient<ConversationResponse>(
        `/api/v1/conversations/${conversationId}`,
      );

    return response.data ?? null;
  },

  /* =======================================================
     GET CONVERSATION BY APPLICATION ID
     
     GET /conversations/applications/:applicationId
     
     Keep this because your page already uses it.
  ======================================================= */

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

  /* =======================================================
     GET MESSAGES
     
     IMPORTANT:
     This endpoint expects CONVERSATION ID,
     not application ID.
     
     GET /conversations/:conversationId/messages
  ======================================================= */

  async getMessages(
    conversationId: string,
  ): Promise<RecruiterMessage[]> {
    if (!conversationId) {
      throw new Error(
        "Conversation ID is required.",
      );
    }

    const response =
      await apiClient<MessagesResponse>(
        `/api/v1/conversations/${conversationId}/messages`,
      );

    return response.data ?? [];
  },

  /* =======================================================
     SEND MESSAGE
     
     POST /conversations/:conversationId/messages
  ======================================================= */

  async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<RecruiterMessage> {
    if (!conversationId) {
      throw new Error(
        "Conversation ID is required.",
      );
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      throw new Error(
        "Message cannot be empty.",
      );
    }

    const response =
      await apiClient<SendMessageResponse>(
        `/api/v1/conversations/${conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content: trimmedContent,
          }),
        },
      );

    if (!response.data) {
      throw new Error(
        response.message ??
          "Message was not sent.",
      );
    }

    return response.data;
  },

  /* =======================================================
     MARK CONVERSATION AS READ
     
     PATCH /conversations/:conversationId/read
  ======================================================= */

  async markAsRead(
    conversationId: string,
  ): Promise<void> {
    if (!conversationId) {
      throw new Error(
        "Conversation ID is required.",
      );
    }

    await apiClient<MarkConversationReadResponse>(
      `/api/v1/conversations/${conversationId}/read`,
      {
        method: "PATCH",
      },
    );
  },
};