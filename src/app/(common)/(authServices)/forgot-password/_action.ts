"use server";

import { httpClient } from "@/lib/axios/httpClient";

export async function requestPasswordResetAction(email: string) {
  try {
    await httpClient.post("/auth/forget-password", { email });
    return { success: true, email };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error ? error.message : "Unable to send reset code.",
    };
  }
}
