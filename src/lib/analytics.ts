export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface DayStats {
  count: number;
  revenue: number;
}

export interface AnalyticsStats {
  daily: Record<Weekday, DayStats>;
  weekTotal: number;
  weekCount: number;
}

export interface CompletedOrderRow {
  total_amount: number;
  created_at: string;
}

export const ALL_DAYS: Weekday[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DISPLAY_DAYS: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function getInitialDailyStats(): Record<Weekday, DayStats> {
  return {
    Sunday: { count: 0, revenue: 0 },
    Monday: { count: 0, revenue: 0 },
    Tuesday: { count: 0, revenue: 0 },
    Wednesday: { count: 0, revenue: 0 },
    Thursday: { count: 0, revenue: 0 },
    Friday: { count: 0, revenue: 0 },
    Saturday: { count: 0, revenue: 0 },
  };
}

export function calculateWeeklyStats(
  completedOrders: CompletedOrderRow[],
  now: Date = new Date()
): AnalyticsStats {
  const dailyStats = getInitialDailyStats();
  let totalRevenue = 0;
  let totalOrders = 0;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  completedOrders.forEach((order) => {
    const orderDate = new Date(order.created_at);
    if (orderDate >= startOfWeek) {
      const dayName = ALL_DAYS[orderDate.getDay()];
      dailyStats[dayName].revenue += order.total_amount;
      dailyStats[dayName].count += 1;
      totalRevenue += order.total_amount;
      totalOrders += 1;
    }
  });

  return {
    daily: dailyStats,
    weekTotal: totalRevenue,
    weekCount: totalOrders,
  };
}
