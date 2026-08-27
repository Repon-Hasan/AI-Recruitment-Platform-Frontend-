"use server";

import { httpClient } from "@/lib/axios/httpClient";

export async function verifyEmailAction(email: string, otp: string) {
  try {
    await httpClient.post("/auth/verify-email", { email, otp });
    return {
      success: true,
      message: "Your email has been verified successfully.",
    };
  } catch (error: unknown) {
    const responseMessage =
      typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
            ?.message
        : undefined;

    return {
      success: false,
      message:
        responseMessage ||
        (error instanceof Error ? error.message : "Unable to verify email."),
    };
  }
}
