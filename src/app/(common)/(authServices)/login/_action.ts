"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { setTokenInCookies } from "@/lib/tokenUtils";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  token?: string;
  user?: {
    role?: UserRole;
  };
  data?: {
    user?: {
      role?: UserRole;
    };
  };
}

export async function loginAction(payload: LoginPayload, requestedPath?: string) {
  try {
    const response = await httpClient.post<LoginResult>("/auth/login", payload);
    const result = response.data;

    if (!result?.accessToken || !result.refreshToken) {
      return { success: false, message: "Login response was incomplete." };
    }

    await setTokenInCookies("accessToken", result.accessToken);
    await setTokenInCookies("refreshToken", result.refreshToken);

    if (result.token) {
      await setTokenInCookies("better-auth.session_token", result.token);
    }

    const role = result.user?.role ?? result.data?.user?.role ?? "CANDIDATE";
    const defaultPath = getDefaultDashboardRoute(role);

    return {
      success: true,
      role,
      redirectPath:
        requestedPath && isValidRedirectForRole(requestedPath, role)
          ? requestedPath
          : defaultPath,
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
        (error instanceof Error ? error.message : "Unable to sign in."),
    };
  }
}
