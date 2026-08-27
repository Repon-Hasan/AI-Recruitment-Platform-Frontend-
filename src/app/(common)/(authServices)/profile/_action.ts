"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function forward(path: string, init: RequestInit = {}) {
  if (!API_URL) throw new Error("API URL is not configured.");
  const cookieHeader = (await cookies()).getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Cookie: cookieHeader, ...init.headers },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Profile request failed.");
  return body;
}

export async function getProfileAction() {
  try {
    const [userResult, candidateResult] = await Promise.all([
      forward("/auth/getMe"),
      forward("/candidates/me").catch(() => ({ data: null })),
    ]);
    return { success: true, user: userResult.data, candidateProfile: candidateResult.data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to load profile." };
  }
}

export async function updateProfileAction(payload: {
  currentPassword: string;
  name: string;
  phone?: string;
  location?: string;
  experience?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}) {
  try {
    const result = await forward("/auth/profile", { method: "PATCH", body: JSON.stringify(payload) });
    return { success: true, user: result.data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to update profile." };
  }
}
