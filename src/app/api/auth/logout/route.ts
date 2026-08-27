import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST() {
  if (!API_URL) return NextResponse.json({ success: false }, { status: 500 });
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({
      success: response.ok,
      message: response.ok ? "User logged out successfully" : "Logout failed",
    }));

    cookieStore.getAll().forEach(({ name }) => cookieStore.delete(name));

    return NextResponse.json(body, {
      status: response.ok ? 200 : response.status,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
