import { apiClient } from "@/lib/api/client";

/* =========================================================
   Notification Types
========================================================= */

export type NotificationType =
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_STATUS_CHANGED"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_ACCEPTED"
  | "INTERVIEW_SCHEDULED"
  | "NEW_CANDIDATE_APPLICATION";

export type NotificationChannel = "IN_APP" | "EMAIL";

export type NotificationStatus =
  | "PENDING"
  | "SENT"
  | "FAILED"
  | "READ";

/* =========================================================
   Notification
========================================================= */

export interface Notification {
  id: string;
  userId: string;

  type: NotificationType;
  channel: NotificationChannel;

  title: string;
  message: string;

  referenceId?: string | null;

  readAt?: string | null;

  status: NotificationStatus;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   Pagination Meta
========================================================= */

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount: number;
}

/* =========================================================
   API Responses
========================================================= */

export interface NotificationResponse {
  notifications: Notification[];
  meta: NotificationMeta;
}

export interface NotificationListApiResponse {
  success: boolean;
  message: string;
  data: NotificationResponse;
}

export interface NotificationArrayApiResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export interface NotificationSingleApiResponse {
  success: boolean;
  message: string;
  data: Notification;
}

export interface UnreadCountApiResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface MessageApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

/* =========================================================
   Notification API
========================================================= */

export const notificationApi = {
  /**
   * Get all notifications
   *
   * GET /notifications?page=1&limit=20
   */
  getAll: async (
    page = 1,
    limit = 20,
  ): Promise<NotificationResponse> => {
    const response =
      await apiClient<NotificationListApiResponse>(
        `/notifications?page=${page}&limit=${limit}`,
        {
          method: "GET",
        },
      );

    return response.data;
  },

  /**
   * Get unread notifications
   *
   * GET /notifications/unread
   */
  getUnread: async (): Promise<Notification[]> => {
    const response =
      await apiClient<NotificationArrayApiResponse>(
        "/notifications/unread",
        {
          method: "GET",
        },
      );

    return response.data;
  },

  /**
   * Get unread notification count
   *
   * GET /notifications/unread-count
   */
  getUnreadCount: async (): Promise<number> => {
    const response =
      await apiClient<UnreadCountApiResponse>(
        "/notifications/unread-count",
        {
          method: "GET",
        },
      );

    return response.data.count;
  },

  /**
   * Mark one notification as read
   *
   * PATCH /notifications/:id/read
   */
  markAsRead: async (
    id: string,
  ): Promise<Notification> => {
    const response =
      await apiClient<NotificationSingleApiResponse>(
        `/notifications/${id}/read`,
        {
          method: "PATCH",
        },
      );

    return response.data;
  },

  /**
   * Mark all notifications as read
   *
   * PATCH /notifications/read-all
   */
  markAllAsRead: async (): Promise<Notification[]> => {
    const response =
      await apiClient<NotificationArrayApiResponse>(
        "/notifications/read-all",
        {
          method: "PATCH",
        },
      );

    return response.data;
  },

  /**
   * Delete one notification
   *
   * DELETE /notifications/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient<void>(
      `/notifications/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  /**
   * Delete all notifications
   *
   * DELETE /notifications
   */
  deleteAll: async (): Promise<void> => {
    await apiClient<void>(
      "/notifications",
      {
        method: "DELETE",
      },
    );
  },
};