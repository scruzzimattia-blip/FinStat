const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API Fehler: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getSystemInfo: () =>
    fetchApi<import("@/types").SystemInfo>("/api/system"),
  getSessions: () =>
    fetchApi<import("@/types").Session[]>("/api/sessions"),
  getLibraryCounts: () =>
    fetchApi<import("@/types").LibraryCounts>("/api/library/counts"),
  getRecentItems: () =>
    fetchApi<import("@/types").RecentItem[]>("/api/library/recent"),
  getMostWatched: () =>
    fetchApi<import("@/types").MostWatchedItem[]>("/api/stats/most-watched"),
  getHistory: () =>
    fetchApi<import("@/types").HistoryEntry[]>("/api/history"),
  healthCheck: () =>
    fetchApi<{ status: string }>("/api/health"),
};
