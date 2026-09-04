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

  // console.log("=================================");
  // console.log("API REQUEST");
  // console.log("URL:", url);
  // console.log("METHOD:", rest.method ?? "GET");
  // console.log("=================================");

  const response = await fetch(url, {
    ...rest,

    // VERY IMPORTANT
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

 

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ||
        `Request to ${url} failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}