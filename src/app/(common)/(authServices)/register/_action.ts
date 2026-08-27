"use server";

import { IRegisterPayload, registerZodSchema } from "@/app/zod/auth.validation";
import {
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";

import { httpClient } from "@/lib/axios/httpClient";

export const registerAction = async (
  payload: IRegisterPayload,
  image?: File,
  redirectPath?: string
) => {
  // ==========================================
  // 1. Validate payload
  // ==========================================

  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0]?.message ||
      "Invalid registration data";

    return {
      success: false,
      message: firstError,
    };
  }

  try {
    // ==========================================
    // 2. Create FormData
    // ==========================================

    const formData = new FormData();

    const name =
      `${parsedPayload.data.firstName} ${parsedPayload.data.lastName}`.trim();

    formData.append("name", name);
    formData.append("email", parsedPayload.data.email);
    formData.append("password", parsedPayload.data.password);
    formData.append("role", parsedPayload.data.role);

    // ==========================================
    // 3. Add image
    // ==========================================

    if (image && image.size > 0) {
      formData.append("image", image);
    }

    // ==========================================
    // 4. Call Express backend
    // ==========================================

    const response = await httpClient.post(
      "/auth/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { token, data } = response.data as {
      token?: string;
      data?: {
        user?: {
          role?: UserRole;
        };
      };
    };

    /*
      accessToken,
      refreshToken,
      token,
      data,
    } = response.data.data;
    */

    // Registration must not authenticate the user before the OTP is verified.
    // Return the result so the client can move to the verification step.
    const role = (data?.user?.role ?? parsedPayload.data.role) as UserRole;

    return {
      success: true,
      message: "Account created. Please verify your email.",
      email: parsedPayload.data.email,
      redirectPath:
        redirectPath && isValidRedirectForRole(redirectPath, role)
          ? redirectPath
          : undefined,
      role,
      token,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Next.js redirect must be re-thrown
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error(
      "Registration failed:",
      error
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed",
    };
  }
};