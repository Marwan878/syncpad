import { publicConfig } from "@/config/public-config";

export async function fetchWithAuth<T>(
  payload: {
    token: string | null;
    userId?: string | null;
    relativeUrl: string;
  },
  options?: RequestInit
): Promise<T> {
  const response = await fetch(publicConfig.api.url + payload.relativeUrl, {
    headers: {
      Authorization: `Bearer ${payload.token}`,
      userId: payload.userId ?? "",
    },
    ...options,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
