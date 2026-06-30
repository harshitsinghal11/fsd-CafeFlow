import useSWR from "swr";
import { getInitialDailyStats, type AnalyticsStats } from "@/src/lib/analytics";
import { fetchAnalyticsAction } from "@/src/actions/analyticsActions";

const fetcher = async () => {
  try {
    const { stats } = await fetchAnalyticsAction();
    return stats as AnalyticsStats;
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      window.location.href = "/login";
    }
    throw error;
  }
};

export function useAnalytics() {
  const { data, error, isLoading } = useSWR("admin_analytics", fetcher);

  return {
    stats: data ?? { daily: getInitialDailyStats(), weekTotal: 0, weekCount: 0 },
    isLoading,
    error,
  };
}
