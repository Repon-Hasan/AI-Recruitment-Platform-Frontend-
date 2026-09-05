const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type RequestOptions = RequestInit;

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { headers, ...rest } = options;

  const url = `${API_URL}${endpoint}`;

  const requestHeaders = new Headers(headers);

  // =========================================================
  // Detect FormData
  // =========================================================
  const isFormData = rest.body instanceof FormData;

  if (isFormData) {
    // IMPORTANT:
    // Do NOT manually set Content-Type for FormData.
    //
    // Browser automatically sets:
    //
    // multipart/form-data;
    // boundary=----WebKitFormBoundary...
    //
    // This works for:
    // - PNG
    // - JPG / JPEG
    // - PDF
    // - DOCX
    // - Any other allowed file type
    requestHeaders.delete("Content-Type");
  } else {
    // Normal JSON request
    requestHeaders.set("Content-Type", "application/json");
  }

  // =========================================================
  // Send request
  // =========================================================
  const response = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: requestHeaders,
  });

  // =========================================================
  // Handle 204 No Content
  // =========================================================
  if (response.status === 204) {
    return undefined as T;
  }

  // =========================================================
  // Read response safely
  // =========================================================
  const contentType =
    response.headers.get("content-type") || "";

  const isJson = contentType.includes("application/json");

  let data: unknown;

  if (isJson) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text();
  }

  // =========================================================
  // Handle errors
  // =========================================================
  if (!response.ok) {
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data
    ) {
      const message = (data as { message?: unknown }).message;

      throw new Error(
        typeof message === "string"
          ? message
          : `Request to ${url} failed with status ${response.status}`,
      );
    }

    if (
      typeof data === "string" &&
      data.trim()
    ) {
      throw new Error(data);
    }

    throw new Error(
      `Request to ${url} failed with status ${response.status}`,
    );
  }

  // =========================================================
  // Return response
  // =========================================================
  return data as T;
}