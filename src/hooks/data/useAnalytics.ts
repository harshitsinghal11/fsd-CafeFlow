import useSWR from "swr";
import { getInitialDailyStats, type AnalyticsStats } from "@/src/lib/analytics";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.error ?? "Failed to load analytics.");
  return payload.stats as AnalyticsStats;
};

export function useAnalytics() {
  const { data, error, isLoading } = useSWR("/api/admin/analytics", fetcher);

  return {
    stats: data ?? { daily: getInitialDailyStats(), weekTotal: 0, weekCount: 0 },
    isLoading,
    error,
  };
}
