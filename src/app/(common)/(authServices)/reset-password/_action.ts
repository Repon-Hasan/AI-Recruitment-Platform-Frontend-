"use server";

import { httpClient } from "@/lib/axios/httpClient";

export async function resetPasswordAction(email: string, otp: string, newPassword: string) {
  try {
    await httpClient.post("/auth/reset-password", { email, otp, newPassword });
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error ? error.message : "Unable to reset password.",
    };
  }
}
