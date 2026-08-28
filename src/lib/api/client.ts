const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || `Request to ${url} failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}